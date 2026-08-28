import type { ReactNode } from 'react';

type MetricProps = {
  label: string;
  value: string;
  icon: ReactNode;
  tone: string;
};

function Metric({ label, value, icon, tone }: MetricProps) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default Metric;
