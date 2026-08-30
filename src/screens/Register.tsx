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
  const [password, setPassword] = useState('caixauni-demo');
  const [role, setRole] = useState<User['role']>('Gestor');
  const [error, setError] = useState('');

  const submitRegistration = () => {
    if (!name.trim()) {
      setError('Informe o nome do usuário.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Informe um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setError('A senha da demo precisa ter pelo menos 6 caracteres.');
      return;
    }

    setError('');
    onRegister({ name: name.trim(), email: email.trim(), role });
  };

  return (
    <section className="center-page page-enter">
      <div className="auth-card register-card">
        <span className="eyebrow">Primeiro acesso</span>
        <h2>Criar conta</h2>
        <p>Cadastre um usuário da organização. Nesta etapa, os dados ficam em modo demonstrativo local.</p>
        <label>Nome<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
        <label>E-mail<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label>
        <label>Senha<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} required /></label>
        <label>
          Papel inicial
          <select value={role} onChange={(event) => setRole(event.target.value as User['role'])}>
            <option value="Membro">Membro</option>
            <option value="Gestor">Gestor</option>
            <option value="Aprovador">Aprovador</option>
          </select>
        </label>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="info-box"><Users size={18} /> O papel define se a pessoa consulta, cria solicitações ou aprova despesas.</div>
        <button className="primary-action full" onClick={submitRegistration}>Criar conta</button>
        <button className="text-action" onClick={onLogin}>Já tenho conta. Entrar</button>
      </div>
    </section>
  );
}

export default Register;
