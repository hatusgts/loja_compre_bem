# Demo — Catálogo de Produtos

Aplicativo de demonstração em React Native (Expo). O objetivo é mostrar, no menor
código possível, os conceitos básicos de um app mobile: **lista, navegação entre
telas, formulário com validação, busca e layout responsivo**.

Sem imagens e praticamente sem cores — só texto, bordas cinzas e preto no branco —
para que a atenção fique no comportamento, não no visual. Também não há back-end,
banco de dados nem autenticação: os dados vivem em memória e são reiniciados a cada
execução.

## Como executar

```bash
npm install
npm start
```

Depois escolha o alvo no menu do Expo: `a` (Android), `i` (iOS) ou `w` (navegador).
Para abrir direto: `npm run android`, `npm run ios` ou `npm run web`.

## O que dá para demonstrar

| # | Passo | O que a demo mostra |
|---|-------|---------------------|
| 1 | Abrir o app | Lista com 3 produtos de exemplo (nome e preço) |
| 2 | Tocar em um produto | Navegação em pilha para a tela de detalhe, com voltar |
| 3 | Digitar na busca | Filtragem da lista em tempo real pelo nome |
| 4 | Buscar algo inexistente | Mensagem de estado vazio |
| 5 | Cadastrar sem nome | Validação: "O nome não pode ficar vazio." |
| 6 | Cadastrar com preço `0` ou texto | Validação de preço numérico maior que zero |
| 7 | Cadastrar `Suporte` / `59,90` | Item novo entra na lista, preço formatado como `R$ 59,90` |
| 8 | Abrir o item recém-criado | O detalhe funciona igual para dados criados em runtime |
| 9 | Alargar a janela no navegador | Layout muda de 1 para 2 colunas acima de 700 px |

## Estrutura

```
index.js                 Ponto de entrada (registra o App)
App.tsx                  Navegação em pilha + estado compartilhado dos produtos
types.ts                 Tipos Produto e rotas
TelaListaProdutos.tsx    Lista, busca, formulário de cadastro e validação
TelaDetalheProduto.tsx   Detalhe de um produto
```

São 5 arquivos de código no total — tudo o que a demo faz cabe neles. A paleta
inteira são quatro valores: preto, branco, cinza (`#666` texto / `#CCC` bordas) e
um vermelho usado só nas mensagens de erro.
