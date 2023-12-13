const Category = require('../models/Category');

exports.getAllCategories = (req, res, next) => {
  Category.find()
    .then(categories => res.status(200).json(categories))
    .catch(error => res.statusCode(400).json({ error }));
};