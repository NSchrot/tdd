const axios = require('axios');
require('dotenv').config();
require('./helpers/testServer');
const { resetDatabase } = require('./helpers/resetDatabase');
const api = `http://localhost:${process.env.PORT || 3000}`;

const criarUsuario = async (nome = 'Aluno Multa') => {
  const res = await axios.post(`${api}/usuarios`, {
    nome,
    email: `${nome.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}@email.com`,
    senha: '123456',
    tipo: 'aluno',
  });
  return res.data;
};

const criarLivro = async (titulo = 'Livro Multa') => {
  const res = await axios.post(`${api}/livros`, { titulo, autor: 'Autor Multa' });
  return res.data;
};

const criarEmprestimo = async (usuarioId, livroId) => {
  const res = await axios.post(`${api}/emprestimos`, {
    livro_id: livroId,
    usuario_id: usuarioId,
    data_devolucao_prevista: '2026-05-01',
  });
  return res.data;
};

beforeAll(async () => {
  await resetDatabase();
});

describe('Multas', () => {
  test('deve registrar uma multa', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const emprestimo = await criarEmprestimo(usuario.id, livro.id);

    const res = await axios.post(`${api}/multas`, {
      usuario_id: usuario.id,
      emprestimo_id: emprestimo.id,
      valor: 19.9,
      motivo: 'Atraso',
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
  });

  test('deve retornar uma lista de multas', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const emprestimo = await criarEmprestimo(usuario.id, livro.id);

    await axios.post(`${api}/multas`, {
      usuario_id: usuario.id,
      emprestimo_id: emprestimo.id,
      valor: 10,
      motivo: 'Atraso',
    });

    const res = await axios.get(`${api}/multas`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test('deve retornar multa por id', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const emprestimo = await criarEmprestimo(usuario.id, livro.id);
    const criada = await axios.post(`${api}/multas`, {
      usuario_id: usuario.id,
      emprestimo_id: emprestimo.id,
      valor: 5,
      motivo: 'Dano',
    });

    const res = await axios.get(`${api}/multas/${criada.data.id}`);
    expect(res.status).toBe(200);
  });

  test('deve retornar 404 para multa inexistente', async () => {
    try {
      await axios.get(`${api}/multas/99999`);
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });

  test('deve atualizar multa', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const emprestimo = await criarEmprestimo(usuario.id, livro.id);
    const criada = await axios.post(`${api}/multas`, {
      usuario_id: usuario.id,
      emprestimo_id: emprestimo.id,
      valor: 5,
      motivo: 'Dano',
    });

    const res = await axios.put(`${api}/multas/${criada.data.id}`, {
      valor: 20,
      motivo: 'Atraso + dano',
    });

    expect(res.status).toBe(200);
  });

  test('deve retornar 404 ao atualizar multa inexistente', async () => {
    try {
      await axios.put(`${api}/multas/99999`, { valor: 20 });
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });

  test('deve remover multa', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const emprestimo = await criarEmprestimo(usuario.id, livro.id);
    const criada = await axios.post(`${api}/multas`, {
      usuario_id: usuario.id,
      emprestimo_id: emprestimo.id,
      valor: 5,
      motivo: 'Dano',
    });

    const res = await axios.delete(`${api}/multas/${criada.data.id}`);
    expect(res.status).toBe(204);
  });

  test('deve retornar 404 ao remover multa inexistente', async () => {
    try {
      await axios.delete(`${api}/multas/99999`);
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });

  test('deve pagar multa', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const emprestimo = await criarEmprestimo(usuario.id, livro.id);
    const criada = await axios.post(`${api}/multas`, {
      usuario_id: usuario.id,
      emprestimo_id: emprestimo.id,
      valor: 5,
      motivo: 'Dano',
    });

    const res = await axios.patch(`${api}/multas/${criada.data.id}/pagar`);
    expect(res.status).toBe(200);
    expect(res.data.paga).toBe(true);
  });

  test('deve retornar 404 ao pagar multa inexistente', async () => {
    try {
      await axios.patch(`${api}/multas/99999/pagar`);
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });

  test('deve listar multas de usuário específico', async () => {
    const usuarioA = await criarUsuario('Aluno A');
    const usuarioB = await criarUsuario('Aluno B');
    const livroA = await criarLivro('Livro A');
    const livroB = await criarLivro('Livro B');
    const emprestimoA = await criarEmprestimo(usuarioA.id, livroA.id);
    const emprestimoB = await criarEmprestimo(usuarioB.id, livroB.id);

    await axios.post(`${api}/multas`, {
      usuario_id: usuarioA.id,
      emprestimo_id: emprestimoA.id,
      valor: 10,
      motivo: 'Atraso',
    });

    await axios.post(`${api}/multas`, {
      usuario_id: usuarioB.id,
      emprestimo_id: emprestimoB.id,
      valor: 3,
      motivo: 'Dano',
    });

    const res = await axios.get(`${api}/multas/usuario/${usuarioA.id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBe(1);
  });

  test('deve retornar 400 ao criar multa sem usuario_id', async () => {
    try {
      await axios.post(`${api}/multas`, { emprestimo_id: 1, valor: 10 });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  test('deve retornar 400 ao criar multa sem emprestimo_id', async () => {
    const usuario = await criarUsuario();
    try {
      await axios.post(`${api}/multas`, { usuario_id: usuario.id, valor: 10 });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  test('deve retornar 400 ao criar multa sem valor', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const emprestimo = await criarEmprestimo(usuario.id, livro.id);

    try {
      await axios.post(`${api}/multas`, {
        usuario_id: usuario.id,
        emprestimo_id: emprestimo.id,
      });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });
});
