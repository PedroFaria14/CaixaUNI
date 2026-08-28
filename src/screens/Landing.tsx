import { Check, Landmark, Lock, QrCode, ShieldCheck, Sparkles, Users, X } from 'lucide-react';

type LandingProps = {
  onLogin: () => void;
  onRegister: () => void;
  onDashboard: () => void;
};

function Landing({ onLogin, onRegister, onDashboard }: LandingProps) {
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

export default Landing;
