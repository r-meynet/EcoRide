// Création d'une fonction pour récupérer la moyenne des avis et la transformer en étoiles
function createStars() {
    document.querySelectorAll(".rating").forEach((el) => {
        const rating = parseFloat(el.getAttribute("data-rating"));
        let html = "";

        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                html += '<i class="bi bi-star-fill"></i>';
            } else if (rating >= i - 0.5) {
                html += '<i class="bi bi-star-half"></i>';
            } else {
                html += '<i class="bi bi-star"></i>';
            }
        }

        el.innerHTML = html;
    });
}
