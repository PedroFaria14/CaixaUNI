import { useEffect, useMemo, useState } from 'react';
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
import LogoMark from './components/LogoMark';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import type { Movement, Proposal, Screen, User } from './types';

const publicScreens: Screen[] = ['landing', 'login', 'register'];

function App() {
  const [currentScreen, setCurrentScreen] = useLocalStorage<Screen>('caixauni_currentScreen', 'landing');
  const [selectedProposalId, setSelectedProposalId] = useLocalStorage('caixauni_selectedProposalId', 'buffet-abc');
  const [proposals, setProposals] = useLocalStorage<Proposal[]>('caixauni_proposals', initialProposals);
  const [movements, setMovements] = useLocalStorage<Movement[]>('caixauni_movements', initialMovements);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('caixauni_currentUser', null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const selectedProposal = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0];
  const canAccessCurrentScreen = currentUser || publicScreens.includes(currentScreen);
  const visibleScreen = canAccessCurrentScreen ? currentScreen : 'login';
  const visibleScreens = currentUser ? screens : screens.filter((screen) => publicScreens.includes(screen.id));

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

  useEffect(() => {
    if (!currentUser && !publicScreens.includes(currentScreen)) {
      window.location.hash = 'login';
      setCurrentScreen('login');
    }
  }, [currentScreen, currentUser, setCurrentScreen]);

  const openScreen = (screen: Screen) => {
    window.location.hash = screen;
    setCurrentScreen(screen);
  };

  const navigate = (screen: Screen) => {
    const nextScreen = currentUser || publicScreens.includes(screen) ? screen : 'login';
    openScreen(nextScreen);
  };

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 3200);
  };

  const openProposal = (proposalId: string) => {
    setSelectedProposalId(proposalId);
    navigate('approve-expense');
  };

  const loginUser = () => {
    setCurrentUser({ name: 'Ana Martins', email: 'ana@formatura2027.com', role: 'Aprovador' });
    showFeedback('Modo demo iniciado com usuário aprovador.');
    openScreen('create-organization');
  };

  const registerUser = (user: User) => {
    setCurrentUser(user);
    showFeedback(`Conta demo criada para ${user.name}.`);
    openScreen('create-organization');
  };

  const resetDemo = () => {
    setProposals(initialProposals);
    setMovements(initialMovements);
    setCurrentUser(null);
    setSelectedProposalId('buffet-abc');
    
    // Limpar estados do Squads do localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('caixauni_squads')) {
        localStorage.removeItem(key);
      }
    });

    navigate('landing');
    window.location.reload();
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
    showFeedback('Solicitação criada e enviada para aprovação coletiva.');
    navigate('approve-expense');
  };

  const approveProposal = (proposalId: string, memberId: string) => {
    const currentProposal = proposals.find((proposal) => proposal.id === proposalId);
    if (!currentProposal || currentProposal.approvals.length >= currentProposal.threshold || currentProposal.approvals.includes(memberId)) return;

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
      showFeedback('Threshold atingido: despesa autorizada e lançada no histórico.');
      setMovements((movementsList) => [
        ...(movementsList.some((movement) => movement.id === `movement-${currentProposal.id}`)
          ? []
          : [
              {
                id: `movement-${currentProposal.id}`,
                title: currentProposal.title,
                value: currentProposal.amount,
                detail: `✓ ${approvals.length}/${currentProposal.totalApprovers} aprovações`,
                type: 'expense' as const,
              },
            ]),
        ...movementsList,
      ]);
      return;
    }

    showFeedback(`Aprovação registrada: ${approvals.length}/${currentProposal.threshold}.`);
  };

  const rejectProposal = (proposalId: string, memberId: string) => {
    setProposals((current) =>
      current.map((proposal) =>
        proposal.id === proposalId && proposal.approvals.length < proposal.threshold && !proposal.rejectedBy.includes(memberId)
          ? {
              ...proposal,
              rejectedBy: [...proposal.rejectedBy, memberId],
              approvals: proposal.approvals.filter((id) => id !== memberId),
            }
          : proposal,
      ),
    );
    showFeedback('Rejeição registrada na solicitação.');
  };

  return (
    <div className="app-shell">
        <button className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} aria-label="Fechar menu de navegação" />
      
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Navegação principal">
        <button className="brand-mark brand-button" onClick={() => { navigate('landing'); setIsMobileMenuOpen(false); }}>
          <LogoMark />
          <div>
            <strong>CaixaUni</strong>
            <span>Decisões coletivas</span>
          </div>
        </button>

        <nav className="nav-list">
          <div className="demo-control-label">
            <strong>Controle da Demo</strong>
            <span>Atalhos para o pitch do hackathon</span>
          </div>
          {visibleScreens.map((screen) => (
            <button key={screen.id} className={visibleScreen === screen.id ? 'active' : ''} onClick={() => { navigate(screen.id); setIsMobileMenuOpen(false); }}>
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
        
        <div className="wallet-sidebar-action">
          <WalletMultiButton />
        </div>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <div className="brand-mark compact">
            <LogoMark compact />
            <strong>CaixaUni</strong>
          </div>
          <button
            className="mobile-menu-toggle"
            aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {visibleScreen === 'landing' && <Landing onLogin={() => navigate('login')} onRegister={() => navigate('register')} />}
        {visibleScreen === 'login' && <Login onLogin={loginUser} onRegister={() => navigate('register')} />}
        {visibleScreen === 'register' && <Register onRegister={registerUser} onLogin={() => navigate('login')} />}
        {visibleScreen === 'create-organization' && <CreateOrganization onDone={() => { showFeedback('Organização demo criada com regra 3 de 5.'); navigate('dashboard'); }} />}
        {visibleScreen === 'dashboard' && <Dashboard stats={stats} movements={movements} onNewExpense={() => navigate('new-expense')} />}
        {visibleScreen === 'treasury' && <Treasury proposals={proposals} onApprove={openProposal} />}
        {visibleScreen === 'new-expense' && <NewExpense onCreate={createProposal} />}
        {visibleScreen === 'approve-expense' && selectedProposal && <ApproveExpense proposal={selectedProposal} onApprove={approveProposal} onReject={rejectProposal} />}
        {visibleScreen === 'history' && <History movements={movements} />}
        {visibleScreen === 'members' && <Members />}
        {visibleScreen === 'contribute' && <Contribute />}
      </main>

      {feedback && <div className="toast-feedback" role="status" aria-live="polite">{feedback}</div>}
      <DemoGuide currentScreen={visibleScreen} onNavigate={navigate} onReset={resetDemo} />
    </div>
  );
}

export default App;
