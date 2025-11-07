import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
    let currentRoute = null;
    // Parcours de toutes les routes pour trouver la correspondance
    allRoutes.forEach((element) => {
        if (element.url == url) {
            currentRoute = element;
        }
    });
    // Si aucune correspondance n'est trouvée, on retourne la route 404
    if (currentRoute != null) {
        return currentRoute;
    } else {
        return route404;
    }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
    const path = window.location.pathname;
    // Récupération de l'URL actuelle
    const actualRoute = getRouteByUrl(path);

    // Vérifier les droits d'accès à la page
    const allRolesArray = actualRoute.authorize;

    if (allRolesArray.length > 0) {
        if (allRolesArray.includes("disconnected")) {
            if (isConnected()) {
                window.location.replace("/");
            }
        } else {
            const roleUser = getRole();
            if (!allRolesArray.includes(roleUser)) {
                window.location.replace("/");
            }
        }
    }

    // Récupération du contenu HTML de la route
    const html = await fetch(actualRoute.pathHTML).then((data) => data.text());
    // Ajout du contenu HTML à l'élément avec l'ID "main-page"
    document.getElementById("main-page").innerHTML = html;

    // Ajout du contenu JavaScript
    if (actualRoute.pathJS != "") {
        // Création d'une balise script
        var scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("src", actualRoute.pathJS);

        // Ajout de la balise script au corps du document
        document.querySelector("body").appendChild(scriptTag);
    }

    // Changement du titre de la page
    document.title = actualRoute.title + " - " + websiteName;

    // Comportement sur la page des covoiturages
    if (actualRoute.url == "/covoiturages") {
        // On affiche les covoiturages issus de la recherche en sessionStorage
        // (recherche qui vient de la page home)
        const tripTri = rechercheTrajets(
            tripBrut,
            sessionStorage.getItem("depart"),
            sessionStorage.getItem("arrivee"),
            sessionStorage.getItem("date")
        );

        // Affichage des covoiturages disponibles
        affichageTrajets(tripTri);

        // Mise en cache du tableau de covoiturages
        setTripsInCache(tripTri);

        // Affichage des critères de recherche dans les inputs
        const inputDepartCovoit = document.getElementById("villeDepartCovoit");
        const inputArriveeCovoit = document.getElementById("villeArriveeCovoit");
        const inputDateCovoit = document.getElementById("dateCovoit");

        storageToInput(inputDepartCovoit, inputArriveeCovoit, inputDateCovoit);

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

        // Gérer l'affichage des valeurs des inputs range
        // Sur la page desktop (filtres en side)
        const rangeInputPrixSide = document.getElementById("prixMaxSide");
        const rangeOutputPrixSide = document.getElementById("prixMaxSideOutput");
        const rangeInputDureeSide = document.getElementById("dureeMaxSide");
        const rangeOutputDureeSide = document.getElementById("dureeMaxSideOutput");

        rangeOutputPrixSide.textContent = rangeInputPrixSide.value + " crédits";

        rangeInputPrixSide.addEventListener("input", function () {
            rangeOutputPrixSide.textContent = `${this.value} crédits`;
        });

        rangeOutputDureeSide.textContent = rangeInputDureeSide.value + " minutes";

        rangeInputDureeSide.addEventListener("input", function () {
            rangeOutputDureeSide.textContent = `${this.value} minutes`;
        });

        // Dans la modale
        const rangeInputPrixModal = document.getElementById("prixMaxModal");
        const rangeOutputPrixModal = document.getElementById("prixMaxModalOutput");
        const rangeInputDureeModal = document.getElementById("dureeMaxModal");
        const rangeOutputDureeModal = document.getElementById("dureeMaxModalOutput");

        rangeOutputPrixModal.textContent = rangeInputPrixSide.value + " crédits";

        rangeInputPrixModal.addEventListener("input", function () {
            rangeOutputPrixModal.textContent = `${this.value} crédits`;
        });

        rangeOutputDureeModal.textContent = rangeInputDureeSide.value + " minutes";

        rangeInputDureeModal.addEventListener("input", function () {
            rangeOutputDureeModal.textContent = `${this.value} minutes`;
        });
    }

    // Comportement sur la page home
    if (actualRoute.url == "/") {
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
    }
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
    event = event || window.event;
    event.preventDefault();
    // Mise à jour de l'URL dans l'historique du navigateur
    window.history.pushState({}, "", event.target.href);
    // Chargement du contenu de la nouvelle page
    LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();
