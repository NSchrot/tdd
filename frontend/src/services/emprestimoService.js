import { api } from './api';

function normalizarEmprestimo(emprestimo) {
  if (!emprestimo) return emprestimo;

  return {
    ...emprestimo,
    Livro: emprestimo.Livro || emprestimo.livro,
    Usuario: emprestimo.Usuario || emprestimo.usuario,
    data_devolucao: emprestimo.data_devolucao ?? emprestimo.data_devolucao_real,
  };
}

export async function listarEmprestimos() {
  const { data } = await api.get('/emprestimos');
  return Array.isArray(data) ? data.map(normalizarEmprestimo) : normalizarEmprestimo(data);
}

export async function criarEmprestimo(livro_id, usuario_id, data_devolucao_prevista) {
  const { data } = await api.post('/emprestimos', { livro_id, usuario_id, data_devolucao_prevista });
  return normalizarEmprestimo(data);
}

export async function atualizarEmprestimo(id, payload) {
  const { data } = await api.put(`/emprestimos/${id}`, payload);
  return normalizarEmprestimo(data);
}

export async function deletarEmprestimo(id) {
  await api.delete(`/emprestimos/${id}`);
}

export async function registrarDevolucao(emprestimoId) {
  const { data } = await api.patch(`/emprestimos/${emprestimoId}/devolver`);
  return normalizarEmprestimo(data);
}
