const { Router } = require('express');
const {
    listar,
    buscarPorId,
    listarPorUsuario,
    listarPorEmprestimo,
    criar,
    atualizar,
    deletar,
    pagar,
} = require('../controllers/multaController');

const router = Router();

router.get('/getByEmprestimo/:emprestimoId', listarPorEmprestimo);
router.get('/usuario/:usuarioId', listarPorUsuario);
router.patch('/:id/pagar', pagar);
router.put('/quitar/:id', pagar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

module.exports = router;
