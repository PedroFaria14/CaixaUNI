import { useState } from 'react';
import { Users } from 'lucide-react';
import type { User } from '../types';

type RegisterProps = {
  onRegister: (user: User) => void;
  onLogin: () => void;
};

function Register({ onRegister, onLogin }: RegisterProps) {
  const [name, setName] = useState('Pedro Almeida');
  const [email, setEmail] = useState('pedro@formatura2027.com');
  const [role, setRole] = useState<User['role']>('Gestor');

  const submitRegistration = () => {
    onRegister({ name, email, role });
  };

  return (
    <section className="center-page page-enter">
      <div className="auth-card register-card">
        <span className="eyebrow">Primeiro acesso</span>
        <h2>Criar conta</h2>
        <p>Cadastre um usuário da organização. Nesta etapa, tudo continua mockado para a demo.</p>
        <label>Nome<input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label>E-mail<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" /></label>
        <label>Senha<input defaultValue="caixauni-demo" type="password" /></label>
        <label>
          Papel inicial
          <select value={role} onChange={(event) => setRole(event.target.value as User['role'])}>
            <option value="Membro">Membro</option>
            <option value="Gestor">Gestor</option>
            <option value="Aprovador">Aprovador</option>
          </select>
        </label>
        <div className="info-box"><Users size={18} /> O papel define se a pessoa consulta, cria solicitações ou aprova despesas.</div>
        <button className="primary-action full" onClick={submitRegistration}>Criar conta</button>
        <button className="text-action" onClick={onLogin}>Já tenho conta. Entrar</button>
      </div>
    </section>
  );
}

export default Register;
