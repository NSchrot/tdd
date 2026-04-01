const { criarUsuario, listarUsuarios, buscarUsuarioPorId, buscarUsuarioPorEmail, atualizarUsuario, deletarUsuario } = require("../services/usuarioService");

const listar = async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const buscarPorId = async (req, res) => {
    try {
        const usuario = await buscarUsuarioPorId(Number(req.params.id));
        if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const criar = async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });
        if (!email) return res.status(400).json({ error: "Email é obrigatório" });

        const existente = await buscarUsuarioPorEmail(email);
        if (existente) return res.status(400).json({ error: "Email já cadastrado" });

        const usuario = await criarUsuario(nome, email, senha, tipo);
        res.status(201).json(usuario);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Email já cadastrado" });
        }
        res.status(500).json({ error: err.message });
    }
};

const atualizar = async (req, res) => {
    try {
        const usuario = await atualizarUsuario(Number(req.params.id), req.body);
        if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletar = async (req, res) => {
    try {
        const removido = await deletarUsuario(Number(req.params.id));
        if (!removido) return res.status(404).json({ error: "Usuário não encontrado" });
        res.status(200).json({ message: "Usuário removido com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
