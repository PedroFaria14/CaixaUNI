# CaixaUni

**Dinheiro coletivo. Decisões coletivas.**

CaixaUni é um MVP web para tesourarias universitárias coletivas, como comissões de formatura e atléticas. A proposta é reduzir a concentração de controle sobre recursos de grupos usando uma experiência simples de aprovação coletiva, com integração real à **Solana Devnet** e à **Squads multisig**.

O projeto foi construído para demonstração em hackathon: a interface explica o problema, conduz o avaliador pelo fluxo de criação de uma organização, criação de despesa, aprovação coletiva e validação on-chain.

---

## Problema

Muitos fundos universitários movimentam valores relevantes, mas ainda dependem de uma pessoa, uma conta, uma senha ou uma autorização individual.

O problema central não é apenas falta de planilha ou falta de transparência depois do gasto.

O problema central é:

```text
Concentração de controle sobre dinheiro coletivo.
```

O CaixaUni inverte a lógica:

```text
Antes
Alunos depositam
↓
1 responsável controla
↓
Movimentação acontece
↓
Prestação de contas depois

CaixaUni
Despesa é proposta
↓
Responsáveis aprovam
↓
Threshold mínimo é atingido
↓
Execução só acontece após a regra coletiva
```

---

## Casos reais usados na narrativa

A landing contém um **Dossiê CaixaUni** com casos públicos documentados na imprensa brasileira. Eles servem para contextualizar o problema e mostrar padrões recorrentes de risco.

| Caso | Ano | Valor aproximado | Organização | Vulnerabilidade observada | Fonte exibida |
| --- | --- | ---: | --- | --- | --- |
| Medicina USP | 2023 | R$ 927 mil | Formatura | Saques/transferências unilaterais em conta coletiva | CNN / G1 |
| Direito SC | 2025 | R$ 77 mil | Formatura | Recursos em conta pessoal de responsável | CNN |
| Odontologia UEM | 2023 | R$ 85 mil | Formatura | Pix para conta física, sem auditoria em tempo real | G1 PR |
| Medicina UFPR | 2018 | R$ 160 mil | Atlética | Mesma pessoa aprovava gastos e controlava acesso bancário | RPC / Band |
| Odontologia UFF | 2019 | R$ 90 mil | Formatura | Saques sem coassinatura para valores altos | O Globo |
| Geologia UnB | 2019 | R$ 50 mil | Formatura | Controle centralizado e baixa verificabilidade | Imprensa local |

> Antes de usar em apresentação pública formal, recomenda-se anexar links diretos das fontes no material final.

---

## O que o MVP demonstra

- Landing page com tese, problema, comparação e casos reais.
- Cadastro e login em modo demonstrativo.
- Proteção de telas internas por login.
- Criação de organização com regra coletiva `3/5`.
- Painel de preparação Web3 com wallet, RPC, saldo Devnet e Squads.
- Criação real de multisig Squads na Solana Devnet.
- Dashboard financeiro com saldo, meta, recebido, gasto e histórico.
- Criação de solicitação de despesa.
- Aprovação/rejeição local por responsáveis até atingir threshold na interface.
- Criação de proposta Squads on-chain vinculada à despesa.
- Aprovação on-chain via wallet.
- Consulta do status on-chain da proposta.
- Execução on-chain quando o status real da Squads indica `readyToExecute`.
- Tela de contribuição com Solana Pay demonstrativo.
- Guia lateral para conduzir o pitch.

---

## O que é real hoje

- Frontend React funcional.
- Build de produção com Vite.
- Persistência local da demo via `localStorage`.
- Conexão com wallets Solana via Wallet Adapter.
- Suporte a Phantom e Solflare.
- Rede Solana configurada para **Devnet**.
- Consulta real do RPC Solana.
- Consulta real de saldo da wallet conectada.
- Links para Solana Explorer Devnet.
- Validação das public keys dos membros.
- Criação real de multisig Squads Devnet.
- Criação real de proposta Squads.
- Aprovação real da proposta Squads pela wallet conectada.
- Leitura real de votos/status on-chain.
- Execução real na Squads quando o threshold on-chain estiver atingido.

---

## O que ainda é demonstrativo

- Login e cadastro não usam backend real.
- Usuário autenticado é salvo localmente.
- Organizações, propostas, membros e movimentações do dashboard principal usam estado local.
- Não há banco de dados.
- Não há backend próprio.
- Solana Pay aparece como fluxo complementar/demonstrativo.
- A aprovação da interface e a aprovação on-chain são camadas diferentes:
  - a interface mostra a experiência que o usuário final teria;
  - a Squads registra o estado real da proposta na blockchain.

### Observação importante sobre UI vs on-chain

A tela de aprovação separa dois estados:

```text
Aprovação na interface
```

e

```text
Status on-chain da Squads
```

Isso existe porque a UI pode mostrar a jornada de aprovação local enquanto a blockchain ainda está processando ou ainda não recebeu votos suficientes. O botão **Executar na Squads** permanece bloqueado até o status on-chain indicar que a proposta está pronta para execução.

Durante uma gravação ou pitch, o fluxo correto é:

```text
Criar proposta Squads
↓
Aprovar na Squads
↓
Assinar na wallet
↓
Atualizar status Squads
↓
Confirmar votos on-chain
↓
Executar na Squads
```

---

## Stack

- React
- TypeScript
- Vite
- pnpm
- Solana Wallet Adapter
- `@solana/web3.js`
- `@sqds/multisig`
- `lucide-react`
- `vite-plugin-node-polyfills`

---

## Requisitos

- Node.js compatível com Vite/React atual.
- pnpm instalado.
- Wallet Solana instalada no navegador:
  - Phantom; ou
  - Solflare.
- Wallet configurada para **Devnet**.
- Saldo em SOL de Devnet para assinar transações.

> Use faucet de Devnet se a wallet não tiver saldo.

---

## Como rodar localmente

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

Visualize o build localmente:

```bash
pnpm preview
```

> Convenção do projeto: use `pnpm`. Não use `npm` ou `yarn`.

---

## Variáveis de ambiente

O projeto atual não exige variáveis de ambiente para rodar.

A conexão usa:

```text
clusterApiUrl('devnet')
```

em `src/providers/SolanaProvider.tsx`.

Se futuramente for usada uma RPC privada, recomenda-se adicionar variável como:

```text
VITE_SOLANA_RPC_URL=https://...
```

Não commitar chaves privadas, mnemonics, tokens de RPC privados ou secrets.

---

## Estrutura do projeto

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── types.ts
├── assets/
├── components/
├── data/
├── hooks/
├── providers/
├── screens/
├── services/
└── utils/
```

### Arquivos principais

| Caminho | Função |
| --- | --- |
| `src/App.tsx` | Orquestra telas, estado principal, navegação, sessão demo e feedbacks. |
| `src/main.tsx` | Entrada da aplicação React. |
| `src/styles.css` | Estilos globais, landing, sidebar, telas e responsividade. |
| `src/types.ts` | Tipos compartilhados do app. |
| `src/data/mockData.ts` | Membros, telas, propostas e movimentações iniciais. |
| `src/providers/SolanaProvider.tsx` | Configura conexão Solana Devnet e wallets. |
| `src/services/solana.ts` | Helpers Solana: rede, explorer, saldo, validação de public keys. |
| `src/services/squads.ts` | Construção de transações Squads: multisig, proposta, aprovação, status e execução. |
| `src/hooks/useLocalStorage.ts` | Persistência local tipada com `localStorage`. |
| `src/utils/formatters.ts` | Formatação BRL e parsing de campos monetários. |
| `src/utils/proposalStatus.ts` | Cálculo do status local da proposta. |

---

## Telas

| Tela | Objetivo |
| --- | --- |
| Landing | Apresenta tese, problema, dossiê e valor da solução. |
| Login | Inicia usuário demo. |
| Cadastro | Cria usuário demo local. |
| Criar organização | Define organização, meta financeira e prepara/cria multisig Squads. |
| Dashboard | Mostra resumo financeiro e progresso da meta. |
| Tesouraria | Lista propostas de despesa. |
| Criar despesa | Cria nova solicitação local. |
| Aprovar despesa | Mostra aprovação local e fluxo on-chain Squads. |
| Histórico | Mostra movimentações registradas. |
| Membros | Mostra responsáveis da organização. |
| Contribuir | Demonstra entrada de contribuição/Solana Pay. |

Antes do login, a navegação exibe apenas:

- Landing;
- Login;
- Cadastro.

Após login/cadastro, as telas internas são liberadas.

---

## Fluxos principais

### 1. Login demo

```text
Landing
↓
Começar demo
↓
Cadastro ou login
↓
currentUser salvo no localStorage
↓
Criar organização
```

### 2. Criação de organização + multisig

```text
Criar organização
↓
Conectar wallet Phantom/Solflare
↓
Consultar RPC e saldo Devnet
↓
Preparar multisig
↓
Criar multisig Devnet
↓
Assinar transação na wallet
↓
Confirmar na Solana Devnet
↓
Salvar multisig no localStorage
```

### 3. Criar despesa

```text
Criar despesa
↓
Informar fornecedor, valor e justificativa
↓
Criar solicitação local
↓
Abrir tela de aprovação
```

### 4. Aprovação local da interface

```text
Aprovar despesa
↓
Responsáveis aprovam/rejeitam na UI
↓
Quando atinge 3/5, a interface mostra aprovação local completa
↓
Histórico local pode refletir movimentação autorizada
```

### 5. Fluxo Squads on-chain

```text
Aprovar despesa
↓
Criar proposta Squads
↓
Assinar na wallet
↓
Proposta é criada na Devnet
↓
Aprovar na Squads
↓
Assinar na wallet
↓
Atualizar status Squads
↓
Ler votos reais on-chain
↓
Executar na Squads quando readyToExecute = true
```

---

## Preparar multisig vs Criar multisig Devnet

### Preparar multisig

É uma etapa local. Não envia transação.

Ela:

- valida wallet conectada;
- valida configuração dos membros;
- monta a instrução Squads localmente;
- gera uma `createKey` temporária;
- calcula o endereço futuro da multisig (`multisigPda`);
- mostra um plano antes da assinatura.

Resumo:

```text
Preparar multisig = montar e exibir o plano sem registrar na blockchain.
```

### Criar multisig Devnet

É a ação real na Solana Devnet.

Ela:

- monta a transação real;
- pede assinatura da wallet;
- aplica assinatura temporária da `createKey`;
- simula a transação;
- envia para a Devnet;
- aguarda confirmação;
- salva assinatura e endereço da multisig no `localStorage`;
- mostra link no Solana Explorer.

Resumo:

```text
Criar multisig Devnet = assinar e registrar a multisig de verdade na blockchain de testes.
```

---

## Dados da demo

Os membros demonstrativos ficam em `src/data/mockData.ts`.

Membros atuais:

- Ana;
- Pedro;
- João;
- Maria;
- Lucas.

Cada membro possui uma public key configurada para validação/uso no fluxo Squads.

Regra padrão:

```text
3 aprovações de 5 responsáveis
```

---

## Estado local

A demo usa `localStorage` para manter o estado entre reloads.

Chaves principais:

| Chave | Conteúdo |
| --- | --- |
| `caixauni_currentScreen` | Tela atual. |
| `caixauni_currentUser` | Usuário demo logado. |
| `caixauni_proposals` | Propostas locais. |
| `caixauni_movements` | Movimentações locais. |
| `caixauni_selectedProposalId` | Proposta selecionada. |
| `caixauni_squadsMultisig` | Multisig criada na Devnet. |
| `caixauni_squadsProposals` | Propostas Squads criadas. |
| `caixauni_squadsApprovals` | Aprovações on-chain salvas localmente. |
| `caixauni_squadsChainStatuses` | Últimos status lidos da Squads. |
| `caixauni_squadsExecutions` | Execuções on-chain salvas localmente. |

O botão **Reiniciar demo** limpa os dados principais e estados Squads salvos localmente.

---

## Roteiro rápido para pitch

1. Abrir a landing.
2. Explicar a frase: **Dinheiro coletivo. Decisões coletivas.**
3. Mostrar a seção do problema e o Dossiê CaixaUni.
4. Clicar em **Começar demo**.
5. Fazer login/cadastro demo.
6. Criar organização.
7. Conectar Phantom ou Solflare em Devnet.
8. Conferir RPC online e saldo Devnet.
9. Clicar em **Preparar multisig**.
10. Explicar que essa etapa mostra o plano antes de assinar.
11. Clicar em **Criar multisig Devnet**.
12. Assinar na wallet.
13. Criar uma despesa.
14. Na tela de aprovação, explicar a diferença entre aprovação local e status on-chain.
15. Clicar em **Criar proposta Squads**.
16. Assinar na wallet.
17. Clicar em **Aprovar na Squads**.
18. Assinar na wallet.
19. Clicar em **Atualizar status Squads** até o status refletir a confirmação real.
20. Executar na Squads quando o botão estiver liberado.
21. Mostrar histórico/dashboard.
22. Usar **Reiniciar demo** para repetir a apresentação, se necessário.

Durante delays da Devnet, use a narrativa:

```text
Enquanto a blockchain processa, a interface mantém o usuário informado e só libera execução quando a Squads confirma o threshold on-chain.
```

---

## Checklist antes da demo

- [ ] Rodar `pnpm build` localmente.
- [ ] Conferir se a wallet está em **Devnet**.
- [ ] Conferir saldo SOL Devnet.
- [ ] Limpar estado com **Reiniciar demo**.
- [ ] Testar login/cadastro.
- [ ] Criar organização.
- [ ] Preparar e criar multisig Devnet.
- [ ] Criar despesa.
- [ ] Criar proposta Squads.
- [ ] Aprovar na Squads.
- [ ] Atualizar status Squads.
- [ ] Executar apenas quando on-chain estiver pronto.
- [ ] Validar responsividade básica da landing.

---

## Comandos úteis

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
git status --short --branch
```

---

## Deploy

O projeto é compatível com deploy na Vercel como aplicação Vite.

Configuração esperada:

```text
Build command: pnpm build
Output directory: dist
```

Warnings conhecidos no build:

- alguns chunks ficam maiores que 500 kB por causa das bibliotecas Solana/Squads;
- o módulo `vm` pode aparecer como externalizado para compatibilidade browser.

Esses warnings são conhecidos e não bloqueiam a demo atual.

---

## Limitações honestas

- O projeto ainda não substitui um sistema financeiro completo.
- Não há backend, banco ou autenticação real.
- Não há KYC, compliance, contabilidade formal ou conciliação bancária.
- Blockchain não elimina fraude no mundo físico; ela reduz a dependência de autorização individual e aumenta verificabilidade.
- A integração on-chain depende de RPC, wallet, saldo Devnet e confirmação da rede.
- Para atingir `3/5` on-chain de forma literal, é necessário operar com wallets membros suficientes na multisig. A UI local demonstra a jornada de aprovação de forma didática.

Mensagem correta do pitch:

```text
O CaixaUni reduz a dependência de controle individual e transforma regras de aprovação coletiva em uma experiência simples, verificável e conectada à infraestrutura multisig da Solana.
```

---

## Convenções do projeto

- Usar `pnpm`.
- Manter rede padrão em Solana Devnet durante a demo.
- Não commitar secrets, private keys ou mnemonics.
- Preservar os nomes demonstrativos dos membros: Ana, Pedro, João, Maria e Lucas.
- Preservar a regra visual/conceitual `3/5`.
- Validar com `pnpm build` antes de deploy.
- Commits sugeridos em inglês no padrão convencional:
  - `feat: ...`
  - `fix: ...`
  - `refactor: ...`
  - `docs: ...`

---

## Próximos passos possíveis

- Adicionar links diretos das fontes do Dossiê CaixaUni.
- Extrair a lógica Squads de `ApproveExpense.tsx` para um hook dedicado, como `useSquadsProposal`.
- Criar backend real para organizações, usuários, propostas e histórico.
- Persistir dados em banco.
- Implementar autenticação real.
- Integrar Solana Pay de ponta a ponta.
- Melhorar code splitting para reduzir bundle inicial.
- Criar testes automatizados para fluxos críticos.

---

## Status atual

MVP funcional para demonstração:

- landing pronta;
- guia de pitch pronto;
- fluxo demo local pronto;
- integração Solana Devnet pronta;
- fluxo Squads disponível;
- build de produção validado.
