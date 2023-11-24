export const formValidator = {
  errors: {},
  allowedExtensions: /(\.jpg|\.jpeg|\.png)$/i,

  validators: {
    isNotEmpty(field) {
      return {
        validate: input => input.value !== '',
        message: `Veuillez ajouter votre ${field}`,
        errorType: 'required',
      };
    },

    fileFormat: {
      validate: input => formValidator.allowedExtensions.exec(input.value),
      message: 'Format de fichier non valide',
      errorType: 'file format',
    },

    fileSize(maxSize) {
      return {
        validate: input => input?.files[0]?.size / 1024 / 1024 <= maxSize,
        message: 'Fichier trop grand',
        errorType: 'file size',
      };
    },
  },

  validate(form, config) {
    let fields = form.elements;
    this.errors[form.name] = { messageToShow: '' };

    for (const [fieldName, fieldValidators] of Object.entries(config)) {
      if (!fieldValidators.length) {
        continue;
      }

      if (!fields[fieldName]) {
        throw new Error(`The ${fieldName} doesn't exist in the ${form.name}`);
      }

      const input = fields[fieldName];
      let errors = this.errors[form.name];

      fieldValidators.forEach(({ validate, message, errorType }) => {
        if (!validate(input)) {
          errors[fieldName] = {
            ...errors[fieldName],
            [errorType]: message,
          };

          if (errors.messageToShow === '') {
            errors.messageToShow = message;
          }
        }
      });
    }

    return !this.hasError(form.name);
  },

  hasError(formName) {
    return Object.keys(this.errors[formName]).length > 1;
  },

  getErrors(formName) {
    return this.errors[formName];
  },
};

export const { isNotEmpty, fileFormat, fileSize } = formValidator.validators;
