const { Router } = require('express');
const {
    listar,
    buscarPorId,
    listarPorUsuario,
    criar,
    atualizar,
    deletar,
    pagar,
} = require('../controllers/multaController');

const router = Router();

router.get('/usuario/:usuarioId', listarPorUsuario);
router.patch('/:id/pagar', pagar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

module.exports = router;
