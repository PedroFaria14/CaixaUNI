import { Check, Clock3, Landmark, Lock, ShieldCheck, WalletCards, X } from 'lucide-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import PageTitle from '../components/PageTitle';
import { members } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getExplorerTxUrl, shortenAddress } from '../services/solana';
import { createSquadsProposalApproveTransaction, createSquadsProposalExecuteTransaction, createSquadsProposalTransaction, getSquadsProposalChainStatus } from '../services/squads';
import type { Proposal, SquadsApprovalState, SquadsExecutionState, SquadsMultisigState, SquadsProposalChainStatus, SquadsProposalState } from '../types';
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
  const [squadsApprovals, setSquadsApprovals] = useLocalStorage<SquadsApprovalState[]>('caixauni_squadsApprovals', []);
  const [squadsExecutions, setSquadsExecutions] = useLocalStorage<SquadsExecutionState[]>('caixauni_squadsExecutions', []);
  const [squadsChainStatuses, setSquadsChainStatuses] = useLocalStorage<SquadsProposalChainStatus[]>('caixauni_squadsChainStatuses', []);
  const [squadsStatus, setSquadsStatus] = useLocalStorage<Record<string, 'idle' | 'signing' | 'success' | 'error'>>('caixauni_squadsProposalStatus', {});
  const [squadsError, setSquadsError] = useLocalStorage<Record<string, string>>('caixauni_squadsProposalError', {});
  const [squadsApprovalStatus, setSquadsApprovalStatus] = useLocalStorage<Record<string, 'idle' | 'signing' | 'success' | 'error'>>('caixauni_squadsApprovalStatus', {});
  const [squadsApprovalError, setSquadsApprovalError] = useLocalStorage<Record<string, string>>('caixauni_squadsApprovalError', {});
  const [squadsReadStatus, setSquadsReadStatus] = useLocalStorage<Record<string, 'idle' | 'loading' | 'success' | 'error'>>('caixauni_squadsReadStatus', {});
  const [squadsReadError, setSquadsReadError] = useLocalStorage<Record<string, string>>('caixauni_squadsReadError', {});
  const [squadsExecutionStatus, setSquadsExecutionStatus] = useLocalStorage<Record<string, 'idle' | 'signing' | 'success' | 'error'>>('caixauni_squadsExecutionStatus', {});
  const [squadsExecutionError, setSquadsExecutionError] = useLocalStorage<Record<string, string>>('caixauni_squadsExecutionError', {});
  const status = getProposalStatus(proposal);
  const missingApprovals = Math.max(proposal.threshold - proposal.approvals.length, 0);
  const progress = Math.min((proposal.approvals.length / proposal.threshold) * 100, 100);
  const walletAddress = publicKey?.toBase58() ?? '';
  const squadsProposal = squadsProposals.find((item) => item.proposalId === proposal.id);
  const currentSquadsStatus = squadsStatus[proposal.id] ?? 'idle';
  const currentSquadsError = squadsError[proposal.id] ?? '';
  const squadsApproval = squadsApprovals.find((item) => item.proposalId === proposal.id && item.member === walletAddress);
  const squadsExecution = squadsExecutions.find((item) => item.proposalId === proposal.id);
  const squadsChainStatus = squadsChainStatuses.find((item) => item.proposalId === proposal.id);
  const currentSquadsApprovalStatus = squadsApprovalStatus[proposal.id] ?? 'idle';
  const currentSquadsApprovalError = squadsApprovalError[proposal.id] ?? '';
  const currentSquadsReadStatus = squadsReadStatus[proposal.id] ?? 'idle';
  const currentSquadsReadError = squadsReadError[proposal.id] ?? '';
  const currentSquadsExecutionStatus = squadsExecutionStatus[proposal.id] ?? 'idle';
  const currentSquadsExecutionError = squadsExecutionError[proposal.id] ?? '';
  const uiReachedThreshold = proposal.approvals.length >= proposal.threshold;
  const chainVotes = squadsChainStatus?.approvals.length ?? 0;
  const chainReachedThreshold = Boolean(squadsChainStatus?.readyToExecute);
  const needsChainSync = uiReachedThreshold && squadsProposal && !chainReachedThreshold;

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
      
      let friendlyMessage = message;
      if (normalizedMessage.includes('rejected')) {
        friendlyMessage = 'Assinatura cancelada na wallet.';
      } else if (normalizedMessage.includes('unauthorized') || normalizedMessage.includes('permission')) {
        friendlyMessage = 'A wallet conectada não tem permissão de membro nesta multisig.';
      } else if (normalizedMessage.includes('already created') || normalizedMessage.includes('duplicate')) {
        friendlyMessage = 'Esta proposta já foi criada na Squads.';
      } else if (normalizedMessage.includes('rpc') || normalizedMessage.includes('fetch')) {
        friendlyMessage = 'A rede (RPC) está temporariamente indisponível. Tente novamente.';
      }

      setSquadsError((current) => ({ ...current, [proposal.id]: friendlyMessage }));
      setSquadsStatus((current) => ({ ...current, [proposal.id]: 'error' }));
    }
  };

  const approveSquadsProposal = async () => {
    if (!storedMultisig || !squadsProposal) {
      setSquadsApprovalError((current) => ({ ...current, [proposal.id]: 'Crie a proposta Squads antes de aprovar on-chain.' }));
      setSquadsApprovalStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    if (!walletAddress || !signTransaction) {
      setSquadsApprovalError((current) => ({ ...current, [proposal.id]: 'Conecte uma wallet com suporte a assinatura de transação.' }));
      setSquadsApprovalStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    if (squadsApproval) {
      setSquadsApprovalError((current) => ({ ...current, [proposal.id]: 'Esta wallet já aprovou a proposta Squads.' }));
      setSquadsApprovalStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    setSquadsApprovalStatus((current) => ({ ...current, [proposal.id]: 'signing' }));
    setSquadsApprovalError((current) => ({ ...current, [proposal.id]: '' }));

    try {
      const { transaction, blockhash, lastValidBlockHeight } = await createSquadsProposalApproveTransaction(
        connection,
        walletAddress,
        storedMultisig.multisigPda,
        squadsProposal.transactionIndex,
      );
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        preflightCommitment: 'confirmed',
        skipPreflight: false,
      });

      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
      setSquadsApprovals((current) => [
        ...current.filter((item) => !(item.proposalId === proposal.id && item.member === walletAddress)),
        { proposalId: proposal.id, member: walletAddress, signature, createdAt: new Date().toISOString() },
      ]);
      setSquadsApprovalStatus((current) => ({ ...current, [proposal.id]: 'success' }));
      await refreshSquadsStatus();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha desconhecida ao aprovar proposta Squads.';
      const normalizedMessage = message.toLowerCase();
      
      let friendlyMessage = message;
      if (normalizedMessage.includes('rejected')) {
        friendlyMessage = 'Assinatura cancelada na wallet.';
      } else if (normalizedMessage.includes('already') || normalizedMessage.includes('duplicate')) {
        friendlyMessage = 'Esta proposta já foi aprovada por esta wallet.';
      } else if (normalizedMessage.includes('unauthorized') || normalizedMessage.includes('permission')) {
        friendlyMessage = 'A wallet conectada não tem permissão de membro nesta multisig.';
      } else if (normalizedMessage.includes('executed') || normalizedMessage.includes('closed')) {
        friendlyMessage = 'Esta proposta já foi executada ou fechada.';
      } else if (normalizedMessage.includes('rpc') || normalizedMessage.includes('fetch')) {
        friendlyMessage = 'A rede (RPC) está temporariamente indisponível. Tente novamente.';
      }

      setSquadsApprovalError((current) => ({ ...current, [proposal.id]: friendlyMessage }));
      setSquadsApprovalStatus((current) => ({ ...current, [proposal.id]: 'error' }));
    }
  };

  const refreshSquadsStatus = async () => {
    if (!storedMultisig || !squadsProposal) {
      setSquadsReadError((current) => ({ ...current, [proposal.id]: 'Crie a proposta Squads antes de consultar o status on-chain.' }));
      setSquadsReadStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    setSquadsReadStatus((current) => ({ ...current, [proposal.id]: 'loading' }));
    setSquadsReadError((current) => ({ ...current, [proposal.id]: '' }));

    try {
      const chainStatus = await getSquadsProposalChainStatus(
        connection,
        proposal.id,
        storedMultisig.multisigPda,
        squadsProposal.proposalPda,
      );

      setSquadsChainStatuses((current) => [
        ...current.filter((item) => item.proposalId !== proposal.id),
        chainStatus,
      ]);
      setSquadsReadStatus((current) => ({ ...current, [proposal.id]: 'success' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha desconhecida ao consultar status Squads.';
      setSquadsReadError((current) => ({ ...current, [proposal.id]: message }));
      setSquadsReadStatus((current) => ({ ...current, [proposal.id]: 'error' }));
    }
  };

  const executeSquadsProposal = async () => {
    if (!storedMultisig || !squadsProposal) {
      setSquadsExecutionError((current) => ({ ...current, [proposal.id]: 'Crie a proposta Squads antes de executar on-chain.' }));
      setSquadsExecutionStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    if (!squadsChainStatus?.readyToExecute) {
      setSquadsExecutionError((current) => ({ ...current, [proposal.id]: 'A proposta ainda não atingiu o threshold on-chain. Atualize o status após as aprovações.' }));
      setSquadsExecutionStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    if (!walletAddress || !signTransaction) {
      setSquadsExecutionError((current) => ({ ...current, [proposal.id]: 'Conecte uma wallet com suporte a assinatura de transação.' }));
      setSquadsExecutionStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    if (squadsExecution) {
      setSquadsExecutionError((current) => ({ ...current, [proposal.id]: 'Esta proposta Squads já foi executada.' }));
      setSquadsExecutionStatus((current) => ({ ...current, [proposal.id]: 'error' }));
      return;
    }

    setSquadsExecutionStatus((current) => ({ ...current, [proposal.id]: 'signing' }));
    setSquadsExecutionError((current) => ({ ...current, [proposal.id]: '' }));

    try {
      const { transaction, blockhash, lastValidBlockHeight } = await createSquadsProposalExecuteTransaction(
        connection,
        walletAddress,
        storedMultisig.multisigPda,
        squadsProposal.transactionIndex,
      );
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        preflightCommitment: 'confirmed',
        skipPreflight: false,
      });

      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
      setSquadsExecutions((current) => [
        ...current.filter((item) => item.proposalId !== proposal.id),
        { proposalId: proposal.id, executor: walletAddress, signature, createdAt: new Date().toISOString() },
      ]);
      setSquadsExecutionStatus((current) => ({ ...current, [proposal.id]: 'success' }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha desconhecida ao executar proposta Squads.';
      const normalizedMessage = message.toLowerCase();
      
      let friendlyMessage = message;
      if (normalizedMessage.includes('rejected')) {
        friendlyMessage = 'Assinatura cancelada na wallet.';
      } else if (normalizedMessage.includes('threshold') || normalizedMessage.includes('approved')) {
        friendlyMessage = 'A proposta ainda não atingiu o threshold para execução.';
      } else if (normalizedMessage.includes('executed') || normalizedMessage.includes('stale')) {
        friendlyMessage = 'Esta proposta já foi executada.';
      } else if (normalizedMessage.includes('unauthorized') || normalizedMessage.includes('permission')) {
        friendlyMessage = 'A wallet conectada não tem permissão nesta multisig.';
      } else if (normalizedMessage.includes('rpc') || normalizedMessage.includes('fetch')) {
        friendlyMessage = 'A rede (RPC) está temporariamente indisponível. Tente novamente.';
      }

      setSquadsExecutionError((current) => ({ ...current, [proposal.id]: friendlyMessage }));
      setSquadsExecutionStatus((current) => ({ ...current, [proposal.id]: 'error' }));
    }
  };

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
