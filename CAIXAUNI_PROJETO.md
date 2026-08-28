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

### Produto e UX

- Criar modo demo guiado para pitch.
- Melhorar navegação mobile.
- Adicionar estados vazios mais claros.
- Melhorar feedback visual após criação de despesa.
- Criar uma tela ou seção explicando melhor a tese do projeto.
- Adicionar cards de pesquisa documental quando os casos forem levantados.

### Frontend

- Persistir estado local em `localStorage` para a demo não reiniciar ao recarregar.
- Criar validações simples nos formulários.
- Criar layout mobile com menu funcional.
- Melhorar acessibilidade dos formulários e navegação.
- Adicionar testes básicos se houver tempo.

### Backend

- Definir stack do backend.
- Criar API para usuários.
- Criar API para organizações.
- Criar API para propostas de despesa.
- Criar API para aprovações.
- Criar persistência em banco tradicional.
- Criar autenticação real.

### Web3 e Solana

- Estudar integração com Squads.
- Definir como criar ou referenciar uma multisig.
- Mapear proposta CaixaUni para proposta Squads.
- Simular ou integrar aprovação real via Squads.
- Avaliar integração Solana Pay para contribuições.
- Evitar complexidade Web3 visível para o usuário final.

### Pesquisa e Pitch

- Montar dossiê documental com 5 a 10 casos brasileiros.
- Selecionar 2 ou 3 casos fortes para apresentação.
- Criar roteiro de vídeo com menos de 5 minutos.
- Criar slides.
- Declarar uso de IA conforme exigência da hackathon.
- Preparar link público da aplicação.

## Próximas Etapas Recomendadas

### Próxima etapa técnica imediata

Criar modo demo guiado.

Objetivo:

```text
Conduzir a banca pelo fluxo principal sem depender de explicação manual.
```

Passos sugeridos:

```text
1. Criar organização
2. Criar despesa
3. Aprovar com responsáveis
4. Atingir 3/5
5. Mostrar movimentação autorizada
6. Mostrar histórico atualizado
```

### Depois disso

Persistir estado local com `localStorage`.

Objetivo:

```text
Evitar que a demo zere se a página for recarregada durante apresentação ou gravação.
```

### Depois da persistência

Criar mock visual da camada Squads/Solana.

Objetivo:

```text
Mostrar claramente que a aprovação coletiva está conectada ao conceito de multisig, mesmo antes da integração real.
```

## Mensagens de Commit Sugeridas

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
- O frontend atual é mockado intencionalmente.
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
