import { ArrowDownRight, ArrowUpRight, Banknote, Landmark, Plus } from 'lucide-react';
import Metric from '../components/Metric';
import MovementList from '../components/MovementList';
import PageTitle from '../components/PageTitle';
import type { Movement } from '../types';
import { money } from '../utils/formatters';

type DashboardProps = {
  stats: { received: number; spent: number; balance: number; target: number; progress: number };
  movements: Movement[];
  onNewExpense: () => void;
};

function Dashboard({ stats, movements, onNewExpense }: DashboardProps) {
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

export default Dashboard;
