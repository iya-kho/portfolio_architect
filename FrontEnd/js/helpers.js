import { environmentConfigs } from "./environmentConfigs.js";

export const Helpers = {
    async getData(request, errorHandler) {
        let data;

        try {
        let response = request;
        data = await response.json();

        if (!response.ok) {
            errorHandler();
        }
        } catch (error) {
            console.log(error);
        }

        return data;
    },

    async getAllWorks() {
        const products = getData(await fetch(`${environmentConfigs.getWorksLink}`), () => {
            throw new Error(`${data.error}: ${data.message}`);
        });

        return products;
    },

    showElement(element) {
        element.style.display = 'block';
    },

    hideElement(element) {
        element.style.display = 'none';
    },

    async getLoginResponse(loginInfo, element) {
        hideElement(element);
        const response = getData(await fetch(`${environmentConfigs.loginLink}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: loginInfo,
        }), () => showElement(element));

        return response;
    },

    generateGallery(items, container) {
        items.forEach(item => {
            const itemElement = document.createElement('figure');

            itemElement.innerHTML = `<img src="${item.imageUrl}" alt="${item.title}">
        <figcaption>${item.title}</figcaption>`;

            itemElement.dataset.categoryId = item.category.id;
            itemElement.dataset.categoryName = item.category.name;

            container.appendChild(itemElement);
        });

    },

    clickHandlerFilters(filter, filtContainer, galContainer) {
        if (filter.innerText === 'Tous') {
            Array.from(filtContainer.children).forEach(element => {
                element.classList.remove('filter-clicked');
            });

            Array.from(galContainer.children).forEach(element => {
                element.classList.remove('hidden');
            })
        } else {
            Array.from(galContainer.children).forEach(element => {
                if (element.dataset.categoryName !== filter.innerText) {
                    element.classList.toggle('hidden');
                }
            })
        }

        filter.classList.toggle('filter-clicked');
    },

    generateFilters(names, filtContainer, galContainer) {
        const elements = [].concat(names);
        for (let i = 0; i < elements.length; i++) {
            const filterItemElement = document.createElement('li');
            filterItemElement.innerText = elements[i];
            filterItemElement.classList.add('filter');
            filtContainer.appendChild(filterItemElement);

            filterItemElement.addEventListener('click', function() {
                Helpers.clickHandlerFilters(this, filtContainer, galContainer);
            });
        }
    },

    showEditionMode(elements, loginBtn) {
        elements.forEach(showElement);

        hideElement(loginBtn);

    },

}

export const {
    getData,
    getAllWorks,
    getLoginResponse,
    generateGallery,
    generateFilters,
    showElement,
    hideElement,
    showEditionMode
} = Helpers;

