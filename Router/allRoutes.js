import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", [], "/js/pages/home.js"),
    new Route("/covoiturages", "Covoiturages", "/pages/covoiturages.html", [], "js/pages/covoiturages.js"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";
