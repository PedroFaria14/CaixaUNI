import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { initialMovements, initialProposals, members, screens } from './data/mockData';
import ApproveExpense from './screens/ApproveExpense';
import Contribute from './screens/Contribute';
import CreateOrganization from './screens/CreateOrganization';
import Dashboard from './screens/Dashboard';
import History from './screens/History';
import Landing from './screens/Landing';
import Login from './screens/Login';
import Members from './screens/Members';
import NewExpense from './screens/NewExpense';
import Register from './screens/Register';
import Treasury from './screens/Treasury';
import DemoGuide from './components/DemoGuide';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import type { Movement, Proposal, Screen, User } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useLocalStorage<Screen>('caixauni_currentScreen', 'landing');
  const [selectedProposalId, setSelectedProposalId] = useLocalStorage('caixauni_selectedProposalId', 'buffet-abc');
  const [proposals, setProposals] = useLocalStorage<Proposal[]>('caixauni_proposals', initialProposals);
  const [movements, setMovements] = useLocalStorage<Movement[]>('caixauni_movements', initialMovements);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('caixauni_currentUser', null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Navegação principal">
        <button className="brand-mark brand-button" onClick={() => { navigate('landing'); setIsMobileMenuOpen(false); }}>
          <div className="brand-icon">CU</div>
          <div>
            <strong>CaixaUni</strong>
            <span>Decisões coletivas</span>
          </div>
        </button>

        <nav className="nav-list">
          {screens.map((screen) => (
            <button key={screen.id} className={currentScreen === screen.id ? 'active' : ''} onClick={() => { navigate(screen.id); setIsMobileMenuOpen(false); }}>
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
        
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <WalletMultiButton style={{ width: '100%', justifyContent: 'center' }} />
        </div>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <div className="brand-mark compact">
            <div className="brand-icon">CU</div>
            <strong>CaixaUni</strong>
          </div>
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {currentScreen === 'landing' && <Landing onLogin={() => navigate('login')} onRegister={() => navigate('register')} onDashboard={() => navigate('dashboard')} />}
        {currentScreen === 'login' && <Login onLogin={loginUser} onRegister={() => navigate('register')} />}
        {currentScreen === 'register' && <Register onRegister={registerUser} onLogin={() => navigate('login')} />}
        {currentScreen === 'create-organization' && <CreateOrganization onDone={() => navigate('dashboard')} />}
        {currentScreen === 'dashboard' && <Dashboard stats={stats} movements={movements} onNewExpense={() => navigate('new-expense')} />}
        {currentScreen === 'treasury' && <Treasury proposals={proposals} onApprove={openProposal} />}
        {currentScreen === 'new-expense' && <NewExpense onCreate={createProposal} />}
        {currentScreen === 'approve-expense' && selectedProposal && <ApproveExpense proposal={selectedProposal} onApprove={approveProposal} onReject={rejectProposal} />}
        {currentScreen === 'history' && <History movements={movements} />}
        {currentScreen === 'members' && <Members />}
        {currentScreen === 'contribute' && <Contribute />}
      </main>

      <DemoGuide currentScreen={currentScreen} onNavigate={navigate} />
    </div>
  );
}

export default App;
