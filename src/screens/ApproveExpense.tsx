import { Check, Clock3, Landmark, Lock, ShieldCheck, WalletCards, X } from 'lucide-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import PageTitle from '../components/PageTitle';
import { members } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getExplorerTxUrl, shortenAddress } from '../services/solana';
import { createSquadsProposalTransaction } from '../services/squads';
import type { Proposal, SquadsMultisigState, SquadsProposalState } from '../types';
import { money } from '../utils/formatters';
import { getProposalStatus } from '../utils/proposalStatus';

type ApproveExpenseProps = {
  proposal: Proposal;
  onApprove: (proposalId: string, memberId: string) => void;
  onReject: (proposalId: string, memberId: string) => void;
};

function ApproveExpense({ proposal, onApprove, onReject }: ApproveExpenseProps) {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [storedMultisig] = useLocalStorage<SquadsMultisigState | null>('caixauni_squadsMultisig', null);
  const [squadsProposals, setSquadsProposals] = useLocalStorage<SquadsProposalState[]>('caixauni_squadsProposals', []);
  const [squadsStatus, setSquadsStatus] = useLocalStorage<Record<string, 'idle' | 'signing' | 'success' | 'error'>>('caixauni_squadsProposalStatus', {});
  const [squadsError, setSquadsError] = useLocalStorage<Record<string, string>>('caixauni_squadsProposalError', {});
  const status = getProposalStatus(proposal);
  const statusLabel = status === 'approved' ? 'Autorizada' : status === 'blocked' ? 'Bloqueada' : 'Aguardando aprovações';
  const missingApprovals = Math.max(proposal.threshold - proposal.approvals.length, 0);
  const progress = Math.min((proposal.approvals.length / proposal.threshold) * 100, 100);
  const walletAddress = publicKey?.toBase58() ?? '';
  const squadsProposal = squadsProposals.find((item) => item.proposalId === proposal.id);
  const currentSquadsStatus = squadsStatus[proposal.id] ?? 'idle';
  const currentSquadsError = squadsError[proposal.id] ?? '';

  const createSquadsProposal = async () => {
    if (!storedMultisig) {
      setSquadsError((current) => ({ ...current, [proposal.id]: 'Crie a multisig Squads na etapa de organização antes de criar proposta on-chain.' }));
      setSquadsStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    if (!walletAddress || !signTransaction) {
      setSquadsError((current) => ({ ...current, [proposal.id]: 'Conecte uma wallet com suporte a assinatura de transação.' }));
      setSquadsStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    if (storedMultisig.creator !== walletAddress) {
      setSquadsError((current) => ({ ...current, [proposal.id]: 'Use a mesma wallet que criou a multisig para abrir esta proposta Squads.' }));
      setSquadsStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    setSquadsStatus((current) => ({ ...current, [proposal.id]: 'signing' }));
    setSquadsError((current) => ({ ...current, [proposal.id]: '' }));

    try {
      const { transaction, plan, blockhash, lastValidBlockHeight } = await createSquadsProposalTransaction(
        connection,
        walletAddress,
        storedMultisig.multisigPda,
        proposal,
      );
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        preflightCommitment: 'confirmed',
        skipPreflight: false,
      });

      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
      setSquadsProposals((current) => [
        ...current.filter((item) => item.proposalId !== proposal.id),
        {
          proposalId: proposal.id,
          proposalPda: plan.proposalPda,
          transactionPda: plan.transactionPda,
          transactionIndex: plan.transactionIndex,
          signature,
          createdAt: new Date().toISOString(),
        },
      ]);
      setSquadsStatus((current) => ({ ...current, [proposal.id]: 'success' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha desconhecida ao criar proposta Squads.';
      const normalizedMessage = message.toLowerCase();
      const friendlyMessage = normalizedMessage.includes('rejected')
        ? 'Assinatura cancelada na wallet.'
        : normalizedMessage.includes('unauthorized') || normalizedMessage.includes('permission')
          ? 'A wallet conectada não tem permissão de membro para criar proposta nesta multisig. Recrie a multisig com a wallet conectada.'
          : message;

      setSquadsError((current) => ({ ...current, [proposal.id]: friendlyMessage }));
      setSquadsStatus((current) => ({ ...current, [proposal.id]: 'error' }));
    }
  };

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
