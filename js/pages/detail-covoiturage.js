// Fonction pour afficher les détails du trajet en fonction de l'id dasn sessionStorage
// (qui correspond à l'id du trajet cliqué sur la page covoiturages)
function creationCarteDetails(trips, id) {
    // Déclaration des container à renseigner
    const containerDetailCard = document.getElementById("detail-card");
    const containerPicture = document.getElementById("profile-picture");
    const containerConducteur = document.getElementById("conducteur");
    const containerEcoLabel = document.getElementById("eco-label");
    const containerPlacesDispo = document.getElementById("places-dispo");
    const containerCredits = document.getElementById("credits");
    const containerTrajet = document.getElementById("trajet");
    const containerVehicule = document.getElementById("vehicule");
    const containerPreferences = document.getElementById("preferences");
    const containerBtnCredit = document.getElementById("btn-credit");

    // On récupère le bon trajet
    const trajet = trips.find((trip) => trip.id == id);

    // Gestion du pluriel du nombre de places disponibles
    let placeDispoText = "";
    if (trajet.places_disponibles > 1) {
        placeDispoText = "places disponibles";
    } else {
        placeDispoText = "place disponible";
    }

    // Implémentation du html
    containerDetailCard.className = isTripEco(trajet)
        ? "card mb-4 border-3 border-primary shadow col-lg-9 mx-lg-auto"
        : "card mb-4 shadow col-lg-9 mx-lg-auto";
    containerPicture.innerHTML = `<img src="${trajet.photo}" class="profile-picture-lg" alt="Photo de profil de ${trajet.pseudo}" />`;
    containerConducteur.innerHTML = `<div>
                                        <h6 class="fs-5">${trajet.pseudo}</h6>
                                    </div>
                                        <div class="rating" data-rating="${trajet.note}">
                                    </div>
                                    <div>
                                        <a href="/avis">voir les avis</a>
                                    </div>`;
    containerEcoLabel.className = isTripEco(trajet)
        ? "col-3 fs-5 text-primary mb-auto text-end pe-3 ps-0"
        : "d-none";
    containerPlacesDispo.innerHTML = `<i class="bi bi-people-fill d-lg-none"></i> ${trajet.places_disponibles} ${placeDispoText}`;
    containerCredits.innerHTML = `<span class="text-primary">${trajet.credit} / cred.user</span>
                                    <i class="bi bi-coin"></i>
                                    crédits`;
    containerTrajet.innerHTML = `<div><h2>🚗 ${trajet.ville_depart} → ${
        trajet.ville_arrivee
    }</h2></div>
                                <div class="fs-4">📅 ${formatISOToFR(trajet.date)}</div>
                                <div class="fs-4">⏰ ${trajet.heure_depart} - ${
        trajet.heure_arrivee
    }</div>`;
    containerVehicule.innerHTML = `<div class="my-1">Marque : ${trajet.marque_vehicule} - ${trajet.modele_vehicule} - ${trajet.annee_vehicule}</div>
                                <div class="my-1">Energie : ${trajet.energie_vehicule}</div>`;
    containerBtnCredit.innerHTML = `<a href="#" class="btn btn-primary my-2">Participer à ce trajet - ${trajet.credit} crédits</a>`;

    // Particularité avec les préférences
    containerPreferences.innerHTML = "";
    trajet.preferences.forEach((pref, index) => {
        containerPreferences.innerHTML += pref;

        // Ajoute un retour ligne sauf après le dernier élément
        if (index < trajet.preferences.length - 1) {
            containerPreferences.innerHTML += "<br />";
        }
    });
}

// Fonction pour savoir si un trajet est écologique (effectué avec un véhicule électrique)
function isTripEco(trip) {
    return trip.energie_vehicule == "Electrique";
}

// Au chargement de la page, on récupère l'id du trajet cliqué pour afficher les détails
const idTrajet = sessionStorage.getItem("tripId");

creationCarteDetails(tripBrut, idTrajet);

createStars();
