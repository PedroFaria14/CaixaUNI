import { Check, Clock3, Landmark, Lock, ShieldCheck, WalletCards, X } from 'lucide-react';
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
  const missingApprovals = Math.max(proposal.threshold - proposal.approvals.length, 0);
  const progress = Math.min((proposal.approvals.length / proposal.threshold) * 100, 100);

  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Aprovação coletiva" title={`${proposal.title} — ${money.format(proposal.amount)}`} description="Para o usuário, é uma aprovação simples. Na demo, o fluxo representa a regra multisig que autoriza a movimentação." />
      <div className="approval-layout">
        <div className="panel approval-card">
          <div className="approval-hero">
            <span className={`status-pill ${status}`}>
              {status === 'approved' ? <Check size={15} /> : <Lock size={15} />} {statusLabel}
            </span>
            <strong>{proposal.approvals.length}/{proposal.threshold}</strong>
            <span>{missingApprovals === 0 ? 'Threshold atingido' : `Faltam ${missingApprovals} aprovação${missingApprovals > 1 ? 'ões' : ''}`}</span>
          </div>
          <h3>{proposal.description}</h3>
          <p>Solicitação criada por {proposal.createdBy}. A movimentação só entra no histórico financeiro quando atingir 3 aprovações.</p>
          <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
          <div className={status === 'approved' ? 'approved-label' : 'blocked-label'}>
            {status === 'approved' ? <Check size={16} /> : <Clock3 size={16} />} {status === 'approved' ? 'Movimentação autorizada' : 'Movimentação ainda bloqueada'}
          </div>
          <div className="execution-rail" aria-label="Fluxo técnico da aprovação">
            <div className="execution-node done">
              <ShieldCheck size={18} />
              <strong>CaixaUni</strong>
              <span>Proposta criada</span>
            </div>
            <div className={`execution-node ${status === 'approved' ? 'done' : 'pending'}`}>
              <WalletCards size={18} />
              <strong>Squads</strong>
              <span>{status === 'approved' ? '3/5 liberado' : 'Aguardando threshold'}</span>
            </div>
            <div className={`execution-node ${status === 'approved' ? 'done' : 'locked'}`}>
              <Landmark size={18} />
              <strong>Solana</strong>
              <span>{status === 'approved' ? 'Execução pronta' : 'Bloqueada'}</span>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="section-header compact-header">
            <h3>Responsáveis</h3>
            <span>{proposal.approvals.length} de {proposal.totalApprovers} aprovaram</span>
          </div>
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
