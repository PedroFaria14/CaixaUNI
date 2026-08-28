import { Check, Landmark, Lock, QrCode, ShieldCheck, Sparkles, Users, X } from 'lucide-react';

type LandingProps = {
  onLogin: () => void;
  onRegister: () => void;
  onDashboard: () => void;
};

function Landing({ onLogin, onRegister, onDashboard }: LandingProps) {
  return (
    <div className="landing-page page-enter">
      <section className="hero-grid">
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

      <section className="evidence-section">
        <div className="evidence-header">
          <h2>Por que construímos o CaixaUni?</h2>
          <p>O risco de controle individual sobre recursos coletivos não é hipotético.</p>
        </div>
        <div className="evidence-grid">
          <div className="evidence-card">
            <div className="evidence-tag">Medicina USP</div>
            <h3>≈ R$ 927 mil</h3>
            <p>Fundo de formatura</p>
            <span className="evidence-vuln">Vulnerabilidade: possibilidade de movimentação sem aprovação coletiva</span>
          </div>
          <div className="evidence-card">
            <div className="evidence-tag">Direito — SC</div>
            <h3>≈ R$ 77 mil</h3>
            <p>Fundo de formatura</p>
            <span className="evidence-vuln">Vulnerabilidade: recursos coletivos concentrados individualmente</span>
          </div>
        </div>
        <div className="evidence-conclusion">
          <strong>O padrão estrutural:</strong> Dinheiro de muitas pessoas + Controle operacional de poucas pessoas.
        </div>
      </section>

      <section className="architecture-section">
        <h2>Experiência Web3 Invisível</h2>
        <p>A regra da tesouraria passa a existir na infraestrutura financeira, não apenas no regulamento.</p>
        
        <div className="architecture-mock">
          <div className="arch-layer app-layer">
            <strong>CaixaUni</strong>
            <span>Interface / App</span>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer web3-layer">
            <strong>Squads</strong>
            <span>Multisig (Regra: 3 de 5)</span>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer solana-layer">
            <strong>Solana</strong>
            <span>Liquidação</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
