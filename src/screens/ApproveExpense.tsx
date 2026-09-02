import { Check, Clock3, Landmark, Lock, ShieldCheck, WalletCards, X } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import { members } from '../data/mockData';
import { useSquadsProposal } from '../hooks/useSquadsProposal';
import { getExplorerTxUrl, shortenAddress } from '../services/solana';
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
  const missingApprovals = Math.max(proposal.threshold - proposal.approvals.length, 0);
  const progress = Math.min((proposal.approvals.length / proposal.threshold) * 100, 100);
  const {
    storedMultisig,
    squadsProposal,
    squadsApproval,
    squadsExecution,
    squadsChainStatus,
    currentSquadsStatus,
    currentSquadsError,
    currentSquadsApprovalStatus,
    currentSquadsApprovalError,
    currentSquadsReadStatus,
    currentSquadsReadError,
    currentSquadsExecutionStatus,
    currentSquadsExecutionError,
    createSquadsProposal,
    approveSquadsProposal,
    refreshSquadsStatus,
    executeSquadsProposal,
  } = useSquadsProposal(proposal);
  const uiReachedThreshold = proposal.approvals.length >= proposal.threshold;
  const chainVotes = squadsChainStatus?.approvals.length ?? 0;
  const chainReachedThreshold = Boolean(squadsChainStatus?.readyToExecute);
  const needsChainSync = uiReachedThreshold && squadsProposal && !chainReachedThreshold;

  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Aprovação coletiva" title={`${proposal.title} — ${money.format(proposal.amount)}`} description="Para o usuário, é uma aprovação simples. Na demo, o fluxo representa a regra multisig que autoriza a movimentação." />
      <div className="approval-layout">
        <div className="panel approval-card">
          <div className="approval-hero">
            <span className={`status-pill ${status}`}>
              {status === 'approved' ? <Check size={15} /> : <Lock size={15} />} Aprovação na interface
            </span>
            <strong>{proposal.approvals.length}/{proposal.threshold}</strong>
            <span>{missingApprovals === 0 ? 'Pronto para registrar na Squads' : `Faltam ${missingApprovals} aprovação${missingApprovals > 1 ? 'ões' : ''}`}</span>
          </div>
          <h3>{proposal.description}</h3>
          <p>Solicitação criada por {proposal.createdBy}. A movimentação só entra no histórico financeiro quando atingir 3 aprovações.</p>
          <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
          <div className={status === 'approved' ? 'approved-label' : 'blocked-label'}>
            {status === 'approved' ? <Check size={16} /> : <Clock3 size={16} />} {status === 'approved' ? 'Aprovação local completa' : 'Movimentação ainda bloqueada'}
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
              <span>{chainReachedThreshold ? `${chainVotes}/${proposal.threshold} on-chain` : status === 'approved' ? 'Aguardando registro on-chain' : 'Aguardando threshold'}</span>
            </div>
            <div className={`execution-node ${chainReachedThreshold ? 'done' : 'locked'}`}>
              <Landmark size={18} />
              <strong>Solana</strong>
              <span>{chainReachedThreshold ? 'Execução pronta' : 'Bloqueada até confirmar'}</span>
            </div>
          </div>
          <div className="squads-plan" aria-label="Proposta Squads vinculada à despesa">
            <div>
              <span>Multisig Squads</span>
              <code>{storedMultisig ? shortenAddress(storedMultisig.multisigPda) : 'Ainda não criada'}</code>
            </div>
            {squadsProposal && (
              <>
                <div>
                  <span>Proposal PDA</span>
                  <code>{squadsProposal.proposalPda}</code>
                </div>
                <div>
                  <span>Transaction index</span>
                  <strong>{squadsProposal.transactionIndex}</strong>
                </div>
                <a href={getExplorerTxUrl(squadsProposal.signature)} target="_blank" rel="noreferrer">Abrir proposta no Solana Explorer</a>
              </>
            )}
            {currentSquadsError && <div className="form-error" role="alert">{currentSquadsError}</div>}
            <button className="primary-action" onClick={() => void createSquadsProposal()} disabled={currentSquadsStatus === 'signing' || Boolean(squadsProposal)}>
              {currentSquadsStatus === 'signing' ? 'Aguardando assinatura...' : squadsProposal ? 'Proposta Squads criada' : 'Criar proposta Squads'}
            </button>
            {squadsProposal && (
              <>
                {squadsApproval && (
                  <a href={getExplorerTxUrl(squadsApproval.signature)} target="_blank" rel="noreferrer">Abrir aprovação no Solana Explorer</a>
                )}
                {squadsChainStatus && (
                  <div className="squads-plan success" aria-label="Status real da proposta Squads">
                    <div>
                      <span>Status on-chain</span>
                      <strong>{squadsChainStatus.status}</strong>
                    </div>
                    <div>
                      <span>Votos registrados</span>
                      <strong>{squadsChainStatus.approvals.length}/{squadsChainStatus.threshold}</strong>
                    </div>
                    <div>
                      <span>Execução</span>
                      <strong>{squadsExecution ? 'Executada' : squadsChainStatus.readyToExecute ? 'Pronta para executar' : 'Aguardando threshold'}</strong>
                    </div>
                  </div>
                )}
                {needsChainSync && (
                  <div className="chain-sync-note" role="status">
                    <strong>UI e blockchain ainda não estão no mesmo ponto.</strong>
                    <span>A interface já atingiu {proposal.approvals.length}/{proposal.threshold}. Clique em Aprovar na Squads, assine na wallet e atualize o status até os votos on-chain confirmarem.</span>
                  </div>
                )}
                {squadsExecution && (
                  <a href={getExplorerTxUrl(squadsExecution.signature)} target="_blank" rel="noreferrer">Abrir execução no Solana Explorer</a>
                )}
                {currentSquadsApprovalError && <div className="form-error" role="alert">{currentSquadsApprovalError}</div>}
                {currentSquadsReadError && <div className="form-error" role="alert">{currentSquadsReadError}</div>}
                {currentSquadsExecutionError && <div className="form-error" role="alert">{currentSquadsExecutionError}</div>}
                <button className="secondary-action" onClick={() => void approveSquadsProposal()} disabled={currentSquadsApprovalStatus === 'signing' || Boolean(squadsApproval)}>
                  {currentSquadsApprovalStatus === 'signing' ? 'Aguardando assinatura...' : squadsApproval ? 'Aprovada na Squads' : 'Aprovar na Squads'}
                </button>
                <button className="secondary-action" onClick={() => void refreshSquadsStatus()} disabled={currentSquadsReadStatus === 'loading'}>
                  {currentSquadsReadStatus === 'loading' ? 'Atualizando status...' : 'Atualizar status Squads'}
                </button>
                <button className="primary-action" onClick={() => void executeSquadsProposal()} disabled={!squadsChainStatus?.readyToExecute || currentSquadsExecutionStatus === 'signing' || Boolean(squadsExecution)}>
                  {currentSquadsExecutionStatus === 'signing' ? 'Aguardando assinatura...' : squadsExecution ? 'Executada na Squads' : 'Executar na Squads'}
                </button>
              </>
            )}
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
                    <button className="approve-mini" disabled={approved || status === 'approved'} onClick={() => onApprove(proposal.id, member.id)} aria-label={`Aprovar solicitação como ${member.name}`}>
                      {approved ? <><Check size={15} /> Aprovou</> : <><Check size={15} /> Aprovar</>}
                    </button>
                    <button className="reject-mini" disabled={rejected || status === 'approved'} onClick={() => onReject(proposal.id, member.id)} aria-label={`Rejeitar solicitação como ${member.name}`}>
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
