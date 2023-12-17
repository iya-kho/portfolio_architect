const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');
const checkWork = require('../middlewares/checkWork');
const workCtrl = require('../controllers/works');

router.post('/', auth, multer, checkWork, workCtrl.addWork);
router.get('/', workCtrl.findAll);
router.delete('/:id', auth, workCtrl.deleteWork);

module.exports = router;
