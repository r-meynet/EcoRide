const pseudoInput = document.getElementById("pseudoInput");
const mdpInput = document.getElementById("mdpInput");
const btnConnexion = document.getElementById("btnConnexion");

btnConnexion.addEventListener("click", (e) => {
    e.preventDefault();
    // On se sert de la bdd data.json qui a été fetch pour la démo frontend
    const pseudo = pseudoInput.value;
    const mdp = mdpInput.value;

    // Cas à l'utilisateur n'est pas dans la bdd
    if (!isUser(pseudo)) {
        return invalidUser();
    }

    pseudoInput.classList.remove("is-invalid");
    pseudoInput.classList.add("is-valid");
    const user = usersArray.find((item) => item.pseudo === pseudo);

    // Vérification du mdp relatif à l'utilisateur
    if (!checkMdp(user, mdp)) {
        return invalidMdp();
    }

    // Si tout est ok, on garde le token en cookie et on retourne à la page d'accueil
    const token = user.token;
    setToken(token);
    window.location.replace("/");
});

// Fonction pour déterminer si le pseudo est dans la bdd
function isUser(pseudo) {
    return usersArray.find((item) => item.pseudo === pseudo);
}

// Fonction qui gère le cas où le pseudo est inconnu
function invalidUser() {
    const container = document.getElementById("invalidPseudo");

    pseudoInput.classList.add("is-invalid");

    if (pseudoInput.value == "") {
        container.innerHTML = "Veuillez saisir un pseudo d'utilisateur";
    } else {
        container.innerHTML = `Ce pseudo est inconnu`;
    }
}

// Fonction pour vérifier le mdp d'un utilisateur
function checkMdp(user, mdp) {
    return user.password === mdp;
}

// Fonction qui gère le cas où le mdp est incorretc
function invalidMdp() {
    const container = document.getElementById("invalidMdp");

    mdpInput.classList.add("is-invalid");

    if (mdpInput.value == "") {
        container.innerHTML = "Veuillez saisir un mot de passe";
    } else {
        container.innerHTML = "Mot de passe incorrect";
    }
}
