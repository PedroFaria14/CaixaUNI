import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import type { Proposal } from '../types';

type NewExpenseProps = {
  onCreate: (proposal: Pick<Proposal, 'title' | 'amount' | 'description'>) => void;
};

function NewExpense({ onCreate }: NewExpenseProps) {
  const [title, setTitle] = useState('Buffet ABC');
  const [amount, setAmount] = useState('12000');
  const [description, setDescription] = useState('Entrada de 30% para reserva da data do evento.');
  const [error, setError] = useState('');

  const submitProposal = () => {
    const parsedAmount = Number(amount);

    if (!title.trim()) {
      setError('Informe o fornecedor da despesa.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Informe um valor positivo para a despesa.');
      return;
    }

    if (!description.trim()) {
      setError('Informe a justificativa da solicitação.');
      return;
    }

    setError('');
    onCreate({ title: title.trim(), amount: parsedAmount, description: description.trim() });
  };

  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Nova solicitação" title="Criar despesa" description="O gestor solicita a despesa, mas a movimentação só acontece após o threshold de aprovações." />
      <div className="panel form-panel wide">
        <label>Fornecedor<input value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
        <label>Valor<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" type="number" min="1" required /></label>
        <label>Justificativa<textarea value={description} onChange={(event) => setDescription(event.target.value)} required /></label>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="info-box"><ShieldCheck size={18} /> Esta solicitação será enviada para aprovação 3 de 5 via Squads.</div>
        <button className="primary-action" onClick={submitProposal}>Criar solicitação</button>
      </div>
    </section>
  );
}

export default NewExpense;
