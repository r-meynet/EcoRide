// On affiche les covoiturages issus de la recherche en sessionStorage
// (recherche qui vient de la page home)
const tripTri = rechercheTrajets(
    tripBrut,
    sessionStorage.getItem("depart"),
    sessionStorage.getItem("arrivee"),
    sessionStorage.getItem("date")
);

// Affichage des critères de recherche dans les inputs
const inputDepartCovoit = document.getElementById("villeDepartCovoit");
const inputArriveeCovoit = document.getElementById("villeArriveeCovoit");
const inputDateCovoit = document.getElementById("dateCovoit");

storageToInput(inputDepartCovoit, inputArriveeCovoit, inputDateCovoit);

// #
// Affichage des covoiturages disponibles
affichageTrajets(tripTri);

// #
// Mise en cache du tableau de covoiturages
setTripsInCache(tripTri);

//
//
//
//
//
//
// START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AFFICHAGE TRAJETS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

// Fonction d'affichage du nombre de résultats
function afficherNombreResultat(nombreResultats, destination) {
    if (nombreResultats <= 1) {
        destination.innerHTML = `${nombreResultats} résultat`;
    } else {
        destination.innerHTML = `${nombreResultats} résultats`;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AFFICHAGE TRAJETS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END
//
//
//
//
//
// START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CREATION CARTE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
    <div class="col"><i class="bi bi-people-fill d-lg-none"></i>${
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CREATION CARTE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END
//
//
//
//
//
// START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENEMENTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENT RECHERCHE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const btnRechercherCovoit = document.getElementById("btnRechercherCovoit");

btnRechercherCovoit.addEventListener("click", (e) => {
    e.preventDefault();
    // On supprime les filtres avant
    resetFiltre("btnViderFiltreSide");
    resetFiltre("btnViderFiltreModal");

    // Récupérer les valeurs des input
    const villeDepart = inputDepartCovoit.value;
    const villeArrivee = inputArriveeCovoit.value;
    const dateTrajet = inputDateCovoit.value;

    // Lancer le tri des résultats
    const voyagesTries = rechercheTrajets(tripBrut, villeDepart, villeArrivee, dateTrajet);

    // Afficher les résultats
    affichageTrajets(voyagesTries);

    // Mise en cache du tableau de covoiturages
    setTripsInCache(voyagesTries);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENT RESET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const btnViderRecherche = document.getElementById("btnViderRecherche");

btnViderRecherche.addEventListener("click", (e) => {
    e.preventDefault();
    inputDepartCovoit.value = "";
    inputArriveeCovoit.value = "";
    inputDateCovoit.value = "";

    // On affiche les trajets de base
    affichageTrajets([]);

    // On met en cache les trajets de base
    setTripsInCache(tripBrut);

    // On réinitialise les filtres
    resetFiltre("btnViderFiltreSide");
    resetFiltre("btnViderFiltreModal");
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENT FILTRE SIDE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const btnFiltreSide = document.getElementById("btnFiltreSide");

btnFiltreSide.addEventListener("click", (e) => {
    e.preventDefault();
    const filtres = getFiltre("btnFiltreSide");

    const tripsActuels = getTripsInCache();

    const nouveau = filtrerCovoiturages(tripsActuels, filtres);

    affichageTrajets(nouveau);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENT RESET FILTRE SIDE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const btnResetFiltreSide = document.getElementById("btnViderFiltreSide");

btnResetFiltreSide.addEventListener("click", (e) => {
    e.preventDefault();
    resetFiltre("btnViderFiltreSide");
    const tripsActuels = getTripsInCache();
    affichageTrajets(tripsActuels);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENT FILTRE MODAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const btnFiltreModal = document.getElementById("btnFiltreModal");

btnFiltreModal.addEventListener("click", (e) => {
    e.preventDefault();
    const filtres = getFiltre("btnFiltreModal");

    const tripsActuels = getTripsInCache();

    const nouveau = filtrerCovoiturages(tripsActuels, filtres);

    affichageTrajets(nouveau);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENT RESET FILTRE MODAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const btnResetFiltreModal = document.getElementById("btnViderFiltreModal");

btnResetFiltreModal.addEventListener("click", (e) => {
    resetFiltre("btnViderFiltreModal");
    const tripsActuels = getTripsInCache();
    affichageTrajets(tripsActuels);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENEMENTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END
//
//
//
//
//
// START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INPUT DYNAMIQUE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SIDE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const rangeInputPrixSide = document.getElementById("prixMaxSide");
const rangeOutputPrixSide = document.getElementById("prixMaxSideOutput");

rangeOutputPrixSide.textContent = rangeInputPrixSide.value + " crédits";

rangeInputPrixSide.addEventListener("input", function () {
    rangeOutputPrixSide.textContent = `${this.value} crédits`;
});

const rangeInputDureeSide = document.getElementById("dureeMaxSide");
const rangeOutputDureeSide = document.getElementById("dureeMaxSideOutput");

rangeOutputDureeSide.textContent = rangeInputDureeSide.value + " heures";

rangeInputDureeSide.addEventListener("input", function () {
    rangeOutputDureeSide.textContent = `${this.value} heures`;
});

const rangeInputNoteSide = document.getElementById("noteMinSide");
const rangeOutputNoteSide = document.getElementById("noteMinSideOutput");

rangeOutputNoteSide.textContent = rangeInputNoteSide.value + " / 5";

rangeInputNoteSide.addEventListener("input", function () {
    rangeOutputNoteSide.textContent = `${this.value} / 5`;
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ MODAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const rangeInputPrixModal = document.getElementById("prixMaxModal");
const rangeOutputPrixModal = document.getElementById("prixMaxModalOutput");

rangeOutputPrixModal.textContent = rangeInputPrixSide.value + " crédits";

rangeInputPrixModal.addEventListener("input", function () {
    rangeOutputPrixModal.textContent = `${this.value} crédits`;
});

const rangeInputDureeModal = document.getElementById("dureeMaxModal");
const rangeOutputDureeModal = document.getElementById("dureeMaxModalOutput");

rangeOutputDureeModal.textContent = rangeInputDureeSide.value + " heures";

rangeInputDureeModal.addEventListener("input", function () {
    rangeOutputDureeModal.textContent = `${this.value} heures`;
});

const rangeInputNoteModal = document.getElementById("noteMinModal");
const rangeOutputNoteModal = document.getElementById("noteMinModalOutput");

rangeOutputNoteModal.textContent = rangeInputNoteSide.value + " / 5";

rangeInputNoteModal.addEventListener("input", function () {
    rangeOutputNoteModal.textContent = `${this.value} / 5`;
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INPUT DYNAMIQUE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END
//
//
//
//
//
// START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FILTRE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Création des fonctions pour filtrer
function getFiltre(idBouton) {
    // On récupère le bouton qui a été cliqué
    const bouton = document.getElementById(idBouton);

    // Suivant où a été effectué le filtre, on définit un suffixe de variables
    const suffix = bouton.dataset.filtre === "side" ? "Side" : "Modal";

    // On récupère les inputs dans la section utilisée
    const inputEco = document.getElementById(`switchCheckEco${suffix}`);
    const inputPrix = document.getElementById(`prixMax${suffix}`);
    const inputDuree = document.getElementById(`dureeMax${suffix}`);
    const inputNote = document.getElementById(`noteMin${suffix}`);

    // On récupère la valeur des inputs
    const valueEco = inputEco.checked;
    const valuePrix = Number(inputPrix.value);
    const valueDuree = Number(inputDuree.value);
    const valueNote = Number(inputNote.value);

    // Pour finir, on retourne un objet avec les 3 statuts de filtres
    return { valueEco, valuePrix, valueDuree, valueNote };
}

function resetFiltre() {}

function filtrerCovoiturages(trips, filtres) {
    const isEco = filtres.valueEco;
    const maxPrix = Number(filtres.valuePrix);
    const maxDuree = Number(filtres.valueDuree);
    const minNote = Number(filtres.valueNote);

    const tripsFiltre = trips.filter(
        (trip) =>
            Number(trip.credit) <= maxPrix &&
            texteToHeures(trip.heure_arrivee) - texteToHeures(trip.heure_depart) <= maxDuree &&
            Number(trip.note) >= minNote
    );

    if (isEco) {
        const tripsFiltreEco = tripsFiltre.filter((trip) => trip.eco);
        return tripsFiltreEco;
    }

    return tripsFiltre;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FILTRE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END
//
//
//
//
//
// START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ RECUP ID POUR DETAILS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Gestion du clic sur le bouton détails
// Fonction qui récupère la liste des boutons détails
function getListBtnDetail() {
    const btnDetail = document.querySelectorAll("a.detail-covoiturage");
    return btnDetail;
}

// Evénement qui va écouter le clic sur un bouton détail et stocker l'id du trajet sélectionné dans le cache
const containerListeTrajets = document.getElementById("affichage-trajets");
// On écoute sur le container global car le DOM n'est pas chargé
containerListeTrajets.addEventListener("click", (e) => {
    const btn = e.target.closest("a.detail-covoiturage"); // On récupère le parent si le click est à l'intérieur
    if (!btn) return; // On sort si le click n'est pas sur un buton détails

    // On récupère l'id du trajet pour la stocker dans le cache
    const tripId = btn.dataset.tripid;
    sessionStorage.setItem("tripId", tripId);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ RECUP ID POUR DETAILS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END
