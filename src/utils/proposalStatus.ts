import type { Proposal, ProposalStatus } from '../types';

export function getProposalStatus(proposal: Proposal): ProposalStatus {
  if (proposal.approvals.length >= proposal.threshold) return 'approved';
  return proposal.rejectedBy.length > 0 ? 'blocked' : 'pending';
}
