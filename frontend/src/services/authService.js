import { api } from './api';

export async function login(email, senha) {
  const { data } = await api.post('/usuarios/login', { email, senha });
  return data;
}

export async function register(nome, email, senha, tipo) {
  const { data } = await api.post('/usuarios/', { nome, email, senha, tipo });
  return data;
}
