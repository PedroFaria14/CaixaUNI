import { Keypair, PublicKey, Transaction, type Connection } from '@solana/web3.js';
import { accounts, getMultisigPda, getProgramConfigPda, instructions, types } from '@sqds/multisig';
import type { Member } from '../types';
import { MULTISIG_THRESHOLD } from './solana';

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
  transaction.partialSign(createKeypair);

  const simulation = await connection.simulateTransaction(transaction, [createKeypair]);

  if (simulation.value.err) {
    throw new Error(`Simulação Squads falhou: ${JSON.stringify(simulation.value.err)}`);
  }

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
  };
}
