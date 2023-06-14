import { isNotEmpty, fileFormat, fileSize } from './formValidator.js';

export const Configs = {
  links: {
    worksLink: 'http://localhost:5678/api/works',
    loginLink: 'http://localhost:5678/api/users/login',
    categoriesLink: 'http://localhost:5678/api/categories',
  },

  addPicFormConfigs: {
    pic: [isNotEmpty('photo'), fileFormat, fileSize(4)],
    title: [isNotEmpty('titre')],
    category: [isNotEmpty('catégorie')],
  },
};

export const { links, addPicFormConfigs } = Configs;
