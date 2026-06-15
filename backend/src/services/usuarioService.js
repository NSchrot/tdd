const { Usuario } = require('../models');

const criarUsuario = async (nome, email, senha, tipo) => {
    return await Usuario.create({ nome, email, senha, tipo });
};

const listarUsuarios = async () => {
    return await Usuario.findAll();
};

const buscarUsuarioPorId = async (id) => {
    return await Usuario.findByPk(id);
};

const buscarUsuarioPorEmail = async (email) => {
    return await Usuario.findOne({ where: { email } });
};

const loginUsuario = async (email, senha) => {
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario || usuario.senha !== senha) return null;

    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
    };
};

const atualizarUsuario = async (id, dados) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    return await usuario.update(dados);
};

const deletarUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return false;
    await usuario.destroy();
    return true;
};

const resetarUsuarios = async () => {
    await Usuario.destroy({ truncate: true, cascade: true });
};

module.exports = { criarUsuario, listarUsuarios, buscarUsuarioPorId, buscarUsuarioPorEmail, loginUsuario, atualizarUsuario, deletarUsuario, resetarUsuarios };
