const { Multa } = require('../models');

const listarMultas = async () => {
    return await Multa.findAll();
};

const buscarMultaPorId = async (id) => {
    return await Multa.findByPk(id);
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
    criarMulta,
    atualizarMulta,
    deletarMulta,
    pagarMulta,
};
