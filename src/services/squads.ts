import { Keypair, PublicKey, Transaction, TransactionInstruction, TransactionMessage, type Connection } from '@solana/web3.js';
import { accounts, getMultisigPda, getProgramConfigPda, getProposalPda, getTransactionPda, getVaultPda, instructions, types } from '@sqds/multisig';
import type { Member, Proposal, SquadsProposalChainStatus } from '../types';
import { MULTISIG_THRESHOLD } from './solana';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export type SquadsCreatePlan = {
  programId: string;
  createKey: string;
  multisigPda: string;
  threshold: number;
  members: number;
  instructionAccounts: number;
  instructionBytes: number;
};

export type SquadsCreateTransaction = {
  transaction: Transaction;
  createKeypair: Keypair;
  plan: SquadsCreatePlan;
  blockhash: string;
  lastValidBlockHeight: number;
};

export type SquadsProposalPlan = {
  multisigPda: string;
  proposalPda: string;
  transactionPda: string;
  transactionIndex: string;
  vaultPda: string;
  instructionAccounts: number;
  instructionBytes: number;
};

export type SquadsProposalTransaction = {
  transaction: Transaction;
  plan: SquadsProposalPlan;
  blockhash: string;
  lastValidBlockHeight: number;
};

export type SquadsApprovalTransaction = {
  transaction: Transaction;
  blockhash: string;
  lastValidBlockHeight: number;
};

export type SquadsExecutionTransaction = {
  transaction: Transaction;
  blockhash: string;
  lastValidBlockHeight: number;
};

async function getSquadsTreasury(connection: Connection) {
  const programConfigPda = getProgramConfigPda({})[0];
  const programConfig = await accounts.ProgramConfig.fromAccountAddress(connection, programConfigPda, 'confirmed');
  return programConfig.treasury;
}

async function buildSquadsCreateInstruction(
  connection: Connection,
  creatorAddress: string,
  members: Member[],
  threshold = MULTISIG_THRESHOLD,
) {
  const creator = new PublicKey(creatorAddress);
  const treasury = await getSquadsTreasury(connection);
  const createKeypair = Keypair.generate();
  const multisigPda = getMultisigPda({ createKey: createKeypair.publicKey })[0];
  const squadsMembers = members.map((member) => ({
    key: new PublicKey(member.pubkey ?? ''),
    permissions: types.Permissions.all(),
  }));

  const instruction = instructions.multisigCreateV2({
    treasury,
    creator,
    multisigPda,
    configAuthority: null,
    threshold,
    members: squadsMembers,
    timeLock: 0,
    createKey: createKeypair.publicKey,
    rentCollector: null,
    memo: 'CaixaUni Devnet multisig preparation',
  });

  return { creator, createKeypair, multisigPda, squadsMembers, instruction };
}

function toPlan(
  createKeypair: Keypair,
  multisigPda: PublicKey,
  threshold: number,
  members: number,
  instructionAccounts: number,
  instructionBytes: number,
  programId: PublicKey,
): SquadsCreatePlan {
  return {
    programId: programId.toBase58(),
    createKey: createKeypair.publicKey.toBase58(),
    multisigPda: multisigPda.toBase58(),
    threshold,
    members,
    instructionAccounts,
    instructionBytes,
  };
}

export async function createSquadsMultisigPlan(
  connection: Connection,
  creatorAddress: string,
  members: Member[],
  threshold = MULTISIG_THRESHOLD,
): Promise<SquadsCreatePlan> {
  const { createKeypair, multisigPda, squadsMembers, instruction } = await buildSquadsCreateInstruction(
    connection,
    creatorAddress,
    members,
    threshold,
  );

  return toPlan(
    createKeypair,
    multisigPda,
    threshold,
    squadsMembers.length,
    instruction.keys.length,
    instruction.data.length,
    instruction.programId,
  );
}

export async function createSquadsMultisigTransaction(
  connection: Connection,
  creatorAddress: string,
  members: Member[],
  threshold = MULTISIG_THRESHOLD,
): Promise<SquadsCreateTransaction> {
  const { creator, createKeypair, multisigPda, squadsMembers, instruction } = await buildSquadsCreateInstruction(
    connection,
    creatorAddress,
    members,
    threshold,
  );
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  const transaction = new Transaction({ feePayer: creator, blockhash, lastValidBlockHeight }).add(instruction);

  return {
    transaction,
    createKeypair,
    plan: toPlan(
      createKeypair,
      multisigPda,
      threshold,
      squadsMembers.length,
      instruction.keys.length,
      instruction.data.length,
      instruction.programId,
    ),
    blockhash,
    lastValidBlockHeight,
  };
}

function getNextTransactionIndex(currentIndex: number | bigint | { toNumber: () => number }) {
  if (typeof currentIndex === 'bigint') return currentIndex + 1n;
  if (typeof currentIndex === 'number') return BigInt(currentIndex + 1);
  return BigInt(currentIndex.toNumber() + 1);
}

export function getSquadsMembersWithCreator(creatorAddress: string, members: Member[]) {
  const creatorKey = new PublicKey(creatorAddress).toBase58();
  const uniqueMembers = members.filter((member) => member.pubkey && member.pubkey !== creatorKey);

  return [
    { id: 'connected-wallet', name: 'Wallet conectada', role: 'Gestor', pubkey: creatorKey },
    ...uniqueMembers,
  ].slice(0, members.length);
}

export async function createSquadsProposalTransaction(
  connection: Connection,
  creatorAddress: string,
  multisigAddress: string,
  proposal: Proposal,
): Promise<SquadsProposalTransaction> {
  const creator = new PublicKey(creatorAddress);
  const multisigPda = new PublicKey(multisigAddress);
  const multisigAccount = await accounts.Multisig.fromAccountAddress(connection, multisigPda, 'confirmed');
  const transactionIndex = getNextTransactionIndex(multisigAccount.transactionIndex);
  const vaultIndex = 0;
  const vaultPda = getVaultPda({ multisigPda, index: vaultIndex })[0];
  const proposalPda = getProposalPda({ multisigPda, transactionIndex })[0];
  const transactionPda = getTransactionPda({ multisigPda, index: transactionIndex })[0];
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  const memoInstruction = new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(`CaixaUni expense approval: ${proposal.title} - BRL ${proposal.amount.toFixed(2)}`),
  });
  const transactionMessage = new TransactionMessage({
    payerKey: vaultPda,
    recentBlockhash: blockhash,
    instructions: [memoInstruction],
  });
  const createVaultTransactionInstruction = instructions.vaultTransactionCreate({
    multisigPda,
    transactionIndex,
    creator,
    rentPayer: creator,
    vaultIndex,
    ephemeralSigners: 0,
    transactionMessage,
    memo: `CaixaUni: ${proposal.id}`,
  });
  const createProposalInstruction = instructions.proposalCreate({
    multisigPda,
    creator,
    rentPayer: creator,
    transactionIndex,
    isDraft: false,
  });
  const transaction = new Transaction({ feePayer: creator, blockhash, lastValidBlockHeight }).add(
    createVaultTransactionInstruction,
    createProposalInstruction,
  );

  return {
    transaction,
    plan: {
      multisigPda: multisigPda.toBase58(),
      proposalPda: proposalPda.toBase58(),
      transactionPda: transactionPda.toBase58(),
      transactionIndex: transactionIndex.toString(),
      vaultPda: vaultPda.toBase58(),
      instructionAccounts: createVaultTransactionInstruction.keys.length + createProposalInstruction.keys.length,
      instructionBytes: createVaultTransactionInstruction.data.length + createProposalInstruction.data.length,
    },
    blockhash,
    lastValidBlockHeight,
  };
}

export async function createSquadsProposalApproveTransaction(
  connection: Connection,
  memberAddress: string,
  multisigAddress: string,
  transactionIndex: string,
): Promise<SquadsApprovalTransaction> {
  const member = new PublicKey(memberAddress);
  const multisigPda = new PublicKey(multisigAddress);
  const index = BigInt(transactionIndex);
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  const approveInstruction = instructions.proposalApprove({
    multisigPda,
    transactionIndex: index,
    member,
    memo: 'CaixaUni approval vote',
  });
  const transaction = new Transaction({ feePayer: member, blockhash, lastValidBlockHeight }).add(approveInstruction);

  return { transaction, blockhash, lastValidBlockHeight };
}

export async function getSquadsProposalChainStatus(
  connection: Connection,
  proposalId: string,
  multisigAddress: string,
  proposalAddress: string,
): Promise<SquadsProposalChainStatus> {
  const multisigPda = new PublicKey(multisigAddress);
  const proposalPda = new PublicKey(proposalAddress);
  const [multisigAccount, proposalAccount] = await Promise.all([
    accounts.Multisig.fromAccountAddress(connection, multisigPda, 'confirmed'),
    accounts.Proposal.fromAccountAddress(connection, proposalPda, 'confirmed'),
  ]);
  const prettyProposal = proposalAccount.pretty();
  const status = typeof prettyProposal.status === 'string' ? prettyProposal.status : proposalAccount.status.__kind;
  const approvals = proposalAccount.approved.map((key) => key.toBase58());

  return {
    proposalId,
    proposalPda: proposalPda.toBase58(),
    status,
    transactionIndex: proposalAccount.transactionIndex.toString(),
    threshold: multisigAccount.threshold,
    approvals,
    rejections: proposalAccount.rejected.map((key) => key.toBase58()),
    cancellations: proposalAccount.cancelled.map((key) => key.toBase58()),
    readyToExecute: status === 'Approved' || approvals.length >= multisigAccount.threshold,
    updatedAt: new Date().toISOString(),
  };
}

export async function createSquadsProposalExecuteTransaction(
  connection: Connection,
  executorAddress: string,
  multisigAddress: string,
  transactionIndex: string,
): Promise<SquadsExecutionTransaction> {
  const member = new PublicKey(executorAddress);
  const multisigPda = new PublicKey(multisigAddress);
  const index = BigInt(transactionIndex);
  const { instruction } = await instructions.vaultTransactionExecute({
    connection,
    multisigPda,
    transactionIndex: index,
    member,
  });
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
  const transaction = new Transaction({ feePayer: member, blockhash, lastValidBlockHeight }).add(instruction);

  return { transaction, blockhash, lastValidBlockHeight };
}
