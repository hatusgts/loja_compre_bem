import type { NovoProduto, PaginaProdutos, Produto } from './types';

export const API_URL = 'http://localhost:3531/api/v1/produtos';

export function formatarPreco(preco: number) {
  return `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

export async function getProdutos(pagina: number, busca: string): Promise<PaginaProdutos> {
  const resposta = await fetch(`${API_URL}?page=${pagina}&size=20&busca=${encodeURIComponent(busca)}`);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return resposta.json();
}

export async function getProduto(id: string): Promise<Produto | null> {
  const resposta = await fetch(`${API_URL}/${id}`);
  if (resposta.status === 404) return null;
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return resposta.json();
}

export async function criarProduto(produto: NovoProduto): Promise<Produto> {
  const resposta = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return resposta.json();
}
