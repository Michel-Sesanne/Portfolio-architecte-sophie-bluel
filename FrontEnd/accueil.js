(async () => {
    try {
        //Récupération dynamique des projets
        const reponse = await fetch("http://localhost:5678/api/works");
        const travaux = await reponse.json();
    
        //Ajout des travaux à la galerie
        const galerieElement = document.querySelector('.gallery');
        afficherProjets(travaux, galerieElement);
    
        //Création d'un tableau des catégories sans doublon
        const categories = ["Tous"];
        const categoriesSet = new Set();
        for(let i = 0; i < travaux.length; i++) {
            categoriesSet.add(travaux[i].category.name);
        };    
        categoriesSet.forEach(categorie => categories.push(categorie));
    
        //Réalisation d'un filtre des travaux par catégorie de projet
        for(let i = 0; i < categories.length; i++) {
            //Ajout d'un bouton par catégorie
            const categorieElement = document.createElement('button');
            categorieElement.innerText = categories[i];
            categorieElement.setAttribute('class', `filter-btn btn-${i}`);
    
            const filterElement = document.querySelector('.filter');
            filterElement.appendChild(categorieElement);
    
            //Implementation de la fonction de filtrage des travaux
            const categorieFiltrer = document.querySelector(`.btn-${i}`);
            categorieFiltrer.addEventListener("click", () => {
                let travauxFiltrer = {};
                if (i !== 0) {
                    travauxFiltrer = travaux.filter((travail) => {
                       return travail.category.name == categories[i];
                    });                
                }else{
                    travauxFiltrer = travaux;
                };
                galerieElement.innerHTML = "";
                afficherProjets(travauxFiltrer, galerieElement);
            });
        }
        //Mise en évidence du filtre actif
        const filtres = document.querySelectorAll('button');
        filtres[0].classList.add('active-filter'); // "Tous" par défaut
        for (const filtre of filtres) {
            filtre.addEventListener("click", () => {
                for (const btn of filtres) {
                    btn.classList.remove('active-filter');
                }
                filtre.classList.add('active-filter');
            });
        };        
    } catch (error) {
        alert(error);
    }
})();

function afficherProjets(liste, galerie) {    
    for (let i = 0; i < liste.length; i++) {
        const projet = document.createElement('figure');
        galerie.appendChild(projet);

        const imageElement = document.createElement('img');
        imageElement.src = liste[i].imageUrl;
        imageElement.alt = liste[i].title;

        const titreElement = document.createElement('figcaption');
        titreElement.innerText = liste[i].title;

        projet.appendChild(imageElement);
        projet.appendChild(titreElement);
    };
}

