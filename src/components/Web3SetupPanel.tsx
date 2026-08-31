import { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { members } from '../data/mockData';
import {
  getExplorerAddressUrl,
  getExplorerTxUrl,
  getWalletBalance,
  MULTISIG_THRESHOLD,
  shortenAddress,
  SOLANA_NETWORK_LABEL,
  validateSquadsConfiguration,
} from '../services/solana';
import { createSquadsMultisigPlan, createSquadsMultisigTransaction, type SquadsCreatePlan } from '../services/squads';

function Web3SetupPanel() {
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const [rpcStatus, setRpcStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceStatus, setBalanceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [balanceError, setBalanceError] = useState('');
  const [squadsPlan, setSquadsPlan] = useState<SquadsCreatePlan | null>(null);
  const [squadsPlanStatus, setSquadsPlanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [squadsPlanError, setSquadsPlanError] = useState('');
  const [createStatus, setCreateStatus] = useState<'idle' | 'signing' | 'success' | 'error'>('idle');
  const [createError, setCreateError] = useState('');
  const [createSignature, setCreateSignature] = useState('');

  useEffect(() => {
    let isMounted = true;

    connection
      .getVersion()
      .then(() => {
        if (isMounted) setRpcStatus('online');
      })
      .catch(() => {
        if (isMounted) setRpcStatus('offline');
      });

    return () => {
      isMounted = false;
    };
  }, [connection]);

  const loadBalance = async () => {
    if (!publicKey) {
      setBalance(null);
      setBalanceStatus('idle');
      setBalanceError('');
      return;
    }

    setBalanceStatus('loading');
    setBalanceError('');

    try {
      const solBalance = await getWalletBalance(connection, publicKey);
      setBalance(solBalance);
      setBalanceStatus('success');
    } catch {
      setBalance(null);
      setBalanceStatus('error');
      setBalanceError('Não foi possível ler o saldo na Devnet. Verifique RPC e conexão da wallet.');
    }
  };

  useEffect(() => {
    void loadBalance();
  }, [connection, publicKey]);

  const approverKeys = useMemo(() => members.map((member) => member.pubkey).filter(Boolean), []);
  const squadsValidation = useMemo(() => validateSquadsConfiguration(members, MULTISIG_THRESHOLD), []);
  const walletAddress = publicKey?.toBase58();
  const explorerUrl = walletAddress ? getExplorerAddressUrl(walletAddress) : '';
  const transactionExplorerUrl = createSignature ? getExplorerTxUrl(createSignature) : '';

  const prepareSquadsPlan = async () => {
    if (!walletAddress) {
      setSquadsPlanStatus('error');
      setSquadsPlanError('Conecte a wallet antes de preparar a multisig.');
      return;
    }

    if (!squadsValidation.valid) {
      setSquadsPlanStatus('error');
      setSquadsPlanError('Corrija a configuração dos membros antes de preparar a multisig.');
      return;
    }

    setSquadsPlanStatus('loading');
    setSquadsPlanError('');

    try {
      setSquadsPlan(await createSquadsMultisigPlan(connection, walletAddress, members, MULTISIG_THRESHOLD));
      setSquadsPlanStatus('success');
      setSquadsPlanError('');
    } catch {
      setSquadsPlan(null);
      setSquadsPlanStatus('error');
      setSquadsPlanError('Não foi possível montar a instrução Squads localmente.');
    }
  };

  const createMultisigOnDevnet = async () => {
    if (!walletAddress) {
      setCreateError('Conecte a wallet antes de criar a multisig.');
      setCreateStatus('error');
      return;
    }

    if (!squadsValidation.valid) {
      setCreateError('Corrija a configuração dos membros antes de criar a multisig.');
      setCreateStatus('error');
      return;
    }

    setCreateStatus('signing');
    setCreateError('');
    setCreateSignature('');

    try {
      const { transaction, createKeypair, plan } = await createSquadsMultisigTransaction(
        connection,
        walletAddress,
        members,
        MULTISIG_THRESHOLD,
      );
      const signature = await sendTransaction(transaction, connection, { signers: [createKeypair] });

      await connection.confirmTransaction(signature, 'confirmed');
      setSquadsPlan(plan);
      setCreateSignature(signature);
      setCreateStatus('success');
      void loadBalance();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha desconhecida ao criar multisig.';
      setCreateError(message.includes('User rejected') ? 'Assinatura cancelada na wallet.' : message);
      setCreateStatus('error');
    }
  };

  return (
    <div className="panel web3-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Camada blockchain</span>
          <h3>Preparação Squads/Solana</h3>
        </div>
        <span className={`status-pill ${rpcStatus === 'online' ? 'approved' : rpcStatus === 'offline' ? 'blocked' : 'pending'}`}>
          RPC {rpcStatus === 'online' ? 'online' : rpcStatus === 'offline' ? 'offline' : 'checando'}
        </span>
      </div>

      <div className="web3-steps">
        <div className="web3-step done">
          <strong>Rede</strong>
          <span>{SOLANA_NETWORK_LABEL} configurada para testes seguros.</span>
        </div>
        <div className={connected ? 'web3-step done' : 'web3-step pending'}>
          <strong>Wallet do gestor</strong>
          <span>{walletAddress ? shortenAddress(walletAddress) : 'Conecte Phantom ou Solflare para validar a wallet da demo.'}</span>
        </div>
        <div className={balanceStatus === 'success' ? 'web3-step done' : balanceStatus === 'error' ? 'web3-step blocked' : 'web3-step pending'}>
          <strong>Saldo Devnet</strong>
          <span>
            {!connected && 'Conecte a wallet para consultar.'}
            {connected && balanceStatus === 'loading' && 'Consultando saldo...' }
            {connected && balanceStatus === 'success' && `${balance?.toFixed(4)} SOL`}
            {connected && balanceStatus === 'error' && 'Erro ao consultar saldo'}
          </span>
        </div>
        <div className={squadsValidation.valid ? 'web3-step done' : 'web3-step blocked'}>
          <strong>Configuração Squads</strong>
          <span>
            {squadsValidation.valid
              ? `${squadsValidation.validMembers} membros válidos • regra ${squadsValidation.threshold}/${members.length}`
              : 'Configuração precisa de ajuste'}
          </span>
        </div>
      </div>

      {walletAddress && (
        <div className="wallet-details">
          <span>Endereço conectado</span>
          <code>{walletAddress}</code>
          <a href={explorerUrl} target="_blank" rel="noreferrer">Abrir no Solana Explorer Devnet</a>
        </div>
      )}

      {balanceError && <div className="form-error" role="alert">{balanceError}</div>}
      {!squadsValidation.valid && (
        <div className="form-error" role="alert">
          {squadsValidation.errors.join(' ')}
        </div>
      )}
      {squadsPlanError && <div className="form-error" role="alert">{squadsPlanError}</div>}
      {createError && <div className="form-error" role="alert">{createError}</div>}

      {squadsPlan && (
        <div className="squads-plan" aria-label="Plano local de criação da multisig Squads">
          <div>
            <span>Programa Squads</span>
            <code>{squadsPlan.programId}</code>
          </div>
          <div>
            <span>Multisig PDA prevista</span>
            <code>{squadsPlan.multisigPda}</code>
          </div>
          <div>
            <span>Plano</span>
            <strong>{squadsPlan.threshold}/{squadsPlan.members} membros • {squadsPlan.instructionAccounts} contas • {squadsPlan.instructionBytes} bytes</strong>
          </div>
        </div>
      )}

      {createSignature && (
        <div className="squads-plan success" aria-label="Transação Squads confirmada na Devnet">
          <div>
            <span>Transação confirmada</span>
            <code>{createSignature}</code>
          </div>
          <a href={transactionExplorerUrl} target="_blank" rel="noreferrer">Abrir transação no Solana Explorer</a>
        </div>
      )}

      <div className="web3-wallet-action">
        <WalletMultiButton />
        {connected && (
          <button className="secondary-action" onClick={() => void loadBalance()} disabled={balanceStatus === 'loading'}>
            {balanceStatus === 'loading' ? 'Atualizando...' : 'Atualizar saldo'}
          </button>
        )}
        <button className="secondary-action" onClick={() => void prepareSquadsPlan()} disabled={!connected || !squadsValidation.valid || squadsPlanStatus === 'loading'}>
          {squadsPlanStatus === 'loading' ? 'Preparando...' : 'Preparar multisig'}
        </button>
        <button className="primary-action" onClick={() => void createMultisigOnDevnet()} disabled={!connected || !squadsValidation.valid || createStatus === 'signing'}>
          {createStatus === 'signing' ? 'Aguardando assinatura...' : 'Criar multisig Devnet'}
        </button>
      </div>

      <div className="info-box web3-note">
        Demo honesta: wallet, RPC e saldo são consultados na Devnet; a execução Squads ainda está representada no fluxo {MULTISIG_THRESHOLD} de {approverKeys.length}.
      </div>
    </div>
  );
}

export default Web3SetupPanel;
