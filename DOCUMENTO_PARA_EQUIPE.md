# CaixaUni — Documento Para Alinhamento

## Ideia Principal

O CaixaUni é uma plataforma para administrar dinheiro coletivo de grupos universitários, como comissões de formatura e atléticas.

A frase central do projeto é:

```text
Dinheiro coletivo. Decisões coletivas.
```

A ideia é simples: se o dinheiro pertence a muitas pessoas, uma única pessoa não deveria conseguir movimentar esse dinheiro sozinha.

## Problema Que Estamos Resolvendo

Hoje, muitos fundos universitários dependem de confiança em poucas pessoas.

Exemplo comum:

```text
Vários estudantes pagam mensalidades
↓
O dinheiro fica sob controle de poucos responsáveis
↓
Uma despesa é feita
↓
A prestação de contas vem depois
```

O CaixaUni quer inverter essa lógica:

```text
Vários estudantes pagam mensalidades
↓
Uma despesa é solicitada
↓
Mais de uma pessoa precisa aprovar
↓
Só depois a movimentação é autorizada
↓
O histórico fica registrado
```

O problema principal não é apenas falta de transparência.

O problema principal é:

```text
Concentração de controle sobre dinheiro coletivo.
```

## Solução

O CaixaUni funciona como uma tesouraria compartilhada.

Dentro da plataforma, uma organização pode definir responsáveis e uma regra de aprovação.

Exemplo:

```text
5 responsáveis
Regra: 3 de 5 aprovações
```

Se uma despesa for criada, ela só será autorizada quando pelo menos 3 responsáveis aprovarem.

## Exemplo Da Demo

Despesa:

```text
Buffet ABC
R$ 12.000
Entrada de 30% para reserva da data
```

Fluxo:

```text
Pedro cria a solicitação
↓
Ana aprova
↓
Pedro aprova
↓
Maria aprova
↓
3/5 aprovações
↓
Despesa autorizada
```

Se só uma pessoa tentar aprovar:

```text
1/5 aprovações
↓
Despesa bloqueada
```

## Por Que Blockchain Entra No Projeto

O CaixaUni não usa blockchain só para mostrar histórico.

A blockchain entra porque ela pode ajudar a impor a regra de aprovação.

Comparação:

```text
Planilha
Registra o que aconteceu.

Dashboard comum
Mostra o que aconteceu.

CaixaUni com multisig
Ajuda a definir o que pode acontecer.
```

Frase importante:

```text
O CaixaUni não usa blockchain apenas para registrar o que aconteceu. Utiliza blockchain para definir o que pode acontecer com o dinheiro.
```

## Por Que Solana

Solana faz sentido para o projeto porque oferece:

- transações rápidas;
- baixo custo;
- infraestrutura já existente;
- possibilidade de integração com multisig;
- possibilidade de pagamentos com Solana Pay.

## O Papel Do Squads

Squads é a parte mais importante da integração Web3.

Ele permite criar uma carteira compartilhada com regra de aprovação.

Exemplo:

```text
Carteira da Formatura
↓
5 responsáveis
↓
Threshold = 3
↓
Movimentação só acontece com 3 aprovações
```

No MVP atual, essa parte já possui integração real em Devnet para criação de multisig, proposta, aprovação, leitura de status e execução via Squads. A interface local continua existindo para demonstrar a jornada de aprovação de forma simples para usuários não técnicos.

## O Papel Do Solana Pay

Solana Pay pode ser usado para arrecadação.

Exemplo:

```text
Mensalidade Agosto
R$ 250
↓
QR Code
↓
Pagamento
↓
Entrada na tesouraria
```

Importante:

```text
Squads é essencial.
Solana Pay é complementar.
```

## O Que Já Foi Feito No Código

Já existe um frontend funcional, conectado à blockchain (Devnet) e com alguns fluxos auxiliares mockados na UI.

Telas criadas:

- Landing page
- Login
- Cadastro
- Criar organização
- Dashboard
- Tesouraria
- Criar despesa
- Aprovar despesa (com integração Squads)
- Histórico
- Membros
- Contribuir

Fluxos já funcionando:

- criar uma despesa;
- aprovar com responsáveis na interface;
- bloquear antes de atingir 3/5 na interface;
- conectar Phantom wallet e usar RPC;
- criar multisig real na Squads (Devnet);
- criar proposta real de despesa na Squads (Devnet);
- aprovar a proposta na Squads (Devnet);
- executar a proposta na Squads (Devnet).

## Estado Atual Do Projeto

Tecnologias usadas:

- React
- TypeScript
- Vite
- pnpm
- CSS puro
- lucide-react
- Solana Wallet Adapter
- SDK do Squads Protocol (`@sqds/multisig`)

O projeto ainda não tem:

- backend e banco de dados reais;
- login real (funciona via localStorage para a demo da interface);
- integração real com Solana Pay.

Tudo isso pode entrar depois, o foco do hackathon foi provar a viabilidade da aprovação multi-assinatura (multisig) on-chain de forma amigável.

## Como Rodar O Projeto

Instalar dependências com pnpm:

```bash
pnpm install
```

Rodar localmente:

```bash
pnpm dev
```

Gerar build:

```bash
pnpm build
```

Importante:

```text
Usar pnpm. Não usar npm ou yarn.
```

## Estado Atual Do Frontend

As seguintes tarefas **já foram concluídas** para a demonstração:
- criar modo demo guiado para o pitch;
- salvar estado no navegador com localStorage;
- criar multisig on-chain, propostas, aprovações e execuções usando Squads Protocol em Devnet;
- conectar wallet Solana em Devnet via wallet adapter;
- leitura de saldo real em SOL;
- links para o Solana Explorer;
- botão de "Reiniciar demo" que limpa todo o cache e o estado;
- tradução de erros comuns (RPC offline, usuário não autorizado, etc).

O frontend está pronto para apresentação técnica e pitch.

## O Que Ainda É Demonstrativo

- Login e cadastro ainda não usam backend real.
- Organizações, propostas do dashboard e movimentações ainda usam estado local.
- **Importante:** a interface local e o status on-chain são camadas diferentes. A UI demonstra a experiência de aprovação coletiva 3/5; a Squads registra o estado real na Solana Devnet. Durante a demo, só devemos executar na Squads depois de atualizar o status e confirmar que o threshold on-chain foi atingido.
- Solana Pay está representado por um link demonstrativo.

## O Que Falta Fazer

Próximas tarefas (pós-MVP / Visão de Futuro):

- criar um backend real (Node/TypeScript) para guardar os nomes das comissões, perfis e despesas;
- integrar o estado da multisig on-chain (3/5 de verdade) com o banco de dados;
- desenvolver a parte de arrecadação via Solana Pay real;
- lançar na Mainnet.

## O Que Falar No Pitch

Mensagem principal:

```text
Fundos universitários lidam com dinheiro coletivo, mas muitas vezes dependem de controle concentrado. O CaixaUni propõe uma tesouraria compartilhada onde despesas precisam de múltiplas aprovações antes de serem autorizadas.
```

Ponto forte:

```text
Não prometemos eliminar fraude. Prometemos reduzir a dependência de controle individual.
```

Frase de encerramento:

```text
Se o dinheiro é de todos, as decisões também deveriam ser.
```

## O Que Não Devemos Prometer

Não dizer:

- blockchain impede corrupção;
- isso elimina qualquer fraude;
- toda comissão de formatura é insegura;
- blockchain substitui bancos;
- a aprovação visual sozinha executa a movimentação on-chain.

Dizer:

- reduzimos concentração de controle;
- movimentações podem exigir múltiplas aprovações;
- histórico pode ser verificável;
- blockchain é usada onde faz sentido, especialmente para impor a regra multisig antes da execução;
- a experiência para o usuário deve parecer um app financeiro comum.

## Resumo Em Uma Frase

```text
CaixaUni é uma tesouraria compartilhada para fundos universitários, onde o dinheiro coletivo só se movimenta depois de decisões coletivas.
```
