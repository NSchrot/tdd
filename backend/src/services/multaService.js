const { Multa, Emprestimo, Livro, Usuario } = require('../models');

const listarMultas = async () => {
    return await Multa.findAll({
        include: [
            { model: Usuario, as: 'usuario' },
            { model: Emprestimo, as: 'emprestimo', include: [{ model: Livro, as: 'livro' }, { model: Usuario, as: 'usuario' }] },
        ],
    });
};

const buscarMultaPorId = async (id) => {
    return await Multa.findByPk(id, {
        include: [
            { model: Usuario, as: 'usuario' },
            { model: Emprestimo, as: 'emprestimo', include: [{ model: Livro, as: 'livro' }, { model: Usuario, as: 'usuario' }] },
        ],
    });
};

const listarMultasPorEmprestimo = async (emprestimoId) => {
    return await Multa.findAll({ where: { emprestimo_id: emprestimoId } });
};

const listarMultasPorUsuario = async (usuarioId) => {
    return await Multa.findAll({ where: { usuario_id: usuarioId } });
};

const criarMulta = async (dados) => {
    return await Multa.create(dados);
};

const atualizarMulta = async (id, dados) => {
    const multa = await Multa.findByPk(id);
    if (!multa) return null;
    return await multa.update(dados);
};

const deletarMulta = async (id) => {
    const multa = await Multa.findByPk(id);
    if (!multa) return false;
    await multa.destroy();
    return true;
};

const pagarMulta = async (id) => {
    const multa = await Multa.findByPk(id);
    if (!multa) return null;

    return await multa.update({
        paga: true,
        data_pagamento: new Date().toISOString().slice(0, 10),
    });
};

module.exports = {
    listarMultas,
    buscarMultaPorId,
    listarMultasPorUsuario,
    listarMultasPorEmprestimo,
    criarMulta,
    atualizarMulta,
    deletarMulta,
    pagarMulta,
};
