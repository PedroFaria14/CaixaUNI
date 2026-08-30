import { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
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

  const approverKeys = useMemo(() => members.map((member) => member.pubkey).filter(Boolean), []);

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
          <span>{publicKey ? shortenAddress(publicKey.toBase58()) : 'Conecte Phantom ou Solflare para validar a wallet da demo.'}</span>
        </div>
        <div className="web3-step pending">
          <strong>Multisig demonstrada</strong>
          <span>
            {MULTISIG_THRESHOLD} de {members.length} aprovações via Squads Protocol.
          </span>
        </div>
      </div>

      <div className="web3-wallet-action">
        <WalletMultiButton />
      </div>

      <div className="info-box web3-note">
        Demo honesta: a wallet Solana conecta em Devnet; a execução Squads está representada no fluxo 3 de {approverKeys.length}.
      </div>
    </div>
  );
}

export default Web3SetupPanel;
