import { isNotEmpty, fileFormat, fileSize } from './formValidator.js';

export const Configs = {
  links: {
    worksLink: 'https://portfolio-architect-api.onrender.com/api/works',
    loginLink: 'https://portfolio-architect-api.onrender.com/api/users/login',
    categoriesLink: 'https://portfolio-architect-api.onrender.com/api/categories',
  },

  addPicFormConfigs: {
    pic: [isNotEmpty('photo'), fileFormat, fileSize(4)],
    title: [isNotEmpty('titre')],
    category: [isNotEmpty('catégorie')],
  },
};

export const { links, addPicFormConfigs } = Configs;
