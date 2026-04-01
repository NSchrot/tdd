const { Livro } = require('../models');

const criarLivro = async (titulo, autor) => {
    return await Livro.create({ titulo, autor });
};

const buscarLivroPorId = async (id) => {
    return await Livro.findByPk(id);
};

const atualizarLivro = async (id, dados) => {
    const livro = await Livro.findByPk(id);
    if (!livro) return null;
    return await livro.update(dados);
};

const deletarLivro = async (id) => {
    const livro = await Livro.findByPk(id);
    if (!livro) return false;
    await livro.destroy();
    return true;
};

const listarDisponiveis = async () => {
    return await Livro.findAll({ where: { disponivel: true } });
};

const resetarLivros = async () => {
    await Livro.destroy({ truncate: true, cascade: true });
};

module.exports = { criarLivro, buscarLivroPorId, atualizarLivro, deletarLivro, listarDisponiveis, resetarLivros };
