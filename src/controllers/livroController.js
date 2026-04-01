const { criarLivro, buscarLivroPorId, atualizarLivro, deletarLivro, listarDisponiveis } = require("../services/livroService");

const criar = async (req, res) => {
    try {
        const { titulo, autor } = req.body;

        if (!titulo || !autor) return res.status(400).json({ error: "Título e autor são obrigatórios" });

        const livro = await criarLivro(titulo, autor);
        res.status(201).json(livro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const buscarPorId = async (req, res) => {
    try {
        const livro = await buscarLivroPorId(Number(req.params.id));
        if (!livro) return res.status(404).json({ error: "Livro não encontrado" });
        res.status(200).json(livro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const atualizar = async (req, res) => {
    try {
        const livro = await atualizarLivro(Number(req.params.id), req.body);
        if (!livro) return res.status(404).json({ error: "Livro não encontrado" });
        res.status(200).json(livro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletar = async (req, res) => {
    try {
        const removido = await deletarLivro(Number(req.params.id));
        if (!removido) return res.status(404).json({ error: "Livro não encontrado" });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const disponiveis = async (req, res) => {
    try {
        const livrosDisponiveis = await listarDisponiveis();
        res.status(200).json(livrosDisponiveis);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { criar, buscarPorId, atualizar, deletar, disponiveis };