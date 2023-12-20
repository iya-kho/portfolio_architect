import {
  getAllWorks,
  generateGallery,
  generateFilters,
  showEditionMode,
  hideElement,
  showElement,
  removeErrors,
  addWorks,
  getAllCategories,
  hideModal,
  hideSecModal,
  openSecModal,
  clickHandler,
  showOkMessage,
  showNotOkMessage,
  deleteWork,
  generateModalGallery,
} from './js/helpers.js';

import { formValidator } from './js/formValidator.js';
import { addPicFormConfigs } from './js/configs.js';

const galleryContainer = document.querySelector('#portfolio .gallery');
const filtersContainer = document.querySelector('#portfolio .filters');
const editionElements = Array.from(document.querySelectorAll('.edition'));
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const modalWrap = document.getElementById('modal-wrap');
const modals = Array.from(document.querySelectorAll('.modal'));
const portfolioModal = document.getElementById('modal-portfolio');
const modalGalleryContainer = document.querySelector('#modal-portfolio .gallery');
const closeBtns = Array.from(document.querySelectorAll('.close'));
const overlay = document.querySelector('.overlay');
const editBtnGallery = document.getElementById('edit-btn-gallery');
const addPicBtn = document.getElementById('add-pic-btn');
const addPicModal = document.getElementById('modal-add-pic');
const addPicBack = document.querySelector('#modal-add-pic .back-arrow');
const addPicSelect = document.querySelector('#modal-add-pic .form select');
const addPicValidate = document.getElementById('add-pic-validate');
const addPicForm = document.querySelector('#modal-add-pic form');
const addPicErrorMessage = document.querySelector('#modal-add-pic .error-message');
const uploadPic = document.querySelector('#modal-add-pic .upload-pic-wrap');
const addPicPreview = document.querySelector('#modal-add-pic .pic-wrap img');
const modalConfirm = document.getElementById('modal-confirm');
const cancelBtn = modalConfirm.querySelector('#cancel');
const picLarge = document.getElementById('pic-large');
const deleteGalBtn = document.getElementById('delete-gal-btn');

const token = localStorage.token;

function hideModals() {
  return hideModal(modalWrap.children, modals, overlay);
}

function hideSecond(modal) {
  return hideSecModal(modal, modals, overlay);
}

function openSecond(modal) {
  return openSecModal(modal, modals, overlay);
}

function showOkMes(modal, message) {
  return showOkMessage(modal, modalConfirm, hideModals, message);
}

function generateModalGal(work) {
  return generateModalGallery(
    work,
    modalGalleryContainer,
    galleryContainer,
    portfolioModal,
    modalConfirm,
    picLarge,
    openSecond,
    hideSecond,
    showOkMes,
    token
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  // Get data
  let works = await getAllWorks();
  const presentCategoryNames = Array.from(new Set(works.map(work => work.category.name)));
  const allCategories = await getAllCategories();
  let allCategoriesSimple = {};
  allCategories.forEach(category => {
    allCategoriesSimple[category._id] = category.name;
  });

  // Generate main gallery and log in
  works.forEach(work => generateGallery(work, galleryContainer));

  if (token) {
    showEditionMode(editionElements, loginBtn);

    clickHandler(logoutBtn, () => {
      delete localStorage.token;
    });
  }

  // Generate filters

  if (!token) {
    generateFilters(['Tous'].concat(presentCategoryNames), filtersContainer, galleryContainer);
  }

  // Close open modals

  clickHandler(overlay, () => {
    const secondModals = Array.from(document.querySelectorAll('.second-modal'));
    const openSecModal = secondModals.find(modal => !modal.classList.contains('invisible'));

    if (openSecModal) {
      hideSecond(openSecModal);

      return;
    } else {
      hideModals();
    }
  });

  closeBtns.forEach(closeBtn => {
    clickHandler(closeBtn, () => {
      hideModals();
    });
  });

  // Generate gallery in modal

  works.forEach(work => {
    generateModalGal(work);
  });

  allCategories.forEach(category => {
    addPicSelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
  });

  // Add event listeners

  clickHandler(editBtnGallery, () => {
    showElement([portfolioModal, overlay]);
  });

  clickHandler(addPicBtn, () => {
    removeErrors(addPicErrorMessage);
    hideElement([portfolioModal, addPicPreview]);
    showElement([addPicModal, uploadPic]);
    addPicForm.title.value = '';
    addPicForm.category.value = '';
  });

  clickHandler(addPicBack, () => {
    hideElement(addPicModal);
    showElement(portfolioModal);
  });

  // Delete all gallery

  clickHandler(deleteGalBtn, () => {
    const elements = Array.from(modalGalleryContainer.children);

    deleteWork(
      elements,
      modalConfirm,
      openSecond,
      hideSecond,
      token,
      showOkMes,
      portfolioModal,
      galleryContainer
    );
  });

  // Check and add new picture

  clickHandler(addPicValidate, async () => {
    removeErrors(addPicErrorMessage);

    let isValid = formValidator.validate(addPicForm, addPicFormConfigs);

    if (!isValid) {
      let errors = formValidator.getErrors(addPicForm.name);

      addPicErrorMessage.innerText = errors.messageToShow;
    }

    if (isValid) {
      let workCategory = {};
        allCategories.forEach(category => {
          if (addPicForm.category.value === category.name) {
            workCategory = {
              id: category._id,
              name: category.name,
            };
          }
        });

        let workInfo = new FormData();
        workInfo.append('image', addPicForm.pic.files[0]);
        workInfo.append('title', addPicForm.title.value);
        workInfo.append('category', workCategory.name);

        const isAdded = await addWorks(workInfo, token);

        openSecond(modalConfirm);
        hideElement(cancelBtn);

        if (isAdded._id) {

          showOkMes(addPicModal, 'Votre photo a été ajoutée.');

          generateGallery(isAdded, galleryContainer);
          generateModalGal(isAdded, modalGalleryContainer);
        } else {
          showNotOkMessage(modalConfirm, hideSecond);
        }
    }
  });

   addPicForm.addEventListener('input', () => {
    const isValid = formValidator.validate(addPicForm, addPicFormConfigs);

    if (isValid) {
      addPicValidate.style.background = '#1D6154';
    } else {
      addPicValidate.style.background = '#A7A7A7';
    }
  });

  addPicForm.pic.addEventListener('change', () => {
    const file = addPicForm.pic.files[0];

    const isValid = formValidator.validate(addPicForm, { pic: addPicFormConfigs.pic });

    if (!isValid) {
      let errors = formValidator.getErrors(addPicForm.name);

      addPicErrorMessage.innerText = errors.messageToShow;
    } else {
      hideElement(uploadPic);
      addPicPreview.file = file;
      showElement(addPicPreview);

      const reader = new FileReader();
      reader.onload = e => {
        addPicPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

});
