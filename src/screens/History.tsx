import MovementList from '../components/MovementList';
import PageTitle from '../components/PageTitle';
import type { Movement } from '../types';

function History({ movements }: { movements: Movement[] }) {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Histórico verificável" title="Movimentações" description="Registro claro do que foi solicitado, aprovado e movimentado." />
      <MovementList movements={movements} label="Entradas e despesas autorizadas" />
    </section>
  );
}

export default History;
