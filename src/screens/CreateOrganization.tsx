import PageTitle from '../components/PageTitle';
import { members } from '../data/mockData';

function CreateOrganization({ onDone }: { onDone: () => void }) {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Configuração inicial" title="Criar organização" description="Defina a tesouraria e a regra coletiva que será usada na demonstração." />
      <div className="two-column">
        <div className="panel form-panel">
          <label>Nome da organização<input defaultValue="Formatura Computação 2027" /></label>
          <label>Tipo<select defaultValue="formatura"><option value="formatura">Comissão de formatura</option><option value="atletica">Atlética universitária</option></select></label>
          <label>Meta financeira<input defaultValue="250000" /></label>
          <button className="primary-action" onClick={onDone}>Criar organização</button>
        </div>
        <div className="panel rule-panel">
          <h3>Regra de aprovação</h3>
          <div className="threshold-big">3 de 5</div>
          <p>Qualquer movimentação relevante só é autorizada quando pelo menos três responsáveis aprovam.</p>
          <div className="member-dots">{members.map((member) => <span key={member.id}>{member.name}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

export default CreateOrganization;
