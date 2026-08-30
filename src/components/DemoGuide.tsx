import { useState } from 'react';
import { Check, ChevronsRight, Minimize2 } from 'lucide-react';
import type { Screen } from '../types';

type DemoStep = {
  screen: Screen;
  title: string;
  description: string;
};

const demoSteps: DemoStep[] = [
  { screen: 'create-organization', title: 'Criar organização', description: 'Define comissão e regra 3 de 5.' },
  { screen: 'new-expense', title: 'Criar despesa', description: 'Gestor solicita movimentação.' },
  { screen: 'approve-expense', title: 'Aprovar', description: 'Responsáveis votam na proposta.' },
  { screen: 'history', title: 'Histórico', description: 'Despesa aprovada aparece no registro.' },
  { screen: 'contribute', title: 'Contribuir', description: 'Solana Pay aparece como complemento.' },
];

type DemoGuideProps = {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
};

function DemoGuide({ currentScreen, onNavigate }: DemoGuideProps) {
  const [minimized, setMinimized] = useState(false);
  const activeIndex = demoSteps.findIndex((step) => step.screen === currentScreen);

  if (minimized) {
    return (
      <button className="demo-guide minimized" onClick={() => setMinimized(false)}>
        <ChevronsRight size={18} /> Demo
      </button>
    );
  }

  return (
    <aside className="demo-guide" aria-label="Guia da demonstração">
      <div className="demo-guide-header">
        <div className="demo-title">
          <span>Modo demo</span>
          <strong>Fluxo do pitch</strong>
        </div>
        <button className="close-demo" onClick={() => setMinimized(true)} aria-label="Minimizar guia">
          <Minimize2 size={16} />
        </button>
      </div>

      <div className="demo-steps">
        {demoSteps.map((step, index) => {
          const active = step.screen === currentScreen;
          const completed = activeIndex > index;

          return (
            <button
              key={step.screen}
              className={`demo-step ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}
              onClick={() => onNavigate(step.screen)}
            >
              <span>{completed ? <Check size={14} /> : index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <small>{step.description}</small>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default DemoGuide;
