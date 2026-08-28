import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Check,
  Clock3,
  CopyCheck,
  Landmark,
  Lock,
  Menu,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { initialMovements, initialProposals, members, screens } from './data/mockData';
import type { Movement, Proposal, ProposalStatus, Screen, User } from './types';

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function getProposalStatus(proposal: Proposal): ProposalStatus {
  if (proposal.approvals.length >= proposal.threshold) return 'approved';
  return proposal.rejectedBy.length > 0 ? 'blocked' : 'pending';
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedProposalId, setSelectedProposalId] = useState('buffet-abc');
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const selectedProposal = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0];

  const stats = useMemo(() => {
    const received = 221500 + movements.filter((movement) => movement.type === 'income').reduce((sum, movement) => sum + movement.value, 0);
    const spent = movements.filter((movement) => movement.type === 'expense').reduce((sum, movement) => sum + movement.value, 37150);
    const balance = received - spent;
    const target = 250000;

    return {
      received,
      spent,
      balance,
      target,
      progress: Math.min(Math.round((received / target) * 100), 100),
    };
  }, [movements]);

  const navigate = (screen: Screen) => {
    window.location.hash = screen;
    setCurrentScreen(screen);
  };

  const openProposal = (proposalId: string) => {
    setSelectedProposalId(proposalId);
    navigate('approve-expense');
  };

  const loginUser = () => {
    setCurrentUser({ name: 'Ana Martins', email: 'ana@formatura2027.com', role: 'Aprovador' });
    navigate('create-organization');
  };

  const registerUser = (user: User) => {
    setCurrentUser(user);
    navigate('create-organization');
  };

  const createProposal = (proposal: Pick<Proposal, 'title' | 'amount' | 'description'>) => {
    const id = `${proposal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const nextProposal: Proposal = {
      ...proposal,
      id,
      createdBy: 'Pedro',
      approvals: [],
      rejectedBy: [],
      threshold: 3,
      totalApprovers: members.length,
    };

    setProposals((current) => [nextProposal, ...current]);
    setSelectedProposalId(id);
    navigate('approve-expense');
  };

  const approveProposal = (proposalId: string, memberId: string) => {
    const currentProposal = proposals.find((proposal) => proposal.id === proposalId);
    if (!currentProposal || currentProposal.approvals.includes(memberId)) return;

    const approvals = [...currentProposal.approvals, memberId];
    const wasApproved = currentProposal.approvals.length >= currentProposal.threshold;
    const becomesApproved = approvals.length >= currentProposal.threshold;

    setProposals((current) =>
      current.map((proposal) =>
        proposal.id === proposalId
          ? {
              ...proposal,
              approvals,
              rejectedBy: proposal.rejectedBy.filter((id) => id !== memberId),
            }
          : proposal,
      ),
    );

    if (!wasApproved && becomesApproved) {
      setMovements((movementsList) => [
        {
          id: `movement-${currentProposal.id}`,
          title: currentProposal.title,
          value: currentProposal.amount,
          detail: `✓ ${approvals.length}/${currentProposal.totalApprovers} aprovações`,
          type: 'expense',
        },
        ...movementsList,
      ]);
    }
  };

  const rejectProposal = (proposalId: string, memberId: string) => {
    setProposals((current) =>
      current.map((proposal) =>
        proposal.id === proposalId && !proposal.rejectedBy.includes(memberId)
          ? {
              ...proposal,
              rejectedBy: [...proposal.rejectedBy, memberId],
              approvals: proposal.approvals.filter((id) => id !== memberId),
            }
          : proposal,
      ),
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <button className="brand-mark brand-button" onClick={() => navigate('landing')}>
          <div className="brand-icon">CU</div>
          <div>
            <strong>CaixaUni</strong>
            <span>Decisões coletivas</span>
          </div>
        </button>

        <nav className="nav-list">
          {screens.map((screen) => (
            <button key={screen.id} className={currentScreen === screen.id ? 'active' : ''} onClick={() => navigate(screen.id)}>
              {screen.label}
            </button>
          ))}
        </nav>

        {currentUser && (
          <div className="current-user">
            <span>Usuário da demo</span>
            <strong>{currentUser.name}</strong>
            <small>{currentUser.role}</small>
          </div>
        )}
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <div className="brand-mark compact">
            <div className="brand-icon">CU</div>
            <strong>CaixaUni</strong>
          </div>
          <Menu size={22} />
        </header>

        {currentScreen === 'landing' && <Landing onLogin={() => navigate('login')} onRegister={() => navigate('register')} onDashboard={() => navigate('dashboard')} />}
        {currentScreen === 'login' && <Login onLogin={loginUser} onRegister={() => navigate('register')} />}
        {currentScreen === 'register' && <Register onRegister={registerUser} onLogin={() => navigate('login')} />}
        {currentScreen === 'create-organization' && <CreateOrganization onDone={() => navigate('dashboard')} />}
        {currentScreen === 'dashboard' && <Dashboard stats={stats} movements={movements} onNewExpense={() => navigate('new-expense')} />}
        {currentScreen === 'treasury' && <Treasury proposals={proposals} onApprove={openProposal} />}
        {currentScreen === 'new-expense' && <NewExpense onCreate={createProposal} />}
        {currentScreen === 'approve-expense' && selectedProposal && (
          <ApproveExpense proposal={selectedProposal} onApprove={approveProposal} onReject={rejectProposal} />
        )}
        {currentScreen === 'history' && <History movements={movements} />}
        {currentScreen === 'members' && <Members />}
        {currentScreen === 'contribute' && <Contribute />}
      </main>
    </div>
  );
}

function Landing({ onLogin, onRegister, onDashboard }: { onLogin: () => void; onRegister: () => void; onDashboard: () => void }) {
  return (
    <section className="hero-grid page-enter">
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={16} /> Hackathon Solana • MVP</span>
        <h1>Dinheiro coletivo. Decisões coletivas.</h1>
        <p>
          Uma plataforma de tesouraria compartilhada para comissões de formatura e atléticas universitárias,
          onde movimentações importantes exigem múltiplas aprovações antes de acontecer.
        </p>
        <div className="hero-actions">
          <button className="primary-action" onClick={onRegister}>Criar conta</button>
          <button className="secondary-action" onClick={onLogin}>Entrar</button>
          <button className="secondary-action" onClick={onDashboard}>Ver dashboard</button>
        </div>
        <div className="trust-row" aria-label="Principais diferenciais">
          <span><ShieldCheck size={16} /> Regra 3 de 5</span>
          <span><Landmark size={16} /> Squads multisig</span>
          <span><QrCode size={16} /> Solana Pay</span>
        </div>
      </div>

      <div className="hero-card">
        <div className="case-strip">
          <span>Risco estrutural</span>
          <strong>Dinheiro de muitos + controle de poucos</strong>
        </div>
        <div className="flow-card">
          <div className="flow-step danger"><Lock size={18} /> Tesoureiro sozinho</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step danger muted">1/3 aprovações</div>
          <div className="blocked-label"><X size={16} /> Bloqueado</div>
        </div>
        <div className="flow-card success-flow">
          <div className="flow-step"><Users size={18} /> 5 responsáveis</div>
          <div className="flow-arrow">↓</div>
          <div className="flow-step">3 aprovações</div>
          <div className="approved-label"><Check size={16} /> Autorizado</div>
        </div>
      </div>
    </section>
  );
}

function Login({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <section className="center-page page-enter">
      <div className="auth-card">
        <span className="eyebrow">Acesso do protótipo</span>
        <h2>Entrar no CaixaUni</h2>
        <p>Use a jornada fake para demonstrar uma experiência Web3 invisível.</p>
        <label>E-mail<input defaultValue="ana@formatura2027.com" type="email" /></label>
        <label>Senha<input defaultValue="caixauni-demo" type="password" /></label>
        <button className="primary-action full" onClick={onLogin}>Entrar</button>
        <button className="text-action" onClick={onRegister}>Ainda não tenho conta. Criar cadastro</button>
      </div>
    </section>
  );
}

function Register({ onRegister, onLogin }: { onRegister: (user: User) => void; onLogin: () => void }) {
  const [name, setName] = useState('Pedro Almeida');
  const [email, setEmail] = useState('pedro@formatura2027.com');
  const [role, setRole] = useState<User['role']>('Gestor');

  const submitRegistration = () => {
    onRegister({ name, email, role });
  };

  return (
    <section className="center-page page-enter">
      <div className="auth-card register-card">
        <span className="eyebrow">Primeiro acesso</span>
        <h2>Criar conta</h2>
        <p>Cadastre um usuário da organização. Nesta etapa, tudo continua mockado para a demo.</p>
        <label>Nome<input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label>E-mail<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" /></label>
        <label>Senha<input defaultValue="caixauni-demo" type="password" /></label>
        <label>
          Papel inicial
          <select value={role} onChange={(event) => setRole(event.target.value as User['role'])}>
            <option value="Membro">Membro</option>
            <option value="Gestor">Gestor</option>
            <option value="Aprovador">Aprovador</option>
          </select>
        </label>
        <div className="info-box"><Users size={18} /> O papel define se a pessoa consulta, cria solicitações ou aprova despesas.</div>
        <button className="primary-action full" onClick={submitRegistration}>Criar conta</button>
        <button className="text-action" onClick={onLogin}>Já tenho conta. Entrar</button>
      </div>
    </section>
  );
}

function CreateOrganization({ onDone }: { onDone: () => void }) {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Configuração inicial" title="Criar organização" description="Defina a tesouraria e a regra coletiva que será usada na demonstração." />
      <div className="two-column">
        <div className="panel form-panel">
          <label>Nome da organização<input defaultValue="Formatura Computação 2027" /></label>
          <label>Tipo<select defaultValue="formatura"><option value="formatura">Comissão de formatura</option><option value="atletica">Atlética universitária</option></select></label>
          <label>Meta financeira<input defaultValue="250000" /></label>
          <button className="primary-action" onClick={onDone}>Criar organização</button>
        </div>
        <div className="panel rule-panel">
          <h3>Regra de aprovação</h3>
          <div className="threshold-big">3 de 5</div>
          <p>Qualquer movimentação relevante só é autorizada quando pelo menos três responsáveis aprovam.</p>
          <div className="member-dots">{members.map((member) => <span key={member.id}>{member.name}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

function Dashboard({ stats, movements, onNewExpense }: { stats: { received: number; spent: number; balance: number; target: number; progress: number }; movements: Movement[]; onNewExpense: () => void }) {
  return (
    <section className="content-stack page-enter">
      <div className="topline">
        <PageTitle eyebrow="Formatura Computação 2027" title="Dashboard financeiro" description="Resumo visual para membros acompanharem saldo, meta e movimentações." />
        <button className="primary-action" onClick={onNewExpense}><Plus size={18} /> Nova despesa</button>
      </div>
      <div className="metrics-grid">
        <Metric label="Saldo" value={money.format(stats.balance)} icon={<Banknote />} tone="green" />
        <Metric label="Meta" value={money.format(stats.target)} icon={<Landmark />} tone="blue" />
        <Metric label="Recebido" value={money.format(stats.received)} icon={<ArrowUpRight />} tone="green" />
        <Metric label="Gasto" value={money.format(stats.spent)} icon={<ArrowDownRight />} tone="orange" />
      </div>
      <div className="panel progress-panel">
        <div className="progress-header"><strong>Progresso da meta</strong><span>{stats.progress}%</span></div>
        <div className="progress-track"><div style={{ width: `${stats.progress}%` }} /></div>
      </div>
      <MovementList movements={movements} label="Atualizado pelo fluxo de aprovação" />
    </section>
  );
}

function Treasury({ proposals, onApprove }: { proposals: Proposal[]; onApprove: (proposalId: string) => void }) {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Tesouraria" title="Solicitações de movimentação" description="Acompanhe despesas aprovadas, pendentes e bloqueadas pela regra coletiva." />
      <div className="proposal-grid">
        {proposals.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} onApprove={() => onApprove(proposal.id)} />)}
      </div>
    </section>
  );
}

function NewExpense({ onCreate }: { onCreate: (proposal: Pick<Proposal, 'title' | 'amount' | 'description'>) => void }) {
  const [title, setTitle] = useState('Buffet ABC');
  const [amount, setAmount] = useState('12000');
  const [description, setDescription] = useState('Entrada de 30% para reserva da data do evento.');

  const submitProposal = () => {
    onCreate({ title, amount: Number(amount), description });
  };

  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Nova solicitação" title="Criar despesa" description="O gestor solicita a despesa, mas a movimentação só acontece após o threshold de aprovações." />
      <div className="panel form-panel wide">
        <label>Fornecedor<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label>Valor<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" /></label>
        <label>Justificativa<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <div className="info-box"><ShieldCheck size={18} /> Esta solicitação será enviada para aprovação 3 de 5 via Squads.</div>
        <button className="primary-action" onClick={submitProposal}>Criar solicitação</button>
      </div>
    </section>
  );
}

function ApproveExpense({ proposal, onApprove, onReject }: { proposal: Proposal; onApprove: (proposalId: string, memberId: string) => void; onReject: (proposalId: string, memberId: string) => void }) {
  const status = getProposalStatus(proposal);
  const statusLabel = status === 'approved' ? 'Autorizada' : status === 'blocked' ? 'Bloqueada' : 'Aguardando aprovações';

  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Aprovação coletiva" title={`${proposal.title} — ${money.format(proposal.amount)}`} description="Para o usuário, é uma aprovação simples. Por trás, a regra multisig participa da movimentação." />
      <div className="approval-layout">
        <div className="panel approval-card">
          <span className={`status-pill ${status}`}>
            {status === 'approved' ? <Check size={15} /> : <Lock size={15} />} {proposal.approvals.length}/{proposal.threshold} • {statusLabel}
          </span>
          <h3>{proposal.description}</h3>
          <p>Solicitação criada por {proposal.createdBy}. A movimentação só entra no histórico financeiro quando atingir 3 aprovações.</p>
          <div className="progress-track"><div style={{ width: `${Math.min((proposal.approvals.length / proposal.threshold) * 100, 100)}%` }} /></div>
          <div className={status === 'approved' ? 'approved-label' : 'blocked-label'}>
            {status === 'approved' ? <Check size={16} /> : <Clock3 size={16} />} {status === 'approved' ? 'Movimentação autorizada' : 'Movimentação ainda bloqueada'}
          </div>
        </div>
        <div className="panel">
          <h3>Responsáveis</h3>
          <div className="approver-list">
            {members.map((member) => {
              const approved = proposal.approvals.includes(member.id);
              const rejected = proposal.rejectedBy.includes(member.id);

              return (
                <div className="approver approver-action" key={member.id}>
                  <div><strong>{member.name}</strong><span>{member.role}</span></div>
                  <div className="mini-actions">
                    <button className="approve-mini" disabled={approved || status === 'approved'} onClick={() => onApprove(proposal.id, member.id)}>
                      {approved ? <><Check size={15} /> Aprovou</> : <><Check size={15} /> Aprovar</>}
                    </button>
                    <button className="reject-mini" disabled={rejected || status === 'approved'} onClick={() => onReject(proposal.id, member.id)}>
                      {rejected ? <><X size={15} /> Rejeitou</> : <><X size={15} /> Rejeitar</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function History({ movements }: { movements: Movement[] }) {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Histórico verificável" title="Movimentações" description="Registro claro do que foi solicitado, aprovado e movimentado." />
      <MovementList movements={movements} label="Entradas e despesas autorizadas" />
    </section>
  );
}

function Members() {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Governança" title="Membros e papéis" description="Uma pessoa pode consultar, criar solicitações ou aprovar, conforme seu papel." />
      <div className="member-grid">
        {members.map((member) => (
          <div className="panel member-card" key={member.id}>
            <div className="avatar">{member.name[0]}</div>
            <h3>{member.name}</h3>
            <span>{member.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contribute() {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Solana Pay" title="Contribuir para a tesouraria" description="Arrecadação complementar por QR Code para mensalidades, eventos e campanhas." />
      <div className="contribute-layout">
        <div className="panel qr-panel">
          <div className="fake-qr"><QrCode size={128} /></div>
          <strong>Mensalidade Agosto</strong>
          <span>R$ 250,00</span>
          <button className="primary-action full"><CopyCheck size={18} /> Copiar link de pagamento</button>
        </div>
        <div className="panel">
          <h3>Experiência Web3 invisível</h3>
          <p>O membro paga como em um aplicativo financeiro comum. O CaixaUni apresenta o QR Code e registra a entrada na tesouraria.</p>
          <div className="info-box"><QrCode size={18} /> Solana Pay é complementar. A regra central do MVP continua sendo Squads multisig.</div>
        </div>
      </div>
    </section>
  );
}

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Metric({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: string }) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MovementList({ movements, label }: { movements: Movement[]; label: string }) {
  return (
    <div className="panel">
      <div className="section-header"><h3>Últimas movimentações</h3><span>{label}</span></div>
      <div className="movement-list">
        {movements.map((movement) => <MovementRow key={movement.id} movement={movement} />)}
      </div>
    </div>
  );
}

function MovementRow({ movement }: { movement: Movement }) {
  const positive = movement.type === 'income';
  return (
    <div className="movement-item">
      <div><strong>{movement.title}</strong><span>{movement.detail}</span></div>
      <b className={positive ? 'positive' : 'negative'}>{positive ? '+' : '-'} {money.format(movement.value)}</b>
    </div>
  );
}

function ProposalCard({ proposal, onApprove }: { proposal: Proposal; onApprove: () => void }) {
  const status = getProposalStatus(proposal);
  return (
    <div className="panel proposal-card">
      <span className={`status-pill ${status}`}>
        {status === 'approved' ? <Check size={15} /> : <Lock size={15} />} {proposal.approvals.length}/{proposal.threshold} aprovações
      </span>
      <h3>{proposal.title}</h3>
      <p>{proposal.description}</p>
      <strong className="proposal-amount">{money.format(proposal.amount)}</strong>
      <div className="progress-track compact"><div style={{ width: `${Math.min((proposal.approvals.length / proposal.threshold) * 100, 100)}%` }} /></div>
      <button className="secondary-action full" onClick={onApprove}>Ver aprovação</button>
    </div>
  );
}

export default App;
