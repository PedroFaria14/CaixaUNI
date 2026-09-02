import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useLocalStorage } from './useLocalStorage';
import {
  createSquadsProposalApproveTransaction,
  createSquadsProposalExecuteTransaction,
  createSquadsProposalTransaction,
  getSquadsProposalChainStatus,
} from '../services/squads';
import type {
  Proposal,
  SquadsApprovalState,
  SquadsExecutionState,
  SquadsMultisigState,
  SquadsProposalChainStatus,
  SquadsProposalState,
} from '../types';

export function useSquadsProposal(proposal: Proposal) {
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
  const walletAddress = publicKey?.toBase58() ?? '';
  const squadsProposal = squadsProposals.find((item) => item.proposalId === proposal.id);
  const squadsApproval = squadsApprovals.find((item) => item.proposalId === proposal.id && item.member === walletAddress);
  const squadsExecution = squadsExecutions.find((item) => item.proposalId === proposal.id);
  const squadsChainStatus = squadsChainStatuses.find((item) => item.proposalId === proposal.id);

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

      if (normalizedMessage.includes('rejected')) friendlyMessage = 'Assinatura cancelada na wallet.';
      else if (normalizedMessage.includes('unauthorized') || normalizedMessage.includes('permission')) friendlyMessage = 'A wallet conectada não tem permissão de membro nesta multisig.';
      else if (normalizedMessage.includes('already created') || normalizedMessage.includes('duplicate')) friendlyMessage = 'Esta proposta já foi criada na Squads.';
      else if (normalizedMessage.includes('rpc') || normalizedMessage.includes('fetch')) friendlyMessage = 'A rede (RPC) está temporariamente indisponível. Tente novamente.';

      setSquadsError((current) => ({ ...current, [proposal.id]: friendlyMessage }));
      setSquadsStatus((current) => ({ ...current, [proposal.id]: 'error' }));
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

      if (normalizedMessage.includes('rejected')) friendlyMessage = 'Assinatura cancelada na wallet.';
      else if (normalizedMessage.includes('already') || normalizedMessage.includes('duplicate')) friendlyMessage = 'Esta proposta já foi aprovada por esta wallet.';
      else if (normalizedMessage.includes('unauthorized') || normalizedMessage.includes('permission')) friendlyMessage = 'A wallet conectada não tem permissão de membro nesta multisig.';
      else if (normalizedMessage.includes('executed') || normalizedMessage.includes('closed')) friendlyMessage = 'Esta proposta já foi executada ou fechada.';
      else if (normalizedMessage.includes('rpc') || normalizedMessage.includes('fetch')) friendlyMessage = 'A rede (RPC) está temporariamente indisponível. Tente novamente.';

      setSquadsApprovalError((current) => ({ ...current, [proposal.id]: friendlyMessage }));
      setSquadsApprovalStatus((current) => ({ ...current, [proposal.id]: 'error' }));
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

      if (normalizedMessage.includes('rejected')) friendlyMessage = 'Assinatura cancelada na wallet.';
      else if (normalizedMessage.includes('threshold') || normalizedMessage.includes('approved')) friendlyMessage = 'A proposta ainda não atingiu o threshold para execução.';
      else if (normalizedMessage.includes('executed') || normalizedMessage.includes('stale')) friendlyMessage = 'Esta proposta já foi executada.';
      else if (normalizedMessage.includes('unauthorized') || normalizedMessage.includes('permission')) friendlyMessage = 'A wallet conectada não tem permissão nesta multisig.';
      else if (normalizedMessage.includes('rpc') || normalizedMessage.includes('fetch')) friendlyMessage = 'A rede (RPC) está temporariamente indisponível. Tente novamente.';

      setSquadsExecutionError((current) => ({ ...current, [proposal.id]: friendlyMessage }));
      setSquadsExecutionStatus((current) => ({ ...current, [proposal.id]: 'error' }));
    }
  };

  return {
    storedMultisig,
    squadsProposal,
    squadsApproval,
    squadsExecution,
    squadsChainStatus,
    currentSquadsStatus: squadsStatus[proposal.id] ?? 'idle',
    currentSquadsError: squadsError[proposal.id] ?? '',
    currentSquadsApprovalStatus: squadsApprovalStatus[proposal.id] ?? 'idle',
    currentSquadsApprovalError: squadsApprovalError[proposal.id] ?? '',
    currentSquadsReadStatus: squadsReadStatus[proposal.id] ?? 'idle',
    currentSquadsReadError: squadsReadError[proposal.id] ?? '',
    currentSquadsExecutionStatus: squadsExecutionStatus[proposal.id] ?? 'idle',
    currentSquadsExecutionError: squadsExecutionError[proposal.id] ?? '',
    createSquadsProposal,
    approveSquadsProposal,
    refreshSquadsStatus,
    executeSquadsProposal,
  };
}
