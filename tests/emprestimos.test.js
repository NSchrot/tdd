const axios = require('axios');
require('dotenv').config();
require('./helpers/testServer');
const { resetDatabase } = require('./helpers/resetDatabase');
const api = `http://localhost:${process.env.PORT || 3000}`;

const criarUsuario = async (nome = 'Aluno Emprestimo') => {
  const res = await axios.post(`${api}/usuarios`, {
    nome,
    email: `${nome.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}@email.com`,
    senha: '123456',
    tipo: 'aluno',
  });
  return res.data;
};

const criarLivro = async (titulo = 'Livro Emprestimo') => {
  const res = await axios.post(`${api}/livros`, { titulo, autor: 'Autor Base' });
  return res.data;
};

beforeAll(async () => {
  await resetDatabase();
});

describe('Empréstimos', () => {
  test('deve registrar um novo empréstimo', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();

    const res = await axios.post(`${api}/emprestimos`, {
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_devolucao_prevista: '2026-05-01',
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
  });

  test('deve retornar uma lista de empréstimos', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    await axios.post(`${api}/emprestimos`, {
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_devolucao_prevista: '2026-05-01',
    });

    const res = await axios.get(`${api}/emprestimos`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test('deve deletar um empréstimo', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const criado = await axios.post(`${api}/emprestimos`, {
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_devolucao_prevista: '2026-05-01',
    });

    const res = await axios.delete(`${api}/emprestimos/${criado.data.id}`);
    expect(res.status).toBe(204);
  });

  test('deve retornar 404 ao deletar empréstimo inexistente', async () => {
    try {
      await axios.delete(`${api}/emprestimos/99999`);
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });

  test('deve retornar um empréstimo pelo id', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const criado = await axios.post(`${api}/emprestimos`, {
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_devolucao_prevista: '2026-05-01',
    });

    const res = await axios.get(`${api}/emprestimos/${criado.data.id}`);
    expect(res.status).toBe(200);
  });

  test('deve retornar 404 para empréstimo inexistente', async () => {
    try {
      await axios.get(`${api}/emprestimos/99999`);
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });

  test('deve retornar 400 ao registrar empréstimo sem livro_id', async () => {
    const usuario = await criarUsuario();
    try {
      await axios.post(`${api}/emprestimos`, {
        usuario_id: usuario.id,
        data_devolucao_prevista: '2026-05-01',
      });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  test('deve retornar 400 ao registrar empréstimo sem usuario_id', async () => {
    const livro = await criarLivro();
    try {
      await axios.post(`${api}/emprestimos`, {
        livro_id: livro.id,
        data_devolucao_prevista: '2026-05-01',
      });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  test('deve retornar 400 ao registrar empréstimo sem data de devolução', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    try {
      await axios.post(`${api}/emprestimos`, {
        livro_id: livro.id,
        usuario_id: usuario.id,
      });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  test('deve registrar a devolução de um empréstimo', async () => {
    const usuario = await criarUsuario();
    const livro = await criarLivro();
    const criado = await axios.post(`${api}/emprestimos`, {
      livro_id: livro.id,
      usuario_id: usuario.id,
      data_devolucao_prevista: '2026-05-01',
    });

    const res = await axios.patch(`${api}/emprestimos/${criado.data.id}/devolver`);
    expect(res.status).toBe(200);
    expect(res.data.data_devolucao_real).toBeTruthy();
  });

  test('deve retornar 404 ao devolver empréstimo inexistente', async () => {
    try {
      await axios.patch(`${api}/emprestimos/99999/devolver`);
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });

  test('deve listar empréstimos de um usuário específico', async () => {
    const usuarioA = await criarUsuario('Aluno A');
    const usuarioB = await criarUsuario('Aluno B');
    const livroA = await criarLivro('Livro A');
    const livroB = await criarLivro('Livro B');

    await axios.post(`${api}/emprestimos`, {
      livro_id: livroA.id,
      usuario_id: usuarioA.id,
      data_devolucao_prevista: '2026-05-01',
    });

    await axios.post(`${api}/emprestimos`, {
      livro_id: livroB.id,
      usuario_id: usuarioB.id,
      data_devolucao_prevista: '2026-05-01',
    });

    const res = await axios.get(`${api}/emprestimos/usuario/${usuarioA.id}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBe(1);
  });

  test('deve retornar 400 ao emprestar livro já emprestado', async () => {
    const usuarioA = await criarUsuario('Aluno A');
    const usuarioB = await criarUsuario('Aluno B');
    const livro = await criarLivro('Livro Único');

    await axios.post(`${api}/emprestimos`, {
      livro_id: livro.id,
      usuario_id: usuarioA.id,
      data_devolucao_prevista: '2026-05-01',
    });

    try {
      await axios.post(`${api}/emprestimos`, {
        livro_id: livro.id,
        usuario_id: usuarioB.id,
        data_devolucao_prevista: '2026-05-15',
      });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });
});
