// On affiche les covoiturages issus de la recherche en sessionStorage
// (recherche qui vient de la page home)
const tripTri = rechercheTrajets(
    tripBrut,
    sessionStorage.getItem("depart"),
    sessionStorage.getItem("arrivee"),
    sessionStorage.getItem("date")
);

// #
// Affichage des covoiturages disponibles
affichageTrajets(tripTri);

// #
// Mise en cache du tableau de covoiturages
setTripsInCache(tripTri);

// #
// Affichage des critères de recherche dans les inputs
const inputDepartCovoit = document.getElementById("villeDepartCovoit");
const inputArriveeCovoit = document.getElementById("villeArriveeCovoit");
const inputDateCovoit = document.getElementById("dateCovoit");

storageToInput(inputDepartCovoit, inputArriveeCovoit, inputDateCovoit);

// #
// Evénements
const btnRechercherCovoit = document.getElementById("btnRechercherCovoit");
const btnViderRecherche = document.getElementById("btnViderRecherche");

// Recherche
btnRechercherCovoit.addEventListener("click", (e) => {
    e.preventDefault();
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

    affichageTrajets(tripBrut);
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

rangeOutputDureeSide.textContent = rangeInputDureeSide.value + " minutes";

rangeInputDureeSide.addEventListener("input", function () {
    rangeOutputDureeSide.textContent = `${this.value} minutes`;
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

rangeOutputDureeModal.textContent = rangeInputDureeSide.value + " minutes";

rangeInputDureeModal.addEventListener("input", function () {
    rangeOutputDureeModal.textContent = `${this.value} minutes`;
});
