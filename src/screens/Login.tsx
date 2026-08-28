import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

type LoginProps = {
  onLogin: () => void;
  onRegister: () => void;
};

function Login({ onLogin, onRegister }: LoginProps) {
  const { connected } = useWallet();

  // Avança automaticamente quando a carteira conecta
  useEffect(() => {
    if (connected) {
      onLogin();
    }
  }, [connected, onLogin]);

  return (
    <section className="center-page page-enter">
      <div className="auth-card">
        <span className="eyebrow">Acesso do protótipo</span>
        <h2>Entrar no CaixaUni</h2>
        <p>Use a carteira da Solana para demonstrar a aprovação on-chain do Squads.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', marginBottom: '24px' }}>
          <WalletMultiButton />
        </div>

        <button className="text-action" onClick={onLogin}>Ou usar modo demo (sem carteira)</button>
        <button className="text-action" onClick={onRegister}>Ainda não tenho conta. Criar cadastro</button>
      </div>
    </section>
  );
}

export default Login;
