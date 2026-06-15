import { api } from './api';

function normalizarMulta(multa) {
  if (!multa) return multa;

  const emprestimo = multa.Emprestimo || multa.emprestimo;

  return {
    ...multa,
    Emprestimo: emprestimo
      ? {
          ...emprestimo,
          Livro: emprestimo.Livro || emprestimo.livro,
          Usuario: emprestimo.Usuario || emprestimo.usuario,
        }
      : emprestimo,
    tipo: multa.tipo || multa.motivo,
    obs: multa.obs || multa.motivo,
    quitado: multa.quitado ?? multa.paga,
  };
}

function montarPayload(payload) {
  return {
    ...payload,
    motivo: payload.motivo || payload.tipo || payload.obs,
    paga: payload.paga ?? payload.quitado,
  };
}

export async function listarMultas() {
  const { data } = await api.get('/multas');
  return Array.isArray(data) ? data.map(normalizarMulta) : normalizarMulta(data);
}

export async function quitarMulta(id) {
  const { data } = await api.patch(`/multas/${id}/pagar`);
  return normalizarMulta(data);
}

export async function criarMulta(payload) {
  const { data } = await api.post('/multas', montarPayload(payload));
  return normalizarMulta(data);
}

export async function deletarMulta(id) {
  await api.delete(`/multas/${id}`);
}

export async function atualizarMulta(id, payload) {
  const { data } = await api.put(`/multas/${id}`, montarPayload(payload));
  return normalizarMulta(data);
}
