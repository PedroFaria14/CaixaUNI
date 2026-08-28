import { Check, Lock } from 'lucide-react';
import type { Proposal } from '../types';
import { money } from '../utils/formatters';
import { getProposalStatus } from '../utils/proposalStatus';

type ProposalCardProps = {
  proposal: Proposal;
  onApprove: () => void;
};

function ProposalCard({ proposal, onApprove }: ProposalCardProps) {
  const status = getProposalStatus(proposal);

  return (
    <div className="panel proposal-card">
      <span className={`status-pill ${status}`}>
        {status === 'approved' ? <Check size={15} /> : <Lock size={15} />} {proposal.approvals.length}/{proposal.threshold} aprovações
      </span>
      <h3>{proposal.title}</h3>
      <p>{proposal.description}</p>
      <strong className="proposal-amount">{money.format(proposal.amount)}</strong>
      <div className="progress-track compact"><div style={{ width: `${Math.min((proposal.approvals.length / proposal.threshold) * 100, 100)}%` }} /></div>
      <button className="secondary-action full" onClick={onApprove}>Ver aprovação</button>
    </div>
  );
}

export default ProposalCard;
