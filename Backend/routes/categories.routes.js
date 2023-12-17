const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const categoriesCtrl = require('../controllers/categories');

router.post('/', auth, categoriesCtrl.createCategory);
router.get('/', categoriesCtrl.findAll);


module.exports = router;
