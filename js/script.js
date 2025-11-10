// Création d'une fonction pour récupérer la moyenne des avis et la transformer en étoiles
function createStars() {
    document.querySelectorAll(".rating").forEach((el) => {
        const rating = parseFloat(el.getAttribute("data-rating"));
        let html = '<span class="text-primary">';

        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                html += '<i class="bi bi-star-fill"></i>';
            } else if (rating >= i - 0.5) {
                html += '<i class="bi bi-star-half"></i>';
            } else {
                html += '<i class="bi bi-star"></i>';
            }
        }

        html += `<br /></span> ${rating} / 5`;

        el.innerHTML = html;
    });
}

// Requête auprès de la base de données test en json
let tripBrut = [];

fetch("../data/data.json")
    .then((reponse) => reponse.json())
    .then((data) => {
        tripBrut = data.trips;
    });

// Fonction qui va afficher les trajets
function affichageTrajets(trips) {
    // Variables pour l'affichage sur la page
    const container = document.getElementById("affichage-trajets");
    const htmlResultats = document.getElementById("nombreResultats");
    let nombreTrajets = 0;

    // On vide le contenu existant
    container.innerHTML = "";

    // Affichage si trips contient des éléments
    if (trips.length > 0) {
        // Boucle parmis tous les trajets
        trips.forEach((trip) => {
            // Création de la carte trajet si des places sont toujours disponibles
            if (trip.places_disponibles > 0) {
                creationCarteTrajet(trip, container);
                nombreTrajets += 1;
            }
        });

        // Affichage des étoiles d'avis
        createStars();
    } else if (isEmpty("recherche"))
        container.innerHTML =
            '<h4 class="text-center">Veuillez remplir des informations de recherche</h4>';
    else {
        container.innerHTML =
            '<h4 class="text-center">Aucun trajet ne correspond aux critères de recherche</h4>';
    }

    // Afficher le nombre de résultat en haut du containerr
    afficherNombreResultat(nombreTrajets, htmlResultats);

    // Récupérer la liste des boutons détail
    getListBtnDetail();
}

// Fonction pour créer une carte trajet
function creationCarteTrajet(trip, destination) {
    // Gestion de l'affichage d'un trajet écologique
    let classEcoCard = "";
    let classEcoBtn = "";
    let classEcoLogo = "";

    if (trip.energie_vehicule == "Electrique") {
        classEcoCard = "card mb-4 border-3 border-primary shadow";
        classEcoBtn = "btn btn-primary";
        classEcoLogo = "fs-5 text-primary";
    } else {
        classEcoCard = "card mb-4 border-0 shadow";
        classEcoBtn = "btn btn-outline-secondary";
        classEcoLogo = "d-none";
    }

    // Contenu de la carte
    const cardTrajet = `
    <div class="${classEcoCard}" id="${trip.id}">
    <div class="row row-cols-2 row-cols-lg-4 gx-3 align-items-center">
    <div class="col d-flex flex-column order-lg-1 px-4 py-2">
    <div class="d-flex flex-row">
    <img src="${trip.photo}" class="profile-picture-sm" alt="Photo de profil de ${trip.pseudo}" />
    <h6 class="fs-5 ps-2">${trip.pseudo}</h6>
    </div>
    <div class="rating" data-rating="${trip.note}"></div>
    </div>
    <div class="col order-lg-2 ps-3 py-2">
    <div>🚗 ${trip.ville_depart} → ${trip.ville_arrivee}</div>
    <div>
    <div>📅 ${formatISOToFR(trip.date)}</div>
    <div>⏰ ${trip.heure_depart} - ${trip.heure_arrivee}</div>
    </div>
    </div>
    <div class="col row row-cols-2 row-cols-lg-1 order-lg-3 ps-3 py-2 mb-auto my-lg-auto text-center fs-5">
    <div class="col pe-0">${trip.credit} <i class="bi bi-coin"></i></div>
    <div class="col"><i class="bi bi-people-fill d-lg-none"></i> ${
        trip.places_disponibles
    } <span class="d-none d-lg-inline">places disponibles</span></div>
    </div>
    <div class="col order-lg-4 px-4 py-2 text-center my-auto">
    <a href="/details" class="${classEcoBtn} detail-covoiturage" data-tripId="${
        trip.id
    }">+ détails</a>
    <div class="${classEcoLogo}">eco <i class="bi bi-leaf-fill"></i></div>
    </div>
    </div>
    </div>
    `;

    destination.innerHTML += cardTrajet;
}

// Fonction d'affichage du nombre de résultats
function afficherNombreResultat(nombreResultats, destination) {
    if (nombreResultats <= 1) {
        destination.innerHTML = `${nombreResultats} résultat`;
    } else {
        destination.innerHTML = `${nombreResultats} résultats`;
    }
}

// Fonction pour la recherche de trajets
function rechercheTrajets(trips, villeDepart, villeArrivee, dateTrajet) {
    // Convertir les arguments en minuscule
    villeDepart = villeDepart.toLowerCase();
    villeArrivee = villeArrivee.toLowerCase();

    // Filtre des trajets avec les arguments du formulaire
    const trajetsRecherche = trips.filter(
        (trip) =>
            (!villeDepart || trip.ville_depart.toLowerCase() === villeDepart) &&
            (!villeArrivee || trip.ville_arrivee.toLowerCase() === villeArrivee) &&
            (!dateTrajet || trip.date === dateTrajet)
    );

    // Si aucun input de recherche n'est renseigné, rien à afficher
    if (villeDepart == "" && villeArrivee == "" && dateTrajet == "") {
        return [];
    }

    return trajetsRecherche;
}

// Fonction qui écrit le contenu du sessionStorage dans les input
function storageToInput(inputDepart, inputArrivee, inputDate) {
    const depart = sessionStorage.getItem("depart");
    const arrivee = sessionStorage.getItem("arrivee");
    const dateTrajet = sessionStorage.getItem("date");

    if (depart) inputDepart.value = depart;
    if (arrivee) inputArrivee.value = arrivee;
    if (dateTrajet) inputDate.value = dateTrajet;
}

// Fonction pour convertir la date ISO en date FR affichable
function formatISOToFR(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
}

// Fonctions pour gérer la mise en cache des tableaux de covoiturages
function setTripsInCache(trips) {
    sessionStorage.setItem("trips", JSON.stringify(trips));
}
function getTripsInCache() {
    const trips = sessionStorage.getItem("trips");
    return JSON.parse(trips);
}

// Fonction pour convertir chaine de caractère en heure
function texteToHeures(texte) {
    if (!texte) return "";
    const [heures, minutes] = texte.split(":");
    return Number(heures) + Number(minutes) / 60;
}

// Fonction booléenne qui vérifie si les champs de recherche sont remplis
function isEmpty(idForm) {
    const formulaire = document.getElementById(idForm);
    const inputs = formulaire.querySelectorAll("input");
    let compteur = 0;

    inputs.forEach((input) => {
        if (input.value.trim() !== "") {
            compteur += 1;
        }
    });

    if (compteur == 0) {
        return true;
    } else {
        return false;
    }
}
