import { afficherProjets } from "./accueil.js";

let modal = null;

const openModal = (e) => {
    e.preventDefault();
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
        afficherEditionPhoto(travaux);
    } catch (error) {
        console.log(error);
    }
})();

function afficherEditionPhoto(liste) {   
    const galerieModale = document.querySelector(".modal-gallery"); 
    for (let i = 0; i < liste.length; i++) {
        const idProjet = liste[i].id;

        const projet = document.createElement("figure");
        projet.className = `projet-${idProjet}`;
        galerieModale.appendChild(projet);

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
        suppressionElement.style.setProperty("display","flex","important");  //Pour contrer le display inline fontawesome natif        
        suppressionElement.addEventListener("click", (e) => {
            e.preventDefault();
            supprimerProjet(e, idProjet);
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

//Lorsque l'on clique sur l'icone poubelle associée à chaque photo
async function supprimerProjet(e, id) {
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
            openModal(e);
        }else{
            console.log("Échec de la suppression du projet");
        }
    })
    .catch(error => {
        console.log(error);
    });    
}

const modaleGalerie = document.querySelector(".modal-home");
const modaleAjoutPhoto = document.querySelector(".modal-add");

const goBack = document.querySelector(".fa-arrow-left");
const modalSwitch = document.querySelector(".switch");

//Pour passer de la galerie de photo au mode "Ajout photo"
modalSwitch.addEventListener("click", (e) => {
    e.preventDefault();
    modaleGalerie.classList.add("undisplay");
    modaleAjoutPhoto.classList.remove("undisplay");
    goBack.classList.remove("hide");
});

//               ...et inversement
goBack.addEventListener("click", (e) => {
    e.preventDefault();
    modaleGalerie.classList.remove("undisplay");
    modaleAjoutPhoto.classList.add("undisplay");
    goBack.classList.add("hide");
});

// Récupération de la liste des catégories pour choix du formulaire
(async () => {
    try {
        const reponse = await fetch("http://localhost:5678/api/categories");
        const categories = await reponse.json();
    
        const selectCategorie = document.querySelector("#categorie");
        for (let i = 0; i < categories.length; i++) {
            const optionElement = document.createElement("option");
            optionElement.innerText = categories[i].name;
            optionElement.setAttribute("value", categories[i].id);
            selectCategorie.appendChild(optionElement);
        }
    } catch (error) {
        console.log(error);
    }
})();

//Affichage de la photo téléchargée dans le cadre
const photoATelecharger = document.querySelector("#photo-upload");
photoATelecharger.addEventListener("change", chargerPhoto);

function chargerPhoto() {
    const fichier = this.files[0];
    const ajoutPhoto = document.querySelector(".add-photo");
    const iconePhoto = document.querySelector(".fa-image");
    const boutonPhoto = document.querySelector("#photo-upload-btn");
    const formatPhoto = ajoutPhoto.querySelector("p");

    const reader = new FileReader();
    reader.onload = (e) => {
        iconePhoto.style.display = "none";
        boutonPhoto.style.display = "none";
        formatPhoto.classList.add("undisplay");
        ajoutPhoto.style.backgroundImage = "url('" + e.target.result + "')";
    };

    //Vérification du poids de la photo
    if (fichier) {
        const tailleMax = 4 * 1024 *1024;
        if (fichier.size <= tailleMax) {
            reader.readAsDataURL(fichier);
        }else{
            this.value = null;
            iconePhoto.style.display = "block";
            boutonPhoto.style.display = "flex";
            formatPhoto.classList.remove("undisplay");
            ajoutPhoto.style.backgroundImage = "none";
            const limiteDepassee = ajoutPhoto.querySelector("p");
            limiteDepassee.innerText = "La taille de la photo dépasse la limite autorisée (4 Mo maximum).";
            limiteDepassee.style.color = "red";
        }
    }else{
        iconePhoto.style.display = "block";
        boutonPhoto.style.display = "flex";
        formatPhoto.classList.remove("undisplay");
        ajoutPhoto.style.backgroundImage = "none";
    }
};

//"Activation" du bouton de validation lorsque tous les champs sont remplis
const boutonValider = document.querySelector(".add-work-btn");

const photoInput = document.querySelector("#photo-upload");
const titreInput = document.querySelector("#titre");
const categorieInput = document.querySelector("#categorie");

titreInput.addEventListener("input", verifierFormulaireRempli);
categorieInput.addEventListener("input", verifierFormulaireRempli);
photoInput.addEventListener("change", verifierFormulaireRempli);

function verifierFormulaireRempli() {
    // Vérifier si tous les champs obligatoires sont remplis
    const photoTelechargee = photoInput.files.length > 0;
    const titreRempli = titreInput.value.trim() !== "";
    const categorieRemplie = categorieInput.value !== "";    
  
    // Modifier la couleur du bouton en fonction de l'état du formulaire
    if (photoTelechargee && titreRempli && categorieRemplie) {
      boutonValider.style.backgroundColor = "#1D6154";
    } else {
      boutonValider.style.backgroundColor = "#A7A7A7";
    }
}

//Soumission du formulaire
const formulaire = document.querySelector(".add-work-form");

formulaire.addEventListener("submit", (e) => {
    e.preventDefault();

    const titre = document.querySelector('#titre').value;
    const photoUpload = document.querySelector('#photo-upload');
    const categorie = document.querySelector('#categorie').value;

    //Gestion de formulaire mal rempli
    if (titre.trim() === "") {
        afficherErreur("Veuillez saisir un titre.");
        return;
    }
    if (photoUpload.files.length === 0) {
        afficherErreur("Veuillez télécharger une photo.");
        return;
    }    
    if (categorie === "") {
        afficherErreur("Veuillez sélectionner une catégorie.");
        return;
    }
    
    //Envoi du formulaire au serveur
    const formData = new FormData(formulaire);
    formData.append("title", titre);
    formData.append("image", photoUpload.files[0]);
    formData.append("category", categorie);

    const bearerToken = localStorage.getItem("token");
    
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": "Bearer " + bearerToken },
        body: formData
    })
     .then(response => {
      if (response.ok) {        
        return response.json();
      } else {
        afficherErreur("Erreur lors de l'envoi du formulaire.");
      }
    })
    //Une fois la réponse correcte obtenue de l'API, on peut ajouter le projet au site
    .then(data => {        
        afficherProjets([data]);
        afficherEditionPhoto([data]);
        const ajoutProjetValide = '<i class="fa-solid fa-check"></i>'
            + '<p class="add-work-checked">Projet ajouté au site !</p>';
        modaleAjoutPhoto.innerHTML = ajoutProjetValide;
    })
    .catch(error => {
      console.error(error);
    });
});

function afficherErreur(message) {
  const messageErreur = document.querySelector('.error-message');
  messageErreur.innerText = message;
};
