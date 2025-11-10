// On affiche les covoiturages issus de la recherche en sessionStorage
// (recherche qui vient de la page home)
const tripTri = rechercheTrajets(
    tripBrut,
    sessionStorage.getItem("depart"),
    sessionStorage.getItem("arrivee"),
    sessionStorage.getItem("date")
);

// #
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

// #
// Evénements
const btnRechercherCovoit = document.getElementById("btnRechercherCovoit");
const btnViderRecherche = document.getElementById("btnViderRecherche");

// Recherche
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

// Réinitialiser la recherche
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

// #
// Gérer l'affichage des valeurs des inputs range
// Sur la page desktop (filtres en side)
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

// Dans la modale
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

// #
// Gestion des filtres side
// Bouton pour filtrer side
const btnFiltreSide = document.getElementById("btnFiltreSide");

btnFiltreSide.addEventListener("click", (e) => {
    e.preventDefault();
    const filtres = getFiltre("btnFiltreSide");

    const tripsActuels = getTripsInCache();

    const nouveau = filtrerCovoiturages(tripsActuels, filtres);

    affichageTrajets(nouveau);
});

// Bouton pour réinitialiser les filtres side
const btnResetFiltreSide = document.getElementById("btnViderFiltreSide");

btnResetFiltreSide.addEventListener("click", (e) => {
    e.preventDefault();
    resetFiltre("btnViderFiltreSide");
    const tripsActuels = getTripsInCache();
    affichageTrajets(tripsActuels);
});

// Gestion des filtres modal
// Bouton pour filtrer modal
const btnFiltreModal = document.getElementById("btnFiltreModal");

btnFiltreModal.addEventListener("click", (e) => {
    e.preventDefault();
    const filtres = getFiltre("btnFiltreModal");

    const tripsActuels = getTripsInCache();

    const nouveau = filtrerCovoiturages(tripsActuels, filtres);

    affichageTrajets(nouveau);
});

// Bouton pour réinitialiser les filtres modal
const btnResetFiltreModal = document.getElementById("btnViderFiltreModal");

btnResetFiltreModal.addEventListener("click", (e) => {
    resetFiltre("btnViderFiltreModal");
    const tripsActuels = getTripsInCache();
    affichageTrajets(tripsActuels);
});

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

// #
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
