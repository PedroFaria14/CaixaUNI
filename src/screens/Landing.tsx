import { ArrowRight, Check, Landmark, Lock, QrCode, ShieldCheck, Sparkles, Users, WalletCards } from 'lucide-react';
import LogoMark from '../components/LogoMark';

const realCases = [
  {
    caseName: 'Medicina USP',
    year: '2023',
    value: '~R$ 927 mil',
    organization: 'Formatura',
    event: 'Presidente da comissão retirou fundos investidos alegando má administração da corretora.',
    weakness: 'Conta coletiva permitia saques e transferências unilaterais sem anuência dos demais membros.',
    source: 'CNN / G1',
  },
  {
    caseName: 'Direito SC',
    year: '2025',
    value: '~R$ 77 mil',
    organization: 'Formatura',
    event: 'Valores destinados ao evento teriam sido perdidos em plataformas de jogos de azar.',
    weakness: 'Recursos coletivos concentrados em uma conta bancária pessoal da presidente da comissão.',
    source: 'CNN',
  },
  {
    caseName: 'Odontologia UEM',
    year: '2023',
    value: '~R$ 85 mil',
    organization: 'Formatura',
    event: 'Tesoureira transferiu dinheiro da turma para contas próprias e parou de responder colegas.',
    weakness: 'Arrecadação via Pix para conta física de estudante, sem auditoria em tempo real.',
    source: 'G1 PR',
  },
  {
    caseName: 'Medicina UFPR',
    year: '2018',
    value: '~R$ 160 mil',
    organization: 'Atlética',
    event: 'Presidente de associação atlética desviou fundos ao longo de meses para despesas pessoais.',
    weakness: 'Falta de segregação: a mesma pessoa aprovava gastos e controlava o acesso bancário.',
    source: 'RPC / Band',
  },
  {
    caseName: 'Odontologia UFF',
    year: '2019',
    value: '~R$ 90 mil',
    organization: 'Formatura',
    event: 'Aluna responsável pelo caixa sacou valores e confessou uso para problemas pessoais.',
    weakness: 'Ausência de coassinatura para liberação de saques de alto valor.',
    source: 'O Globo',
  },
  {
    caseName: 'Geologia UnB',
    year: '2019',
    value: '~R$ 50 mil',
    organization: 'Formatura',
    event: 'Turma relatou perda de recursos arrecadados para a formatura.',
    weakness: 'Caixa coletivo dependia de controle centralizado e baixa verificabilidade operacional.',
    source: 'Imprensa local',
  },
];

type LandingProps = {
  onLogin: () => void;
  onRegister: () => void;
};

function Landing({ onLogin, onRegister }: LandingProps) {
  return (
    <div className="landing-page page-enter">
      <nav className="home-top-nav" aria-label="Navegação da home">
        <div className="home-nav-brand">
          <LogoMark />
          <div>
            <strong>CaixaUni</strong>
            <span>Dinheiro coletivo. Decisões coletivas.</span>
          </div>
        </div>
        <div className="home-nav-actions">
          <button className="secondary-action" onClick={onLogin}>Entrar</button>
        </div>
      </nav>

      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> CaixaUni • Squads + Solana</span>
          <h1>Caixa coletivo com aprovação de verdade.</h1>
          <p>Organize dinheiro de turma, atlética ou comissão com regra 3/5, wallet e registro on-chain na Devnet.</p>
          <div className="home-proof-row" aria-label="Resumo da proposta">
            <span><ShieldCheck size={16} /> Multisig 3/5</span>
            <span><WalletCards size={16} /> Phantom Devnet</span>
            <span><QrCode size={16} /> Solana Pay ready</span>
          </div>
          <div className="hero-actions">
            <button className="primary-action" onClick={onRegister}>Começar demo <ArrowRight size={17} /></button>
          </div>
        </div>

        <div className="home-visual" aria-label="Ilustração do fluxo CaixaUni">
          <div className="coin-orbit coin-orbit-one" />
          <div className="coin-orbit coin-orbit-two" />
          <div className="collective-safe">
            <div className="safe-handle" />
            <div className="safe-door">
              <div className="safe-mark">CU</div>
              <span>R$ 48.250</span>
            </div>
          </div>

          <div className="floating-card expense-preview">
            <span>Despesa pendente</span>
            <strong>Buffet ABC</strong>
            <small>R$ 12.000</small>
          </div>

          <div className="floating-card approval-preview">
            <div>
              <span>Squads</span>
              <strong>2/3 aprovações</strong>
            </div>
            <div className="approval-dots" aria-hidden="true">
              <i className="done" />
              <i className="done" />
              <i />
            </div>
          </div>

          <div className="floating-card lock-preview">
            <Lock size={17} /> Bloqueado até o threshold
          </div>
        </div>
      </section>

      <section className="control-problem-section" aria-labelledby="control-problem-title">
        <div className="problem-section-heading">
          <span className="eyebrow"><Lock size={16} /> Sobre o problema</span>
          <h2 id="control-problem-title">Dinheiro de muitos, controle de poucos.</h2>
          <p>O risco central não é falta de planilha. É permitir que recursos coletivos dependam da decisão operacional de uma única pessoa.</p>
        </div>

        <div className="control-contrast-grid">
          <div className="control-path old-path">
            <span className="path-label">Antes</span>
            <h3>Dinheiro na mão de um só</h3>
            <div className="path-steps" aria-label="Fluxo tradicional concentrado">
              <span>Alunos depositam</span>
              <i>↓</i>
              <span>1 responsável controla</span>
              <i>↓</i>
              <span>Movimentação acontece</span>
              <i>↓</i>
              <strong>Prestação de contas depois</strong>
            </div>
          </div>

          <div className="control-path new-path">
            <span className="path-label">CaixaUni</span>
            <h3>Decisão 3/5 on-chain</h3>
            <div className="path-steps" aria-label="Fluxo CaixaUni com governança coletiva">
              <span>Despesa é proposta</span>
              <i>↓</i>
              <span>5 responsáveis votam</span>
              <i>↓</i>
              <span>3 aprovações mínimas</span>
              <i>↓</i>
              <strong>Execução só com threshold</strong>
            </div>
          </div>
        </div>

        <div className="evidence-strip" aria-label="Evidências documentais do problema">
          <div className="evidence-mini-card">
            <span>Medicina USP</span>
            <strong>~R$ 927 mil</strong>
            <small>Fundo de formatura em caso público documentado.</small>
          </div>
          <div className="evidence-mini-card">
            <span>Direito SC</span>
            <strong>~R$ 77 mil</strong>
            <small>Recursos de formatura concentrados em uma conta individual.</small>
          </div>
          <div className="problem-thesis-card">
            <ShieldCheck size={20} />
            <strong>Dinheiro coletivo. Decisões coletivas.</strong>
          </div>
        </div>

        <div className="case-dossier" aria-label="Dossiê CaixaUni com casos reais documentados">
          <div className="case-dossier-heading">
            <span className="eyebrow"><Check size={16} /> Dossiê CaixaUni</span>
            <h3>Casos reais mostram o mesmo padrão de risco.</h3>
            <p>O problema não é falta de boa-fé. É dinheiro coletivo ainda depender de uma conta individual, uma senha e uma pessoa autorizando sozinha.</p>
          </div>
          <div className="case-dossier-grid">
            {realCases.map((item) => (
              <article className="case-dossier-card" key={`${item.caseName}-${item.year}`}>
                <div className="case-dossier-topline">
                  <span>{item.organization}</span>
                  <small>{item.year}</small>
                </div>
                <h4>{item.caseName}</h4>
                <strong>{item.value}</strong>
                <p>{item.event}</p>
                <div className="case-weakness">
                  <span>Vulnerabilidade observada</span>
                  <small>{item.weakness}</small>
                </div>
                <em>Fonte: {item.source}</em>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-flow-section" aria-label="Como funciona o CaixaUni">
        <div className="home-flow-card">
          <div className="home-flow-icon"><QrCode size={22} /></div>
          <span>1</span>
          <strong>Arrecade</strong>
          <p>Mensalidades e contribuições entram no caixa da turma.</p>
        </div>
        <div className="home-flow-card featured">
          <div className="home-flow-icon"><Users size={22} /></div>
          <span>2</span>
          <strong>Vote</strong>
          <p>Despesas importantes passam por aprovação coletiva.</p>
        </div>
        <div className="home-flow-card">
          <div className="home-flow-icon"><Landmark size={22} /></div>
          <span>3</span>
          <strong>Execute</strong>
          <p>A Squads registra proposta, voto e status na Solana Devnet.</p>
        </div>
      </section>

      <section className="home-real-section">
        <div>
          <span className="eyebrow"><Check size={16} /> Demo verificável</span>
          <h2>O que é real na demo?</h2>
        </div>
        <div className="real-badges">
          <span>Wallet</span>
          <span>Saldo Devnet</span>
          <span>Multisig</span>
          <span>Proposta</span>
          <span>Aprovação</span>
          <span>Status on-chain</span>
        </div>
      </section>
    </div>
  );
}

export default Landing;
