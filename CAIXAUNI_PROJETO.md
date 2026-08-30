# CaixaUni

Dinheiro coletivo. Decisões coletivas.

## Visão Geral

O CaixaUni é uma plataforma de tesouraria compartilhada para fundos universitários, inicialmente focada em comissões de formatura e atléticas.

A proposta é reduzir a concentração de controle sobre dinheiro coletivo por meio de regras de aprovação compartilhada, histórico verificável e uma experiência simples para usuários não técnicos.

## Problema

Fundos universitários podem reunir recursos relevantes de dezenas ou centenas de estudantes, mas a administração costuma depender de poucas pessoas, contas tradicionais, comprovantes, planilhas e confiança posterior.

O problema central do projeto não é apenas falta de transparência.

O problema central é:

```text
Concentração de controle sobre dinheiro coletivo.
```

Transparência sozinha mostra o que aconteceu. O CaixaUni busca atuar antes da movimentação, exigindo múltiplas aprovações para despesas relevantes.

## Solução

O CaixaUni funciona como uma tesouraria compartilhada.

Fluxo principal:

```text
Organização universitária
↓
Gestor cria solicitação de despesa
↓
Aprovadores analisam
↓
Regra 3 de 5 é aplicada
↓
Movimentação é autorizada ou permanece bloqueada
↓
Histórico financeiro é atualizado
```

Exemplo usado na demo:

```text
Despesa: Buffet ABC
Valor: R$ 12.000
Regra: 3 aprovações de 5 responsáveis
Status antes do threshold: bloqueada
Status ao atingir 3/5: autorizada
```

## Por Que Blockchain

O CaixaUni não usa blockchain apenas para registrar o que aconteceu.

O objetivo é usar blockchain para definir o que pode acontecer com o dinheiro.

Comparação conceitual:

```text
Planilha
Registra decisões.

Dashboard financeiro
Mostra decisões.

CaixaUni + multisig
Impõe a regra de decisão.
```

Frase central do projeto:

```text
O CaixaUni não usa blockchain apenas para registrar o que aconteceu. Utiliza blockchain para definir o que pode acontecer com o dinheiro.
```

## Por Que Solana

Solana foi escolhida como base do projeto por oferecer:

- transações rápidas;
- baixo custo;
- transparência;
- infraestrutura existente;
- possibilidade de pagamentos;
- integração com multisig;
- ecossistema com ferramentas como Squads e Solana Pay.

## Squads

Squads é a parte Web3 principal do conceito.

Arquitetura conceitual:

```text
CaixaUni
↓
Solana
↓
Squads
↓
Multisig
↓
5 responsáveis
↓
Threshold = 3
```

A regra da tesouraria deixa de existir apenas em um regulamento interno e passa a existir na infraestrutura financeira.

## Solana Pay

Solana Pay aparece como parte complementar do MVP, principalmente para arrecadação.

Exemplo:

```text
Mensalidade Agosto
R$ 250
↓
QR Code
↓
Pagamento
↓
Tesouraria CaixaUni
```

Prioridade técnica:

```text
Squads: essencial
Solana Pay: complementar
```

## MVP

O MVP não busca construir banco, exchange, DAO completa, sistema contábil, rede social ou sistema de eventos.

Hipótese principal:

```text
É possível administrar dinheiro coletivo universitário usando regras de aprovação compartilhada.
```

Telas previstas no MVP:

- Landing
- Login
- Cadastro
- Criar organização
- Dashboard
- Tesouraria
- Criar despesa
- Aprovar despesa
- Histórico
- Membros
- Contribuir

## Arquitetura Prevista

Arquitetura conceitual do produto completo:

```text
CaixaUni
│
├── React + TypeScript
│
├── Backend
│   │
│   ├── Banco tradicional
│   │   ├── Usuários
│   │   ├── Organizações
│   │   ├── Descrições
│   │   └── Configurações
│   │
│   └── Solana
│       ├── Squads
│       ├── Multisig
│       ├── Aprovações
│       └── Tesouraria
│
└── Solana Pay
```

Nem tudo deve ir para a blockchain.

Dados como usuários, descrições, preferências, metadados e configurações podem ficar em banco tradicional. A blockchain entra onde agrega valor real: controle compartilhado, aprovação e movimentação verificável.

## Estado Atual do Código

O projeto atualmente é um frontend mockado usando:

- React
- TypeScript
- Vite
- pnpm
- lucide-react
- CSS puro

Ainda não existe backend, banco de dados ou integração real com Solana/Squads.

## Etapas Já Concluídas

### 1. Base do Projeto

Criada a estrutura inicial com React, TypeScript e Vite.

Arquivos principais:

- `package.json`
- `pnpm-lock.yaml`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `postcss.config.mjs`
- `src/main.tsx`
- `src/styles.css`

### 2. Protótipo Visual do MVP

Foram implementadas as principais telas da jornada:

- Landing
- Login
- Cadastro
- Criar organização
- Dashboard
- Tesouraria
- Criar despesa
- Aprovar despesa
- Histórico
- Membros
- Contribuir

### 3. Fluxo Interativo de Aprovação

O fluxo de aprovação deixou de ser apenas visual e passou a usar estado local.

Hoje é possível:

- criar uma despesa;
- abrir a solicitação;
- aprovar por responsável;
- rejeitar por responsável;
- atualizar contador de aprovações;
- manter a despesa bloqueada antes do threshold;
- autorizar ao atingir `3/5`;
- atualizar o histórico automaticamente.

### 4. Cadastro e Login Mockados

Foi adicionada uma tela de cadastro com:

- nome;
- e-mail;
- senha;
- papel inicial.

O login e o cadastro ainda são mockados, mas já simulam a criação de um usuário atual para a demo.

### 5. Organização do Código

O `App.tsx` foi reduzido para concentrar apenas:

- estado mockado;
- navegação;
- handlers principais;
- seleção da tela atual.

Estrutura atual:

```text
src/
├── components/
│   ├── Metric.tsx
│   ├── MovementList.tsx
│   ├── PageTitle.tsx
│   └── ProposalCard.tsx
│
├── data/
│   └── mockData.ts
│
├── screens/
│   ├── ApproveExpense.tsx
│   ├── Contribute.tsx
│   ├── CreateOrganization.tsx
│   ├── Dashboard.tsx
│   ├── History.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Members.tsx
│   ├── NewExpense.tsx
│   ├── Register.tsx
│   └── Treasury.tsx
│
├── utils/
│   ├── formatters.ts
│   └── proposalStatus.ts
│
├── App.tsx
├── main.tsx
├── styles.css
├── types.ts
└── vite-env.d.ts
```

### 6. Produto, UX e Persistência de Dados (Modo Demo)

Foi implementado um modo demonstração focado em guiar os avaliadores:
- **Modo Demo Guiado**: Componente interativo que orienta o passo-a-passo (Criar organização → Criar despesa → Aprovar → Histórico).
- **Persistência em localStorage**: Todo o estado da aplicação agora é salvo no navegador (currentScreen, proposals, movements, currentUser), impedindo que a demonstração quebre com um recarregamento.
- **Evidências Documentais**: Adicionada seção na Landing Page com os casos reais (Medicina USP e Direito SC) justificando a tese.
- **Mock Visual da Camada Web3**: Inserido um bloco na Landing Page ilustrando a arquitetura: CaixaUni → Squads → Solana.
- **Melhoria Mobile**: Menu lateral ajustado para responsividade em dispositivos móveis (overlay e toggle funcional).

## Comandos do Projeto

Instalar dependências:

```bash
pnpm install
```

Rodar em desenvolvimento:

```bash
pnpm dev
```

Gerar build de produção:

```bash
pnpm build
```

Visualizar build:

```bash
pnpm preview
```

Importante:

```text
Usar pnpm. Não usar npm.
```

## Validações Já Feitas

Build validado com sucesso:

```bash
pnpm build
```

Resultado esperado:

```text
✓ built
```

## O Que Falta Fazer

### Backend (Mínimo / Opcional)

- Definir necessidade real de backend para a demo (podemos interagir direto com RPC).
- Se necessário, criar API leve para persistir metadados das propostas, pois a blockchain armazena os hashes/assinaturas, mas não precisa armazenar os títulos longos e descrições para economizar custos.

### Web3 e Solana (Squads Protocol)

- Estudar integração com a SDK do Squads Protocol.
- Criar a funcionalidade de "Criar Multisig" atrelada à organização.
- Mapear a aprovação simulada do CaixaUni para a submissão real de assinaturas no contrato multisig do Squads.
- Confirmar execução (Liquidação) na Solana após atingir a regra de 3/5.
- Avaliar integração Solana Pay para contribuições (Bônus).

### Pesquisa e Pitch

- Montar dossiê documental estendido (se desejar mais casos).
- Criar roteiro de vídeo de até 5 minutos baseado na Landing Page.
- Criar slides.
- Gravar a demonstração guiada.

## Próximas Etapas Recomendadas

### Estado atual do frontend

O frontend está pronto para apresentação como MVP demonstrativo:

- landing page com narrativa do problema e solução;
- cadastro/login em modo demonstrativo;
- criação de organização com regra 3 de 5;
- dashboard financeiro;
- criação e aprovação de despesas;
- histórico atualizado apenas quando o threshold é atingido;
- feedback visual de ações;
- contribuição com link demonstrativo;
- conexão de wallet Solana em Devnet.

### Próxima etapa técnica imediata

Iniciar a integração real com Solana por incrementos seguros.

Objetivo:
```text
Evoluir do fluxo demonstrativo para verificações reais em Devnet, começando por wallet, rede e saldo antes de enviar transações.
```

### Depois disso

Definição de Backend / Indexador.

Objetivo:
```text
Entender se a aplicação Next/React falará 100% com a rede Solana via RPC ou se um backend auxiliar será usado para dados off-chain das comissões (nomes, descrições).
```

## Mensagens de Commit Sugeridas

Para as melhorias do modo demo e persistência:

```text
feat: add guided demo mode, localStorage persistence and landing evidence
```

Para a criação inicial do frontend:

```text
feat: add initial CaixaUni frontend prototype
```

Para o fluxo interativo de aprovação:

```text
feat: add interactive approval flow
```

Para cadastro e login mockados:

```text
feat: add registration flow
```

Para separação de componentes e telas:

```text
refactor: split frontend screens into components
```

Para este documento:

```text
docs: add CaixaUni project overview
```

## Observações Importantes

- O projeto está em estágio de MVP e protótipo funcional.
- O frontend atual usa modo demonstrativo intencionalmente para provar a jornada principal.
- A prioridade da demo é provar o fluxo `despesa → aprovações → threshold → autorização`.
- A integração real com Squads/Solana deve vir depois de a experiência principal estar clara.
- Solana Pay é complementar; Squads é central para a tese.
- Não prometer que blockchain elimina fraude.
- Prometer redução da dependência de controle individual.

## Frases-Chave do Projeto

```text
Dinheiro coletivo. Decisões coletivas.
```

```text
Se o dinheiro é de todos, as decisões também deveriam ser.
```

```text
O CaixaUni não usa blockchain apenas para registrar o que aconteceu. Utiliza blockchain para definir o que pode acontecer com o dinheiro.
```

```text
Não prometemos eliminar fraude. Prometemos reduzir a dependência de controle individual.
```
