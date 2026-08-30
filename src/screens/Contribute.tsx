import { CopyCheck, QrCode } from 'lucide-react';
import { useState } from 'react';
import PageTitle from '../components/PageTitle';

const DEMO_PAYMENT_LINK = 'solana:https://caixauni.demo/pay?org=formatura-computacao-2027&amount=250';

function Contribute() {
  const [copied, setCopied] = useState(false);

  const copyPaymentLink = async () => {
    await navigator.clipboard.writeText(DEMO_PAYMENT_LINK);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2800);
  };

  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Solana Pay" title="Contribuir para a tesouraria" description="Arrecadação complementar por QR Code para mensalidades, eventos e campanhas." />
      <div className="contribute-layout">
        <div className="panel qr-panel">
          <div className="fake-qr"><QrCode size={128} /></div>
          <strong>Mensalidade Agosto</strong>
          <span>R$ 250,00</span>
          <button className="primary-action full" onClick={copyPaymentLink} aria-label="Copiar link demonstrativo de pagamento Solana Pay">
            <CopyCheck size={18} /> {copied ? 'Link copiado' : 'Copiar link de pagamento'}
          </button>
          <small className="demo-helper" role="status" aria-live="polite">
            {copied ? 'Link demonstrativo copiado para a área de transferência.' : 'Link mockado para apresentar a experiência de arrecadação.'}
          </small>
        </div>
        <div className="panel">
          <h3>Experiência Web3 invisível</h3>
          <p>O membro paga como em um aplicativo financeiro comum. O CaixaUni apresenta o QR Code e registra a entrada na tesouraria.</p>
          <div className="info-box"><QrCode size={18} /> Solana Pay é complementar. A regra central do MVP continua sendo Squads multisig.</div>
        </div>
      </div>
    </section>
  );
}

export default Contribute;
