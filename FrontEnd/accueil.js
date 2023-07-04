(async () => {
    try {
        //Récupération dynamique des projets
        const reponse = await fetch("http://localhost:5678/api/works");
        const travaux = await reponse.json();
    
        //Ajout des travaux à la galerie
        const galerieElement = document.querySelector(".gallery");
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
            const categorieElement = document.createElement("button");
            categorieElement.innerText = categories[i];
            categorieElement.className = `filter-btn btn-${i}`;
    
            const filterElement = document.querySelector(".filter");
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
        const filtres = document.querySelectorAll("button");
        filtres[0].classList.add("active-filter"); // "Tous" par défaut
        for (const filtre of filtres) {
            filtre.addEventListener("click", () => {
                for (const btn of filtres) {
                    btn.classList.remove("active-filter");
                }
                filtre.classList.add("active-filter");
            });
        };        
    } catch (error) {
        alert(error);
    }
})();

function afficherProjets(liste, galerie) {    
    for (let i = 0; i < liste.length; i++) {
        const projet = document.createElement("figure");
        galerie.appendChild(projet);

        const imageElement = document.createElement("img");
        imageElement.src = liste[i].imageUrl;
        imageElement.alt = liste[i].title;

        const titreElement = document.createElement("figcaption");
        titreElement.innerText = liste[i].title;

        projet.appendChild(imageElement);
        projet.appendChild(titreElement);
    };
}

//Changement d'apparence après authentification
if(window.localStorage.getItem("token")) {
    //login devient logout
    const logInOut = document.querySelector(".logInOut");
    logInOut.innerText = "logout";
    logInOut.addEventListener("click", () => {
        window.localStorage.removeItem("token");
    });

    //Ajout barre transversale supérieure
    const barreAdmin = document.createElement("div");
    barreAdmin.className = "admin-bar";
    const bodyElement = document.querySelector("body");
    const headerElement = document.querySelector("header");
    headerElement.className = "header";
    bodyElement.insertBefore(barreAdmin, headerElement);
        //son contenu (le mode edition)
    const iconeEdition = document.createElement("i");
    const texteEdition = document.createElement("p");
    const boutonEdition = document.createElement("button");
    iconeEdition.className = "fa-regular fa-pen-to-square white";
    texteEdition.className = "white";
    boutonEdition.id = "edition-btn";
    texteEdition.innerText = "Mode édition";
    boutonEdition.textContent = "publier les changements";
    barreAdmin.appendChild(iconeEdition);
    barreAdmin.appendChild(texteEdition);
    barreAdmin.appendChild(boutonEdition);

    //Suppression de l'affichage du filtre
    const filtre = document.querySelector(".filter");
    filtre.classList.add("undisplay");

    //Ajout visuel option "modifier"
    const modifierElement = document.createElement("div");    
    const iconeModifier = document.createElement("i");
    const texteModifier = document.createElement("p");
    modifierElement.className = "modifier";
    modifierElement.setAttribute("onclick", "modifierIntro()");
    iconeModifier.className = "fa-regular fa-pen-to-square black";
    texteModifier.innerText = "modifier";
    modifierElement.appendChild(iconeModifier);
    modifierElement.appendChild(texteModifier);


        //sous la photo d'introduction
    const modifierIntro = document.createElement("div");
    modifierIntro.appendChild(modifierElement);
    const figureIntro = document.querySelector("figure");
    figureIntro.appendChild(modifierIntro);

        //à côté du titre "Mes projets"
    const titreProjetsElement = document.createElement("div");
    titreProjetsElement.className = "titreProjets";
    const portfolioElement = document.getElementById("portfolio");
    const titreMesProjets = document.querySelector("#portfolio h2");
    portfolioElement.insertBefore(titreProjetsElement, titreMesProjets);    
    const modifierElementBis = modifierElement.cloneNode(true);
    modifierElementBis.setAttribute("onclick", "modifierProjets()");
    titreProjetsElement.appendChild(titreMesProjets);    
    titreProjetsElement.appendChild(modifierElementBis);   
    
};
