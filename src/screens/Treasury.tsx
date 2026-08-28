import PageTitle from '../components/PageTitle';
import ProposalCard from '../components/ProposalCard';
import type { Proposal } from '../types';

type TreasuryProps = {
  proposals: Proposal[];
  onApprove: (proposalId: string) => void;
};

function Treasury({ proposals, onApprove }: TreasuryProps) {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Tesouraria" title="Solicitações de movimentação" description="Acompanhe despesas aprovadas, pendentes e bloqueadas pela regra coletiva." />
      <div className="proposal-grid">
        {proposals.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} onApprove={() => onApprove(proposal.id)} />)}
      </div>
    </section>
  );
}

export default Treasury;
