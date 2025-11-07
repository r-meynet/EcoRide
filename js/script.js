// Création d'une fonction pour récupérer la moyenne des avis et la transformer en étoiles
function createStars() {
    document.querySelectorAll(".rating").forEach((el) => {
        const rating = parseFloat(el.getAttribute("data-rating"));
        let html = "";

        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                html += '<i class="bi bi-star-fill"></i>';
            } else if (rating >= i - 0.5) {
                html += '<i class="bi bi-star-half"></i>';
            } else {
                html += '<i class="bi bi-star"></i>';
            }
        }

        el.innerHTML = html;
    });
}

// Requête auprès de la base de données test en json
let tripCache = [];

fetch("../data/data.json")
    .then((reponse) => reponse.json())
    .then((data) => {
        tripCache = data.trips;
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
    } else {
        container.innerHTML =
            '<h4 class="text-center">Aucun trajet ne correspond aux critères de recherche</h4>';
    }

    // Afficher le nombre de résultat en haut du containerr
    afficherNombreResultat(nombreTrajets, htmlResultats);
}

// Fonction pour créer une carte trajet
function creationCarteTrajet(trip, destination) {
    // Gestion de l'affichage d'un trajet écologique
    let classEcoCard = "";
    let classEcoBtn = "";
    let classEcoLogo = "";

    if (trip.eco) {
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
    <div class="${classEcoCard}">
    <div class="row row-cols-2 row-cols-lg-4 gx-3 align-items-center">
    <div class="col d-flex flex-column order-lg-1 px-4 py-2">
    <div class="d-flex flex-row">
    <img src="${trip.photo}" class="profile-picture" alt="Photo de profil de ${trip.pseudo}" />
    <h6 class="fs-5 ps-2">${trip.pseudo}</h6>
    </div>
    <div class="text-primary rating" data-rating="${trip.note}"></div>
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
    <div class="col"><i class="bi bi-people-fill d-lg-none"></i>${
        trip.places_disponibles
    } <span class="d-none d-lg-inline">places disponibles</span></div>
    </div>
    <div class="col order-lg-4 px-4 py-2 text-center my-auto">
    <a href="/details" class="${classEcoBtn}">+ détails</a>
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
