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
        const btnRechercherCovoit = document.getElementById("btnRechercherCovoit");
        const btnViderRecherche = document.getElementById("btnViderRecherche");
        const inputDepartCovoit = document.getElementById("villeDepartCovoit");
        const inputArriveeCovoit = document.getElementById("villeArriveeCovoit");
        const inputDateCovoit = document.getElementById("dateCovoit");

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
        storageToInput(inputDepartCovoit, inputArriveeCovoit, inputDateCovoit);

        // Evénements
        btnRechercherCovoit.addEventListener("click", () => {
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

        btnViderRecherche.addEventListener("click", () => {
            inputDepartCovoit.value = "";
            inputArriveeCovoit.value = "";
            inputDateCovoit.value = "";

            affichageTrajets(tripBrut);
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
