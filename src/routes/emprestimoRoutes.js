const { Router } = require('express');
const {
    listar,
    buscarPorId,
    listarPorUsuario,
    criar,
    deletar,
    devolver,
} = require('../controllers/emprestimoController');

const router = Router();

router.get('/usuario/:usuarioId', listarPorUsuario);
router.patch('/:id/devolver', devolver);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.delete('/:id', deletar);

module.exports = router;
