const fs = require('fs');

const Work = require('../models/Work');
const Category = require('../models/Category');

exports.findAll = (req, res, next) => {
  Work.find()
    .then(works => res.status(200).json(works))
    .catch(error => res.status(400).json({ error }));
};

exports.addWork = (req, res, next) => {
  const host = req.get('host');
	const title = req.body.title;
	const categoryName = req.body.category;
	const userId = req.auth.userId;
  const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}`;
  let category;
  let categoryId;

  Category.findOne({name: categoryName })
    .then(foundCategory => {
      category = foundCategory;
      categoryId = foundCategory._id;

      const work = new Work({
        title,
        imageUrl,
        categoryId,
        userId,
        category
      });

      work
        .save()
        .then(() => {
          res.status(201).json(work);
        })
        .catch(error => {
          res.status(400).json({ error });
        });
        }
        )
    .catch(error => console.log({ error }));

  
};

exports.deleteWork = (req, res, next) => {
  Work.findOne({ _id: req.params.id })
    .then(work => {
      if (work.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized request' });
      } else {
        const filename = work.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Work.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(204).json({ message: 'Object deleted!' });
            })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};