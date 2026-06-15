const { Router } = require('express');
const {
    listar,
    buscarPorId,
    listarPorUsuario,
    criar,
    atualizar,
    deletar,
    devolver,
} = require('../controllers/emprestimoController');

const router = Router();

router.get('/getByUser/:usuarioId', listarPorUsuario);
router.get('/usuario/:usuarioId', listarPorUsuario);
router.patch('/:id/devolver', devolver);
router.put('/:id/devolver', devolver);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

module.exports = router;
