const { Emprestimo } = require('../models');

const listarEmprestimos = async () => {
    return await Emprestimo.findAll();
};

const buscarEmprestimoPorId = async (id) => {
    return await Emprestimo.findByPk(id);
};

const listarEmprestimosPorUsuario = async (usuarioId) => {
    return await Emprestimo.findAll({ where: { usuario_id: usuarioId } });
};

const livroJaEmprestado = async (livroId) => {
    return await Emprestimo.findOne({ where: { livro_id: livroId, data_devolucao_real: null } });
};

const criarEmprestimo = async (dados) => {
    return await Emprestimo.create(dados);
};

const deletarEmprestimo = async (id) => {
    const emprestimo = await Emprestimo.findByPk(id);
    if (!emprestimo) return false;
    await emprestimo.destroy();
    return true;
};

const registrarDevolucao = async (id) => {
    const emprestimo = await Emprestimo.findByPk(id);
    if (!emprestimo) return null;

    return await emprestimo.update({
        data_devolucao_real: new Date().toISOString().slice(0, 10),
    });
};

module.exports = {
    listarEmprestimos,
    buscarEmprestimoPorId,
    listarEmprestimosPorUsuario,
    livroJaEmprestado,
    criarEmprestimo,
    deletarEmprestimo,
    registrarDevolucao,
};
