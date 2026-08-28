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

type Screen =
  | 'landing'
  | 'login'
  | 'create-organization'
  | 'dashboard'
  | 'treasury'
  | 'new-expense'
  | 'approve-expense'
  | 'history'
  | 'members'
  | 'contribute';

type ProposalStatus = 'pending' | 'approved' | 'blocked';

type Member = {
  name: string;
  role: string;
  approved: boolean;
};

type Proposal = {
  title: string;
  description: string;
  amount: number;
  approvals: number;
  threshold: number;
  totalApprovers: number;
  status: ProposalStatus;
};

const screens: { id: Screen; label: string }[] = [
  { id: 'landing', label: 'Landing' },
  { id: 'login', label: 'Login' },
  { id: 'create-organization', label: 'Criar organização' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'treasury', label: 'Tesouraria' },
  { id: 'new-expense', label: 'Criar despesa' },
  { id: 'approve-expense', label: 'Aprovar despesa' },
  { id: 'history', label: 'Histórico' },
  { id: 'members', label: 'Membros' },
  { id: 'contribute', label: 'Contribuir' },
];

const members: Member[] = [
  { name: 'Ana', role: 'Aprovadora', approved: true },
  { name: 'Pedro', role: 'Gestor', approved: true },
  { name: 'João', role: 'Membro', approved: false },
  { name: 'Maria', role: 'Aprovadora', approved: true },
  { name: 'Lucas', role: 'Membro', approved: false },
];

const proposals: Proposal[] = [
  {
    title: 'Buffet ABC',
    description: 'Entrada de 30% para reserva da data.',
    amount: 12000,
    approvals: 3,
    threshold: 3,
    totalApprovers: 5,
    status: 'approved',
  },
  {
    title: 'Fotografia',
    description: 'Contrato de cobertura do evento principal.',
    amount: 4800,
    approvals: 3,
    threshold: 3,
    totalApprovers: 5,
    status: 'approved',
  },
  {
    title: 'Decoração',
    description: 'Sinalização e ambientação do salão.',
    amount: 6200,
    approvals: 1,
    threshold: 3,
    totalApprovers: 5,
    status: 'blocked',
  },
];

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function App() {
  const currentScreen = (window.location.hash.replace('#', '') || 'landing') as Screen;

  const navigate = (screen: Screen) => {
    window.location.hash = screen;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <div className="brand-mark" onClick={() => navigate('landing')} role="button" tabIndex={0}>
          <div className="brand-icon">CU</div>
          <div>
            <strong>CaixaUni</strong>
            <span>Decisões coletivas</span>
          </div>
        </div>

        <nav className="nav-list">
          {screens.map((screen) => (
            <button
              key={screen.id}
              className={currentScreen === screen.id ? 'active' : ''}
              onClick={() => navigate(screen.id)}
            >
              {screen.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <div className="brand-mark compact">
            <div className="brand-icon">CU</div>
            <strong>CaixaUni</strong>
          </div>
          <Menu size={22} />
        </header>

        {currentScreen === 'landing' && <Landing onStart={() => navigate('login')} />}
        {currentScreen === 'login' && <Login onLogin={() => navigate('create-organization')} />}
        {currentScreen === 'create-organization' && <CreateOrganization onDone={() => navigate('dashboard')} />}
        {currentScreen === 'dashboard' && <Dashboard onNewExpense={() => navigate('new-expense')} />}
        {currentScreen === 'treasury' && <Treasury onApprove={() => navigate('approve-expense')} />}
        {currentScreen === 'new-expense' && <NewExpense onCreate={() => navigate('approve-expense')} />}
        {currentScreen === 'approve-expense' && <ApproveExpense />}
        {currentScreen === 'history' && <History />}
        {currentScreen === 'members' && <Members />}
        {currentScreen === 'contribute' && <Contribute />}
      </main>
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
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
          <button className="primary-action" onClick={onStart}>Começar demo</button>
          <button className="secondary-action" onClick={() => (window.location.hash = 'dashboard')}>Ver dashboard</button>
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

function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <section className="center-page page-enter">
      <div className="auth-card">
        <span className="eyebrow">Acesso do protótipo</span>
        <h2>Entrar no CaixaUni</h2>
        <p>Use a jornada fake para demonstrar uma experiência Web3 invisível.</p>
        <label>
          E-mail
          <input defaultValue="ana@formatura2027.com" type="email" />
        </label>
        <label>
          Senha
          <input defaultValue="caixauni-demo" type="password" />
        </label>
        <button className="primary-action full" onClick={onLogin}>Entrar</button>
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
          <div className="member-dots">{members.map((member) => <span key={member.name}>{member.name}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

function Dashboard({ onNewExpense }: { onNewExpense: () => void }) {
  return (
    <section className="content-stack page-enter">
      <div className="topline">
        <PageTitle eyebrow="Formatura Computação 2027" title="Dashboard financeiro" description="Resumo visual para membros acompanharem saldo, meta e movimentações." />
        <button className="primary-action" onClick={onNewExpense}><Plus size={18} /> Nova despesa</button>
      </div>
      <div className="metrics-grid">
        <Metric label="Saldo" value="R$ 184.350" icon={<Banknote />} tone="green" />
        <Metric label="Meta" value="R$ 250.000" icon={<Landmark />} tone="blue" />
        <Metric label="Recebido" value="R$ 221.500" icon={<ArrowUpRight />} tone="green" />
        <Metric label="Gasto" value="R$ 37.150" icon={<ArrowDownRight />} tone="orange" />
      </div>
      <div className="panel progress-panel">
        <div className="progress-header"><strong>Progresso da meta</strong><span>74%</span></div>
        <div className="progress-track"><div style={{ width: '74%' }} /></div>
      </div>
      <MovementList />
    </section>
  );
}

function Treasury({ onApprove }: { onApprove: () => void }) {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Tesouraria" title="Solicitações de movimentação" description="Acompanhe despesas aprovadas, pendentes e bloqueadas pela regra coletiva." />
      <div className="proposal-grid">
        {proposals.map((proposal) => <ProposalCard key={proposal.title} proposal={proposal} onApprove={onApprove} />)}
      </div>
    </section>
  );
}

function NewExpense({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Nova solicitação" title="Criar despesa" description="O gestor solicita a despesa, mas a movimentação só acontece após o threshold de aprovações." />
      <div className="panel form-panel wide">
        <label>Fornecedor<input defaultValue="Buffet ABC" /></label>
        <label>Valor<input defaultValue="12000" /></label>
        <label>Justificativa<textarea defaultValue="Entrada de 30% para reserva da data do evento." /></label>
        <div className="info-box"><ShieldCheck size={18} /> Esta solicitação será enviada para aprovação 3 de 5 via Squads.</div>
        <button className="primary-action" onClick={onCreate}>Criar solicitação</button>
      </div>
    </section>
  );
}

function ApproveExpense() {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Aprovação coletiva" title="Buffet ABC — R$ 12.000" description="Para o usuário, é uma aprovação simples. Por trás, a regra multisig participa da movimentação." />
      <div className="approval-layout">
        <div className="panel approval-card">
          <span className="status-pill approved"><Check size={15} /> 3/5 aprovado</span>
          <h3>Entrada de 30% para reserva.</h3>
          <p>Solicitação criada por Pedro para reservar o buffet do evento principal da formatura.</p>
          <div className="approval-actions">
            <button className="primary-action"><Check size={18} /> Aprovar</button>
            <button className="secondary-action"><X size={18} /> Rejeitar</button>
          </div>
        </div>
        <div className="panel">
          <h3>Responsáveis</h3>
          <div className="approver-list">
            {members.map((member) => (
              <div className="approver" key={member.name}>
                <div><strong>{member.name}</strong><span>{member.role}</span></div>
                {member.approved ? <span className="approval-ok"><Check size={15} /> Aprovou</span> : <span className="approval-wait"><Clock3 size={15} /> Pendente</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function History() {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Histórico verificável" title="Movimentações" description="Registro claro do que foi solicitado, aprovado e movimentado." />
      <MovementList />
    </section>
  );
}

function Members() {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Governança" title="Membros e papéis" description="Uma pessoa pode consultar, criar solicitações ou aprovar, conforme seu papel." />
      <div className="member-grid">
        {members.map((member) => (
          <div className="panel member-card" key={member.name}>
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

function MovementList() {
  return (
    <div className="panel">
      <div className="section-header"><h3>Últimas movimentações</h3><span>Demo mockada</span></div>
      <div className="movement-list">
        <Movement title="Buffet" value="- R$ 12.000" detail="✓ 3/5 aprovações" />
        <Movement title="Fotografia" value="- R$ 4.800" detail="✓ 3/5 aprovações" />
        <Movement title="Mensalidades" value="+ R$ 7.500" detail="Solana Pay" positive />
      </div>
    </div>
  );
}

function Movement({ title, value, detail, positive = false }: { title: string; value: string; detail: string; positive?: boolean }) {
  return (
    <div className="movement-item">
      <div><strong>{title}</strong><span>{detail}</span></div>
      <b className={positive ? 'positive' : 'negative'}>{value}</b>
    </div>
  );
}

function ProposalCard({ proposal, onApprove }: { proposal: Proposal; onApprove: () => void }) {
  const approved = proposal.status === 'approved';
  return (
    <div className="panel proposal-card">
      <span className={`status-pill ${approved ? 'approved' : proposal.status}`}>{approved ? <Check size={15} /> : <Lock size={15} />} {proposal.approvals}/{proposal.threshold} aprovações</span>
      <h3>{proposal.title}</h3>
      <p>{proposal.description}</p>
      <strong className="proposal-amount">{money.format(proposal.amount)}</strong>
      <div className="progress-track compact"><div style={{ width: `${(proposal.approvals / proposal.threshold) * 100}%` }} /></div>
      <button className="secondary-action full" onClick={onApprove}>Ver aprovação</button>
    </div>
  );
}

export default App;
