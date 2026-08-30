import { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Web3SetupPanel from '../components/Web3SetupPanel';
import { members } from '../data/mockData';

function CreateOrganization({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('Formatura Computação 2027');
  const [goal, setGoal] = useState('250000');
  const [error, setError] = useState('');

  const submitOrganization = () => {
    const parsedGoal = Number(goal);

    if (!name.trim()) {
      setError('Informe o nome da organização.');
      return;
    }

    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      setError('Informe uma meta financeira positiva.');
      return;
    }

    setError('');
    onDone();
  };

  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Configuração inicial" title="Criar organização" description="Defina a tesouraria e a regra coletiva que será usada na demonstração." />
      <div className="two-column">
        <div className="panel form-panel">
          <label>Nome da organização<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <label>Tipo<select defaultValue="formatura"><option value="formatura">Comissão de formatura</option><option value="atletica">Atlética universitária</option></select></label>
          <label>Meta financeira<input value={goal} onChange={(event) => setGoal(event.target.value)} inputMode="numeric" type="number" min="1" required /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="primary-action" onClick={submitOrganization}>Criar organização</button>
        </div>
        <div className="panel rule-panel">
          <h3>Regra de aprovação</h3>
          <div className="threshold-big">3 de 5</div>
          <p>Qualquer movimentação relevante só é autorizada quando pelo menos três responsáveis aprovam.</p>
          <div className="member-dots">{members.map((member) => <span key={member.id}>{member.name}</span>)}</div>
        </div>
      </div>
      <Web3SetupPanel />
    </section>
  );
}

export default CreateOrganization;
