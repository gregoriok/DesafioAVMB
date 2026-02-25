const express = require('express');
const router = express.Router();
const instituicaoController = require('../controllers/instituicaoController');

router.post('/register', instituicaoController.registrar);
router.post('/login', instituicaoController.login);

module.exports = router;