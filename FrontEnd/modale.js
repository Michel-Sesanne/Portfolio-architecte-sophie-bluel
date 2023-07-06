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

const closeModal = (e) => {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopPropagation);
    modal = null;
};

const stopPropagation = (e) => {
    e.stopPropagation();
}

const modifierProjets = document.querySelector('a[href="#modal"]');
modifierProjets.addEventListener("click", openModal);

window.addEventListener("keydown", (e) => {
 if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
 }
})