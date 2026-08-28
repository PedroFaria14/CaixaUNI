import { CopyCheck, QrCode } from 'lucide-react';
import PageTitle from '../components/PageTitle';

function Contribute() {
  return (
    <section className="content-stack page-enter">
      <PageTitle eyebrow="Solana Pay" title="Contribuir para a tesouraria" description="Arrecadação complementar por QR Code para mensalidades, eventos e campanhas." />
      <div className="contribute-layout">
        <div className="panel qr-panel">
          <div className="fake-qr"><QrCode size={128} /></div>
          <strong>Mensalidade Agosto</strong>
          <span>R$ 250,00</span>
          <button className="primary-action full"><CopyCheck size={18} /> Copiar link de pagamento</button>
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
