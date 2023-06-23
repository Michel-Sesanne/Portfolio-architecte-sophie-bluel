async function projets() {
    //Récupération dynamique des projets
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();
    //Ajout des travaux à la galerie
    const galerieElement = document.querySelector('.gallery');
    for (let i = 0; i < travaux.length; i++) {
        const projet = document.createElement('figure');
        galerieElement.appendChild(projet);
    
        const imageElement = document.createElement('img');
        imageElement.src = travaux[i].imageUrl;
        imageElement.alt = travaux[i].title;
    
        const titreElement = document.createElement('figcaption');
        titreElement.innerText = travaux[i].title;
    
        projet.appendChild(imageElement);
        projet.appendChild(titreElement);
    }
};

projets();
