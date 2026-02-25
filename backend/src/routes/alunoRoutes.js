const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const authMiddleware = require('../middlewares/authMiddleware');
const schemaValidator = require('../middlewares/alunoschema');

router.post('/import', authMiddleware, schemaValidator, alunoController.importar);
router.get('/listar', authMiddleware, alunoController.listar);
router.get('/listar/:id', authMiddleware, alunoController.listarPorId);
router.put('/:id', authMiddleware, alunoController.atualizar);
router.delete('/:id', authMiddleware, alunoController.deletar);
module.exports = router;