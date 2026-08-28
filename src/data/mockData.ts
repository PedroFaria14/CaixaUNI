import type { Member, Movement, Proposal, Screen } from '../types';

export const screens: { id: Screen; label: string }[] = [
  { id: 'landing', label: 'Landing' },
  { id: 'login', label: 'Login' },
  { id: 'register', label: 'Cadastro' },
  { id: 'create-organization', label: 'Criar organização' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'treasury', label: 'Tesouraria' },
  { id: 'new-expense', label: 'Criar despesa' },
  { id: 'approve-expense', label: 'Aprovar despesa' },
  { id: 'history', label: 'Histórico' },
  { id: 'members', label: 'Membros' },
  { id: 'contribute', label: 'Contribuir' },
];

export const members: Member[] = [
  { id: 'ana', name: 'Ana', role: 'Aprovadora', pubkey: 'wgDgLVv9eWL81hdrL2m4BWpwDcntCSM5TqTQjD4xkXK' },
  { id: 'pedro', name: 'Pedro', role: 'Gestor', pubkey: 'HMhVMmJRQ3LDzcQiqseGLmaXz9aTbBe4sbZNBpy74uiU' },
  { id: 'joao', name: 'João', role: 'Membro', pubkey: '4Tz1qJYJNLajxCVDt9uydUx14HgmR9Ke2UWjnyc2yeSX' },
  { id: 'maria', name: 'Maria', role: 'Aprovadora', pubkey: '4qUzjWDoU7AFVEmezbvL46QjX5PjB1zrZMpNCuwahjeP' },
  { id: 'lucas', name: 'Lucas', role: 'Membro', pubkey: 'Fonq7xaLjX83mciKUwogjLqpe17hfXQMJpDHd4Fdkfai' },
];

export const initialProposals: Proposal[] = [
  {
    id: 'buffet-abc',
    title: 'Buffet ABC',
    description: 'Entrada de 30% para reserva da data.',
    amount: 12000,
    createdBy: 'Pedro',
    approvals: ['ana', 'pedro'],
    rejectedBy: [],
    threshold: 3,
    totalApprovers: 5,
  },
  {
    id: 'fotografia',
    title: 'Fotografia',
    description: 'Contrato de cobertura do evento principal.',
    amount: 4800,
    createdBy: 'Ana',
    approvals: ['ana', 'pedro', 'maria'],
    rejectedBy: [],
    threshold: 3,
    totalApprovers: 5,
  },
  {
    id: 'decoracao',
    title: 'Decoração',
    description: 'Sinalização e ambientação do salão.',
    amount: 6200,
    createdBy: 'Maria',
    approvals: ['pedro'],
    rejectedBy: [],
    threshold: 3,
    totalApprovers: 5,
  },
];

export const initialMovements: Movement[] = [
  { id: 'monthly-payments', title: 'Mensalidades', value: 7500, detail: 'Solana Pay', type: 'income' },
  { id: 'photo-payment', title: 'Fotografia', value: 4800, detail: '✓ 3/5 aprovações', type: 'expense' },
];
