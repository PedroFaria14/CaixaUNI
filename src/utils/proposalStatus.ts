import type { Proposal, ProposalStatus } from '../types';

export function getProposalStatus(proposal: Proposal): ProposalStatus {
  if (proposal.approvals.length >= proposal.threshold) return 'approved';

  const remainingPossibleApprovals = proposal.totalApprovers - proposal.rejectedBy.length;
  return remainingPossibleApprovals < proposal.threshold ? 'blocked' : 'pending';
}
