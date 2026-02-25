const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/validar/:hash', publicController.validarHash);
router.get('/validar/:hash/download', publicController.downloadXML);

module.exports = router;