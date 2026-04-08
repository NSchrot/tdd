const { buscarLivroPorId } = require('../services/livroService');
const { buscarUsuarioPorId } = require('../services/usuarioService');
const {
    listarEmprestimos,
    buscarEmprestimoPorId,
    listarEmprestimosPorUsuario,
    livroJaEmprestado,
    criarEmprestimo,
    deletarEmprestimo,
    registrarDevolucao,
} = require('../services/emprestimoService');

const listar = async (req, res) => {
    try {
        const emprestimos = await listarEmprestimos();
        res.status(200).json(emprestimos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const buscarPorId = async (req, res) => {
    try {
        const emprestimo = await buscarEmprestimoPorId(Number(req.params.id));
        if (!emprestimo) return res.status(404).json({ error: 'Empréstimo não encontrado' });
        res.status(200).json(emprestimo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const listarPorUsuario = async (req, res) => {
    try {
        const emprestimos = await listarEmprestimosPorUsuario(Number(req.params.usuarioId));
        res.status(200).json(emprestimos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const criar = async (req, res) => {
    try {
        const { livro_id, usuario_id, data_devolucao_prevista } = req.body;

        if (!livro_id) return res.status(400).json({ error: 'livro_id é obrigatório' });
        if (!usuario_id) return res.status(400).json({ error: 'usuario_id é obrigatório' });
        if (!data_devolucao_prevista) return res.status(400).json({ error: 'data_devolucao_prevista é obrigatória' });

        const livro = await buscarLivroPorId(Number(livro_id));
        if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });

        const usuario = await buscarUsuarioPorId(Number(usuario_id));
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

        const indisponivel = await livroJaEmprestado(Number(livro_id));
        if (indisponivel) return res.status(400).json({ error: 'Livro já emprestado' });

        const emprestimo = await criarEmprestimo({
            livro_id: Number(livro_id),
            usuario_id: Number(usuario_id),
            data_emprestimo: new Date().toISOString().slice(0, 10),
            data_devolucao_prevista,
        });

        res.status(201).json(emprestimo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletar = async (req, res) => {
    try {
        const removido = await deletarEmprestimo(Number(req.params.id));
        if (!removido) return res.status(404).json({ error: 'Empréstimo não encontrado' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const devolver = async (req, res) => {
    try {
        const emprestimo = await registrarDevolucao(Number(req.params.id));
        if (!emprestimo) return res.status(404).json({ error: 'Empréstimo não encontrado' });
        res.status(200).json(emprestimo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { listar, buscarPorId, listarPorUsuario, criar, deletar, devolver };
