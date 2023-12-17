const Category = require('../models/Category');

exports.findAll = (req, res, next) => {
  Category.find()
    .then(categories => res.status(200).json(categories))
    .catch(error => res.statusCode(400).json({ error }));
};

exports.createCategory = (req, res, next) => {

  delete req.body.id;

  const category = new Category({
    ...req.body,
  });

  category
    .save()
    .then(() => {
      res.status(201).json({ message: 'Object created!' });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};