import { links } from './configs.js';

export const Helpers = {
  async getData(link, params = {}, errorHandler) {
    let text;
    let response;

    try {
      response = await fetch(link, params);
      text = await response.text();

      if (!response.ok) {
        if (errorHandler === undefined) {
          throw new Error(`${response.status}: ${response.statusText}`);
        } else {
          errorHandler();
        }
      }
    } catch (error) {
      console.log(error);
    }

    return text ? JSON.parse(text) : response;
  },

  async getAllWorks() {
    const works = getData(links.worksLink);

    return works;
  },

  async getAllCategories() {
    const categories = getData(links.categoriesLink);

    return categories;
  },

  async sendDeleteRequest(id, token) {
    const response = getData(`${links.worksLink}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  },

  async addWorks(work, token) {
    const response = getData(links.worksLink, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: work,
    });

    return response;
  },

  async getLoginResponse(loginInfo, element) {
    hideElement(element);
    const response = getData(
      links.loginLink,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: loginInfo,
      },
      () => showElement(element)
    );

    return response;
  },

  generateGallery(item, container) {
    const itemElement = document.createElement('figure');

    itemElement.innerHTML = `<img class="gal-img" src="${item.imageUrl}" alt="${item.title}">
            <figcaption>${item.title}</figcaption>`;

    itemElement.dataset.categoryId = item.categoryId;
    itemElement.dataset.categoryName = item.category.name;
    itemElement.dataset.id = item.id;

    container.appendChild(itemElement);
  },

  generateFilters(names, filtContainer, galContainer) {
    const elements = [].concat(names);
    for (let i = 0; i < elements.length; i++) {
      const filterItemElement = document.createElement('li');
      filterItemElement.innerText = elements[i];
      filterItemElement.classList.add('filter');
      filtContainer.appendChild(filterItemElement);

      clickHandler(filterItemElement, function (event) {
        Helpers.clickHandlerFilters(event, filtContainer, galContainer);
      });
    }
  },

  generateGalleryPreview(element) {
    const icons = document.createElement('div');
    icons.classList.add('modal-gallery-icons');
    const iconEnlarge = document.createElement('div');
    iconEnlarge.classList.add('icon-enlarge');
    const iconDelete = document.createElement('div');
    iconDelete.classList.add('icon-delete');
    const editBtn = document.createElement('p');
    editBtn.classList.add('edit-btn');
    editBtn.innerText = 'éditer';

    element.prepend(icons);
    icons.append(iconEnlarge);
    icons.append(iconDelete);
    element.append(editBtn);
  },

  generateModalGallery(
    work,
    container,
    globalContainer,
    modal,
    secModal,
    picLarge,
    openSecond,
    hideSecond,
    showOk,
    token
  ) {
    generateGallery(work, container);

    const figures = Array.from(container.querySelectorAll('figure'));

    const figure = figures[figures.length - 1];

    generateGalleryPreview(figure);

    const iconEnlarge = figure.querySelector('.icon-enlarge');
    const iconDelete = figure.querySelector('.icon-delete');
    const editBtn = figure.querySelector('.edit-btn');

    clickHandler(figure, e => {
      switch (e.target) {
        case this:
          return false;
        case iconEnlarge:
          showLargePic(figure, picLarge, openSecond(picLarge));

          break;
        case iconDelete:
          deleteWork(
            figure,
            secModal,
            openSecond,
            hideSecond,
            token,
            showOk,
            modal,
            globalContainer
          );

          break;
        case editBtn:
          console.log('Edit');
      }
    });
  },

  showElement(elements) {
    const els = [].concat(elements);
    els.forEach(el => {
      el.classList.remove('invisible');
    });
  },

  hideElement(elements) {
    const els = [].concat(elements);
    els.forEach(el => {
      el.classList.add('invisible');
    });
  },

  clickHandlerFilters(event, filtContainer, galContainer) {
    const filterContainers = Array.from(filtContainer.children);
    const galleryItems = Array.from(galContainer.children);
    const allFilter = filterContainers.find(filter => filter.innerText === 'Tous');
    const target = event.target;

    target.classList.toggle('filter-clicked');

    if (target === allFilter) {
      filterContainers.forEach(element => {
        element.classList.remove('filter-clicked');
        allFilter.classList.add('filter-clicked');
      });

      showElement(galleryItems);
    } else {
      allFilter.classList.remove('filter-clicked');
      galleryItems.forEach(item => {
        const itemFilter = filterContainers.find(
          filter => filter.innerText === item.dataset.categoryName
        );

        if (itemFilter.classList.contains('filter-clicked')) {
          showElement(item);
        } else {
          hideElement(item);
        }
      });
    }
  },

  showEditionMode(elements, loginBtn) {
    showElement(elements);

    hideElement(loginBtn);
  },

  removeErrors(container) {
    container.innerHTML = '';
  },

  hideModal(elements, modals, overlay) {
    hideElement(Array.from(elements));
    overlay.style.zIndex = '1';
    modals.forEach(modal => (modal.style.zIndex = '2'));
  },

  hideSecModal(secModal, modals, overlay) {
    secModal.classList.remove('second-modal');
    hideElement(secModal);
    overlay.style.zIndex = '1';
    modals.forEach(modal => (modal.style.zIndex = '2'));
  },

  openSecModal(secModal, modals, overlay) {
    secModal.classList.add('second-modal');
    showElement(secModal);
    overlay.style.zIndex = '3';
    modals.forEach(modal => (modal.style.zIndex = 'auto'));
  },

  clickHandler(element, callback) {
    element.addEventListener('click', callback);
  },

  showOkMessage(modal, secModal, closeAll, message) {
    const textContainer = secModal.querySelector('p');
    const yesBtn = secModal.querySelector('#ok');
    const noBtn = secModal.querySelector('#cancel');
    hideElement([modal, noBtn]);
    textContainer.innerText = message;
    yesBtn.value = 'OK';
    clickHandler(yesBtn, function func() {
      yesBtn.removeEventListener('click', func);
      closeAll();
    });
  },

  showLargePic(element, modal, openModal) {
    const galleryImg = element.querySelector('img');
    openModal;
    modal.src = galleryImg.src;
  },

  showNotOkMessage(secModal, closeModal) {
    const textContainer = secModal.querySelector('p');
    const yesBtn = secModal.querySelector('#ok');
    const noBtn = secModal.querySelector('#cancel');
    hideElement(noBtn);
    textContainer.innerText = 'Il y a eu un problème, veuillez réessayer.';
    yesBtn.value = 'OK';
    clickHandler(yesBtn, function func() {
      yesBtn.removeEventListener('click', func);
      closeModal(secModal);
    });
  },

  deleteWork(workElements, secModal, openModal, closeModal, token, showOk, modal, globalContainer) {
    const workEls = [].concat(workElements);
    console.log(secModal);
    const textContainer = secModal.querySelector('p');
    const yesBtn = secModal.querySelector('#ok');
    const noBtn = secModal.querySelector('#cancel');
    openModal(secModal);
    showElement(noBtn);

    let successMessage;

    if (workEls.length > 1) {
      textContainer.innerText = 'Voulez-vous supprimer les photos?';
      successMessage = 'Votre galerie a été supprimée.';
    } else {
      textContainer.innerText = 'Voulez-vous supprimer la photo?';
      successMessage = 'Votre photo a été supprimée.';
    }

    yesBtn.value = 'Oui';

    clickHandler(noBtn, () => {
      closeModal(secModal);
    });

    clickHandler(yesBtn, function func() {
      yesBtn.removeEventListener('click', func);

      let success = true;

      workEls.forEach(async workElement => {
        const id = workElement.dataset.id;
        const isDeleted = await sendDeleteRequest(id, token);

        if (isDeleted.ok) {
          const deletedElGlobal = Array.from(globalContainer.children).find(
            element => element.dataset.id === id
          );
          hideElement([workElement, deletedElGlobal]);
        }

        if (!isDeleted.ok) {
          success = false;
          showNotOkMessage(secModal, closeModal);

          return;
        }
      });

      if (success === true) {
        showOk(modal, successMessage);
      }
    });
  },
};

export const {
  getData,
  getAllWorks,
  getLoginResponse,
  addWorks,
  getAllCategories,
  sendDeleteRequest,
  generateGallery,
  generateGalleryPreview,
  generateFilters,
  generateModalGallery,
  showElement,
  hideElement,
  showEditionMode,
  removeErrors,
  clickHandler,
  hideModal,
  hideSecModal,
  openSecModal,
  showOkMessage,
  showLargePic,
  showNotOkMessage,
  deleteWork,
} = Helpers;
