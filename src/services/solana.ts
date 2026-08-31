import { LAMPORTS_PER_SOL, PublicKey, type Connection } from '@solana/web3.js';
import type { Member } from '../types';

export const SOLANA_CLUSTER = 'devnet';
export const SOLANA_NETWORK_LABEL = 'Devnet';
export const MULTISIG_THRESHOLD = 3;

export type SquadsValidation = {
  valid: boolean;
  validMembers: number;
  threshold: number;
  errors: string[];
};

export function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function lamportsToSol(lamports: number) {
  return lamports / LAMPORTS_PER_SOL;
}

export async function getWalletBalance(connection: Connection, publicKey: PublicKey) {
  const lamports = await connection.getBalance(publicKey, 'confirmed');
  return lamportsToSol(lamports);
}

export function getExplorerAddressUrl(address: string) {
  return `https://explorer.solana.com/address/${address}?cluster=${SOLANA_CLUSTER}`;
}

export function getExplorerTxUrl(signature: string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${SOLANA_CLUSTER}`;
}

export function validateSquadsConfiguration(members: Member[], threshold = MULTISIG_THRESHOLD): SquadsValidation {
  const errors: string[] = [];
  const validKeys = members
    .map((member) => member.pubkey)
    .filter((pubkey): pubkey is string => Boolean(pubkey));
  const uniqueKeys = new Set(validKeys);

  for (const member of members) {
    if (!member.pubkey) {
      errors.push(`${member.name} não possui public key configurada.`);
      continue;
    }

    try {
      new PublicKey(member.pubkey);
    } catch {
      errors.push(`${member.name} possui public key inválida.`);
    }
  }

  if (threshold <= 0) {
    errors.push('Threshold deve ser maior que zero.');
  }

  if (threshold > members.length) {
    errors.push('Threshold não pode ser maior que o número de membros.');
  }

  if (uniqueKeys.size !== validKeys.length) {
    errors.push('Existem public keys duplicadas entre os membros.');
  }

  return {
    valid: errors.length === 0,
    validMembers: validKeys.length,
    threshold,
    errors,
  };
}
