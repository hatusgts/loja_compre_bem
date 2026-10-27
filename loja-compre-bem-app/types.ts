export type Produto = {
  produtoId: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string | null;
  quantidade: number;
};

export type PaginaProdutos = {
  content: Produto[];
  last: boolean;
  totalElements: number;
};

export type NovoProduto = {
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
};

export type RootStackParamList = {
  ListaProdutos: undefined;
  DetalheProduto: { produtoId: string };
};
