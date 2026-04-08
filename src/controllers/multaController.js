const { buscarUsuarioPorId } = require('../services/usuarioService');
const { buscarEmprestimoPorId } = require('../services/emprestimoService');
const {
    listarMultas,
    buscarMultaPorId,
    listarMultasPorUsuario,
    criarMulta,
    atualizarMulta,
    deletarMulta,
    pagarMulta,
} = require('../services/multaService');

const listar = async (req, res) => {
    try {
        const multas = await listarMultas();
        res.status(200).json(multas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const buscarPorId = async (req, res) => {
    try {
        const multa = await buscarMultaPorId(Number(req.params.id));
        if (!multa) return res.status(404).json({ error: 'Multa não encontrada' });
        res.status(200).json(multa);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const listarPorUsuario = async (req, res) => {
    try {
        const multas = await listarMultasPorUsuario(Number(req.params.usuarioId));
        res.status(200).json(multas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const criar = async (req, res) => {
    try {
        const { usuario_id, emprestimo_id, valor, motivo } = req.body;

        if (!usuario_id) return res.status(400).json({ error: 'usuario_id é obrigatório' });
        if (!emprestimo_id) return res.status(400).json({ error: 'emprestimo_id é obrigatório' });
        if (valor === undefined || valor === null) return res.status(400).json({ error: 'valor é obrigatório' });

        const usuario = await buscarUsuarioPorId(Number(usuario_id));
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

        const emprestimo = await buscarEmprestimoPorId(Number(emprestimo_id));
        if (!emprestimo) return res.status(404).json({ error: 'Empréstimo não encontrado' });

        const multa = await criarMulta({
            usuario_id: Number(usuario_id),
            emprestimo_id: Number(emprestimo_id),
            valor: Number(valor),
            motivo,
        });

        res.status(201).json(multa);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const atualizar = async (req, res) => {
    try {
        const dados = { ...req.body };
        if (dados.valor !== undefined) dados.valor = Number(dados.valor);

        const multa = await atualizarMulta(Number(req.params.id), dados);
        if (!multa) return res.status(404).json({ error: 'Multa não encontrada' });

        res.status(200).json(multa);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletar = async (req, res) => {
    try {
        const removida = await deletarMulta(Number(req.params.id));
        if (!removida) return res.status(404).json({ error: 'Multa não encontrada' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const pagar = async (req, res) => {
    try {
        const multa = await pagarMulta(Number(req.params.id));
        if (!multa) return res.status(404).json({ error: 'Multa não encontrada' });
        res.status(200).json(multa);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { listar, buscarPorId, listarPorUsuario, criar, atualizar, deletar, pagar };
