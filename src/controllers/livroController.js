const { criarLivro, buscarLivroPorId, atualizarLivro, deletarLivro, listarDisponiveis } = require("../services/livroService");

const criar = (req, res) => {
    const { titulo, autor } = req.body;

    if (!titulo || !autor) return res.status(400).json({ error: "Título e autor são obrigatórios" });

    const livro = criarLivro(titulo, autor);
    res.status(201).json(livro);
};

const buscarPorId = (req, res) => {
    const livro = buscarLivroPorId(Number(req.params.id));
    if (!livro) return res.status(404).json({ error: "Livro não encontrado" });
    res.status(200).json(livro);
};

const atualizar = (req, res) => {
    const livro = atualizarLivro(Number(req.params.id), req.body);
    if (!livro) return res.status(404).json({ error: "Livro não encontrado" });
    res.status(200).json(livro);
};

const deletar = (req, res) => {
    const removido = deletarLivro(Number(req.params.id));
    if (!removido) return res.status(404).json({ error: "Livro não encontrado" });
    res.status(204).send();
};

const disponiveis = (req, res) => {
    const livrosDisponiveis = listarDisponiveis();
    res.status(200).json(livrosDisponiveis);
};

module.exports = { criar, buscarPorId, atualizar, deletar, disponiveis };