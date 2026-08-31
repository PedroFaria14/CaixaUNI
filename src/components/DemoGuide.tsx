import { useState } from 'react';
import { Check, ChevronsRight, Minimize2, RotateCcw } from 'lucide-react';
import type { Screen } from '../types';

type DemoStep = {
  screen: Screen;
  title: string;
  description: string;
};

const demoSteps: DemoStep[] = [
  { screen: 'landing', title: 'Problema', description: 'Mostre dinheiro coletivo com controle concentrado.' },
  { screen: 'register', title: 'Entrada', description: 'Cadastre um gestor ou aprovador da comissão.' },
  { screen: 'create-organization', title: 'Governança', description: 'Configure a organização e a regra 3 de 5.' },
  { screen: 'new-expense', title: 'Solicitação', description: 'Crie uma despesa que não pode ser paga sozinha.' },
  { screen: 'approve-expense', title: 'Aprovação', description: 'Aprove com três responsáveis até liberar o threshold.' },
  { screen: 'history', title: 'Histórico', description: 'Comprove que só despesas autorizadas entram no registro.' },
  { screen: 'contribute', title: 'Arrecadação', description: 'Mostre Solana Pay como complemento para entradas.' },
];

type DemoGuideProps = {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onReset: () => void;
};

function DemoGuide({ currentScreen, onNavigate, onReset }: DemoGuideProps) {
  const [minimized, setMinimized] = useState(false);
  const activeIndex = Math.max(demoSteps.findIndex((step) => step.screen === currentScreen), 0);
  const nextStep = demoSteps[Math.min(activeIndex + 1, demoSteps.length - 1)];
  const isLastStep = activeIndex >= demoSteps.length - 1;

  if (minimized) {
    return (
      <button className="demo-guide minimized" onClick={() => setMinimized(false)}>
        <ChevronsRight size={18} /> Guia
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

      <div className="demo-actions">
        <button className="demo-next" onClick={() => onNavigate(isLastStep ? 'landing' : nextStep.screen)}>
          {isLastStep ? 'Voltar ao início' : 'Próximo passo'} <ChevronsRight size={16} />
        </button>
        <button className="demo-reset" onClick={onReset}>
          <RotateCcw size={15} /> Reiniciar demo
        </button>
      </div>
    </aside>
  );
}

export default DemoGuide;
