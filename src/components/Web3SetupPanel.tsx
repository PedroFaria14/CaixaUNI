import { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { members } from '../data/mockData';

const SOLANA_NETWORK = 'Devnet';
const MULTISIG_THRESHOLD = 3;

function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function Web3SetupPanel() {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const [rpcStatus, setRpcStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceStatus, setBalanceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [balanceError, setBalanceError] = useState('');

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
      const lamports = await connection.getBalance(publicKey, 'confirmed');
      setBalance(lamports / LAMPORTS_PER_SOL);
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
  const walletAddress = publicKey?.toBase58();

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
          <span>{SOLANA_NETWORK} configurada para testes seguros.</span>
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
      </div>

      {walletAddress && (
        <div className="wallet-details">
          <span>Endereço conectado</span>
          <code>{walletAddress}</code>
        </div>
      )}

      {balanceError && <div className="form-error" role="alert">{balanceError}</div>}

      <div className="web3-wallet-action">
        <WalletMultiButton />
        {connected && (
          <button className="secondary-action" onClick={() => void loadBalance()} disabled={balanceStatus === 'loading'}>
            {balanceStatus === 'loading' ? 'Atualizando...' : 'Atualizar saldo'}
          </button>
        )}
      </div>

      <div className="info-box web3-note">
        Demo honesta: wallet, RPC e saldo são consultados na Devnet; a execução Squads ainda está representada no fluxo {MULTISIG_THRESHOLD} de {approverKeys.length}.
      </div>
    </div>
  );
}

export default Web3SetupPanel;
