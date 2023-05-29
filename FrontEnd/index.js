import { getAllWorks, generateGallery, generateFilters, showEditionMode } from "./js/helpers.js";

const galleryContainer = document.querySelector('#portfolio .gallery');
const filtersContainer = document.querySelector('#portfolio .filters');
const editionElements = Array.from(document.querySelectorAll('.edition'));
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const modalWrap = document.getElementById('portfolio-modal-wrap');
const modalGalleryContainer = document.querySelector('#portfolio-modal-wrap .gallery')



document.addEventListener('DOMContentLoaded', async () => {
    const works = await getAllWorks();

    generateGallery(works, galleryContainer);

    if (localStorage.token) {
        showEditionMode(editionElements, loginBtn);

        logoutBtn.addEventListener('click', () => {
            delete localStorage.token;
        })

    }
    
    if (!localStorage.token) {
        const categoryNames = Array.from(new Set(works.map(work => work.category.name)));

        generateFilters('Tous', filtersContainer, galleryContainer);
        generateFilters(categoryNames, filtersContainer, galleryContainer);
    }

    generateGallery(works, modalGalleryContainer);
    
    const modalFigures = Array.from(modalGalleryContainer.querySelectorAll('figure'));

    modalFigures.forEach(figure => {
        const icons = document.createElement('div');
        icons.classList.add('modal-gallery-icons');
        figure.prepend(icons);
        const iconEnlarge = document.createElement('div');
        icons.append(iconEnlarge);
        const iconDelete = document.createElement('div');
        icons.append(iconDelete);

        const editBtn = document.createElement('p');
        editBtn.innerText = 'éditer';
        figure.append(editBtn);

        figure.addEventListener('click', function (e) {
            if (e.target === this) {
                return false;
            }

            if (e.target === iconEnlarge) {
                console.log('Enlarge');
            } else if (e.target === iconDelete) {
                console.log('Delete');
            } else if (e.target === editBtn) {
                console.log('Edit');
            }
        })
    })



})




