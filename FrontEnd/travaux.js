async function projets() {
    //Récupération dynamique des projets
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();

    //Ajout des travaux à la galerie
    const galerieElement = document.querySelector('.gallery');
    afficherProjets(travaux, galerieElement);

    //Réalisation d'un filtre des travaux par catégorie de projet
    const categories = new Set();
    for(let i = 0; i < travaux.length; i++) {
        categories.add(travaux[i].category.name);
    };
    const categoriesArray = ["Tous"];
    categories.forEach(categorie => categoriesArray.push(categorie));    
    
    for(let i = 0; i < categoriesArray.length; i++) {
        //Ajout d'un bouton par catégorie
        const categorieElement = document.createElement('button');
        categorieElement.innerText = categoriesArray[i];
        categorieElement.setAttribute('id', `btn-${i}`);

        const filterElement = document.querySelector('.filter');
        filterElement.appendChild(categorieElement);

        //Implementation de la fonction de filtrage des travaux
        const categorieFiltrer = document.querySelector(`#btn-${i}`);
        categorieFiltrer.addEventListener("click", () => {
            let travauxFiltrer;
            if (i !== 0) {
                travauxFiltrer = travaux.filter((travail) => {
                   return travail.category.name == categoriesArray[i];
                });                
            }else{
                travauxFiltrer = travaux;
            };
            galerieElement.innerHTML = "";
            afficherProjets(travauxFiltrer, galerieElement);
        });
    }
};

projets();

function afficherProjets(travaux, galerie) {    
    for (let i = 0; i < travaux.length; i++) {
        const projet = document.createElement('figure');
        galerie.appendChild(projet);

        const imageElement = document.createElement('img');
        imageElement.src = travaux[i].imageUrl;
        imageElement.alt = travaux[i].title;

        const titreElement = document.createElement('figcaption');
        titreElement.innerText = travaux[i].title;

        projet.appendChild(imageElement);
        projet.appendChild(titreElement);
    };
}

