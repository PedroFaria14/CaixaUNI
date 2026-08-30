# CaixaUni

CaixaUni é um MVP web para tesourarias universitárias coletivas, como comissões de formatura e atléticas. A proposta é reduzir a concentração de controle sobre dinheiro coletivo usando uma experiência simples de aprovação 3 de 5, com caminho de evolução para Squads multisig na Solana.

## O que o MVP demonstra

- Landing page com narrativa de problema, tese e solução.
- Cadastro e login em modo demonstrativo.
- Criação de organização com regra de aprovação coletiva.
- Dashboard financeiro com saldo, meta, recebido, gasto e histórico.
- Criação de solicitação de despesa.
- Aprovação/rejeição por responsáveis até atingir threshold 3 de 5.
- Lançamento no histórico apenas quando a despesa é autorizada.
- Tela de contribuição com link demonstrativo de Solana Pay.
- Conexão de wallet Solana em Devnet via wallet adapter.

## O que é real hoje

- Frontend React funcional.
- Persistência local da demo com `localStorage`.
- Conexão de wallet Solana em Devnet.
- Consulta de status do RPC Solana no painel Web3.
- Build de produção com Vite.

## O que ainda é demonstrativo

- Login/cadastro não usam backend real.
- Organizações, propostas, membros e movimentações usam dados locais.
- Aprovação 3 de 5 é funcional no frontend, mas ainda não cria uma multisig real no Squads.
- Solana Pay está representado por um link demonstrativo.

## Stack

- React
- TypeScript
- Vite
- pnpm
- Solana Wallet Adapter
- `@solana/web3.js`
- `@sqds/multisig` preparado como dependência para o próximo incremento

## Como rodar

Instale as dependências:

```bash
pnpm install
```

Rode em desenvolvimento:

```bash
pnpm dev
```

Gere build de produção:

```bash
pnpm build
```

Pré-visualize o build:

```bash
pnpm preview
```

> Use `pnpm`. Não use `npm` neste projeto.

## Roteiro rápido de demo

1. Abrir a Landing e explicar: “Dinheiro coletivo. Decisões coletivas.”
2. Criar conta ou entrar no modo demo.
3. Criar organização com regra 3 de 5.
4. Ver dashboard financeiro.
5. Criar nova despesa.
6. Aprovar com responsáveis até atingir 3 aprovações.
7. Mostrar que a despesa só entra no histórico após o threshold.
8. Mostrar contribuição com link demonstrativo de Solana Pay.
9. Mostrar painel Solana/Devnet como base para o próximo incremento.

## Próximo incremento técnico

Começar pela integração Solana segura:

1. Ler saldo real da wallet conectada em Devnet.
2. Exibir status de rede e assinatura disponível.
3. Preparar serviço isolado para Squads.
4. Só depois criar transação real de multisig em Devnet.

## Cuidados de apresentação

- Não afirmar que o MVP já executa multisig real no Squads.
- Não afirmar que blockchain elimina fraude.
- A mensagem correta é: o CaixaUni reduz a dependência de controle individual e prepara o caminho para autorização coletiva on-chain.
