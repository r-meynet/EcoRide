// Evénement clic recherche page home
const btnRechercherHome = document.getElementById("btnRechercherHome");
const inputDepartHome = document.getElementById("villeDepartHome");
const inputArriveeHome = document.getElementById("villeArriveeHome");
const inputDateHome = document.getElementById("dateHome");

// On rétablit le sessionStorage
sessionStorage.setItem("depart", "");
sessionStorage.setItem("arrivee", "");
sessionStorage.setItem("date", "");
setTripsInCache("");

btnRechercherHome.addEventListener("click", () => {
    // Stocker les valeurs des inputs
    sessionStorage.setItem("depart", inputDepartHome.value);
    sessionStorage.setItem("arrivee", inputArriveeHome.value);
    sessionStorage.setItem("date", inputDateHome.value);
});
