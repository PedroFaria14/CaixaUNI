import type { Movement } from '../types';
import { money } from '../utils/formatters';

type MovementListProps = {
  movements: Movement[];
  label: string;
};

function MovementList({ movements, label }: MovementListProps) {
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

export default MovementList;
