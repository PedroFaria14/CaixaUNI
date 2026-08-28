export type Screen =
  | 'landing'
  | 'login'
  | 'register'
  | 'create-organization'
  | 'dashboard'
  | 'treasury'
  | 'new-expense'
  | 'approve-expense'
  | 'history'
  | 'members'
  | 'contribute';

export type ProposalStatus = 'pending' | 'approved' | 'blocked';

export type Member = {
  id: string;
  name: string;
  role: string;
  pubkey?: string;
};

export type UserRole = 'Membro' | 'Gestor' | 'Aprovador';

export type User = {
  name: string;
  email: string;
  role: UserRole;
};

export type Proposal = {
  id: string;
  title: string;
  description: string;
  amount: number;
  createdBy: string;
  approvals: string[];
  rejectedBy: string[];
  threshold: number;
  totalApprovers: number;
};

export type Movement = {
  id: string;
  title: string;
  value: number;
  detail: string;
  type: 'income' | 'expense';
};
