let modal = null;

const openModal = (event) => {
    event.preventDefault();
    const target = document.querySelector("#modal");
    target.style.display = null;
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").addEventListener("click", stopPropagation);     
}

function closeModal(e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopPropagation);
    modal = null;
}

//Pour éviter que la modale ne se ferme quand on clique à l'intérieur
const stopPropagation = (e) => {
    e.stopPropagation();
}

//Pour qu'elle se ferme en appuyant sur la touche "échap"
window.addEventListener("keydown", (e) => {
 if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
 }
})

//Ouverture de la modale au clic sur "modifier"
const modifierProjets = document.querySelector('a[href="#modal"]');
modifierProjets.addEventListener("click", openModal);

//Affichage des photos à éditer
(async () => {
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
        const travaux = await reponse.json();
    
        const galerieElement = document.querySelector(".modal-gallery");
        afficherEditionPhoto(travaux, galerieElement);
    } catch (error) {
        console.log(error);
    }
})();

function afficherEditionPhoto(liste, galerie) {    
    for (let i = 0; i < liste.length; i++) {
        const idProjet = liste[i].id;

        const projet = document.createElement("figure");
        projet.className = `projet-${idProjet}`;
        galerie.appendChild(projet);

        const imageElement = document.createElement("img");
        imageElement.src = liste[i].imageUrl;
        imageElement.alt = liste[i].title;
        projet.appendChild(imageElement);

        const titreElement = document.createElement("figcaption");
        titreElement.innerText = "éditer";
        titreElement.setAttribute("style", "font-size: 12px;");
        projet.appendChild(titreElement);

        const suppressionElement = document.createElement("i");
        suppressionElement.className = "fa-solid fa-trash-can";
        suppressionElement.style.setProperty("display","flex","important");             
        suppressionElement.addEventListener("click", (e) => {
            e.preventDefault();
            supprimerProjet(idProjet);
        });
        projet.appendChild(suppressionElement);        

        if (i == 0) {   //Pour la croix du premier élément
            const deplacerElement = document.createElement("i");
            deplacerElement.className = "fa-solid fa-arrows-up-down-left-right";
            deplacerElement.style.setProperty("display","flex","important");
            projet.appendChild(deplacerElement);
        };
    }; 
};

async function supprimerProjet(id) {
    const bearerToken = localStorage.getItem("token");
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + bearerToken,
            "Content-Type": "application/json"
        },
    })
    .then(response => {
        if(response.ok) {
            const projetSupprime = document.querySelectorAll(`.projet-${id}`);
            projetSupprime.forEach(element => {
                element.remove();
            });
            openModal();
        }else{
            alert("Échec de la suppression du projet");
        }
    })
    .catch(error => {
        console.log(error);
    });    
}