import { Check, Clock3, Lock, X } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import { members } from '../data/mockData';
import type { Proposal } from '../types';
import { money } from '../utils/formatters';
import { getProposalStatus } from '../utils/proposalStatus';

type ApproveExpenseProps = {
  proposal: Proposal;
  onApprove: (proposalId: string, memberId: string) => void;
  onReject: (proposalId: string, memberId: string) => void;
};

function ApproveExpense({ proposal, onApprove, onReject }: ApproveExpenseProps) {
  const status = getProposalStatus(proposal);
  const statusLabel = status === 'approved' ? 'Autorizada' : status === 'blocked' ? 'Bloqueada' : 'Aguardando aprovações';

  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Aprovação coletiva" title={`${proposal.title} — ${money.format(proposal.amount)}`} description="Para o usuário, é uma aprovação simples. Por trás, a regra multisig participa da movimentação." />
      <div className="approval-layout">
        <div className="panel approval-card">
          <span className={`status-pill ${status}`}>
            {status === 'approved' ? <Check size={15} /> : <Lock size={15} />} {proposal.approvals.length}/{proposal.threshold} • {statusLabel}
          </span>
          <h3>{proposal.description}</h3>
          <p>Solicitação criada por {proposal.createdBy}. A movimentação só entra no histórico financeiro quando atingir 3 aprovações.</p>
          <div className="progress-track"><div style={{ width: `${Math.min((proposal.approvals.length / proposal.threshold) * 100, 100)}%` }} /></div>
          <div className={status === 'approved' ? 'approved-label' : 'blocked-label'}>
            {status === 'approved' ? <Check size={16} /> : <Clock3 size={16} />} {status === 'approved' ? 'Movimentação autorizada' : 'Movimentação ainda bloqueada'}
          </div>
        </div>
        <div className="panel">
          <h3>Responsáveis</h3>
          <div className="approver-list">
            {members.map((member) => {
              const approved = proposal.approvals.includes(member.id);
              const rejected = proposal.rejectedBy.includes(member.id);

              return (
                <div className="approver approver-action" key={member.id}>
                  <div><strong>{member.name}</strong><span>{member.role}</span></div>
                  <div className="mini-actions">
                    <button className="approve-mini" disabled={approved || status === 'approved'} onClick={() => onApprove(proposal.id, member.id)}>
                      {approved ? <><Check size={15} /> Aprovou</> : <><Check size={15} /> Aprovar</>}
                    </button>
                    <button className="reject-mini" disabled={rejected || status === 'approved'} onClick={() => onReject(proposal.id, member.id)}>
                      {rejected ? <><X size={15} /> Rejeitou</> : <><X size={15} /> Rejeitar</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApproveExpense;
