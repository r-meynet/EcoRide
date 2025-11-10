// Requête auprès de la base de données test en json
let tripBrut = [];

fetch("../data/data.json")
    .then((reponse) => reponse.json())
    .then((data) => {
        tripBrut = data.trips;
    });

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
