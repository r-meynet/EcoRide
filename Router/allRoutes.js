import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", [], "/js/pages/home.js"),
    new Route(
        "/covoiturages",
        "Covoiturages",
        "/pages/covoiturages.html",
        [],
        "js/pages/covoiturages.js"
    ),
    new Route(
        "/details",
        "Détails du covoiturage",
        "/pages/detail-covoiturage.html",
        [],
        "js/pages/detail-covoiturage.js"
    ),
    new Route(
        "/signin",
        "Connexion",
        "/pages/auth/signin.html",
        [],
        "js/auth/signin.js"
    ),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";
