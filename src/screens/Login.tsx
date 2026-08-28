type LoginProps = {
  onLogin: () => void;
  onRegister: () => void;
};

function Login({ onLogin, onRegister }: LoginProps) {
  return (
    <section className="center-page page-enter">
      <div className="auth-card">
        <span className="eyebrow">Acesso do protótipo</span>
        <h2>Entrar no CaixaUni</h2>
        <p>Use a jornada fake para demonstrar uma experiência Web3 invisível.</p>
        <label>E-mail<input defaultValue="ana@formatura2027.com" type="email" /></label>
        <label>Senha<input defaultValue="caixauni-demo" type="password" /></label>
        <button className="primary-action full" onClick={onLogin}>Entrar</button>
        <button className="text-action" onClick={onRegister}>Ainda não tenho conta. Criar cadastro</button>
      </div>
    </section>
  );
}

export default Login;
