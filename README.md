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
- Conexão de wallet Solana em Phantom/Devnet.
- Consulta de status do RPC Solana no painel Web3.
- Consulta de saldo real da wallet conectada em Devnet.
- Link para a wallet conectada no Solana Explorer Devnet.
- Validação local da configuração Squads 3 de 5 com public keys dos membros.
- Criação real de multisig Squads em Devnet com assinatura pela wallet conectada.
- Fluxo completo Squads on-chain:
  - Criação de proposta de despesa on-chain;
  - Aprovação on-chain;
  - Execução on-chain;
- Build de produção com Vite.

## O que ainda é demonstrativo

- Login/cadastro não usam backend real.
- Organizações, propostas, membros e movimentações do dashboard principal usam dados locais.
- A UI de aprovação mostra um time de 5 pessoas e exige 3 aprovações na interface (3/5), porém a multisig criada on-chain usa uma configuração 1/5 (apenas a sua wallet) para permitir que a demonstração seja feita por uma única pessoa no palco sem a necessidade de coordenar 3 wallets Phantom reais ao vivo.
- Solana Pay está representado por um link demonstrativo.

## Stack

- React
- TypeScript
- Vite
- pnpm
- Solana Wallet Adapter
- `@solana/web3.js`
- `@sqds/multisig` 

## Como rodar

Instale as dependências com pnpm:

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

> Use `pnpm`. Não use `npm` ou `yarn` neste projeto.

## Roteiro rápido de demo

1. Abrir a Landing e explicar: "Dinheiro coletivo. Decisões coletivas."
2. Entrar no modo demo.
3. Criar organização com regra 3/5.
4. Conectar a Phantom Wallet em **Devnet** com SOL disponível e criar a Multisig on-chain (painel Web3).
5. Criar nova despesa.
6. Na tela de aprovação, explicar o fluxo técnico da aprovação.
7. Criar proposta Squads on-chain.
8. Aprovar na Squads on-chain.
9. Executar na Squads on-chain (tudo usando 1 única wallet graças ao modo demo 1/5).
10. Aprovar na interface CaixaUni até atingir 3 aprovações para mostrar como seria para os usuários e liberar a movimentação no histórico local.
11. Mostrar que a despesa entra no histórico.
12. Ao terminar, clique em "Reiniciar demo" para limpar todo o estado e repetir a apresentação do zero.

## Limitações honestas

- A multisig criada on-chain tem threshold 1/5 apenas para viabilidade da demonstração. Na vida real seria 3/5 e as wallets dos envolvidos seriam as keys do Squads.
- Não afirme que blockchain elimina fraude totalmente (depende do oráculo e do mundo físico).
- A mensagem correta é: o CaixaUni reduz a dependência de controle individual e força a autorização coletiva, sendo o frontend uma ponte amigável para a complexidade técnica do Squads.
