import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !senha) return;
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (e) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="container py-6">
      <h2 className="mb-4 text-2xl font-semibold">Login</h2>
      <div className="space-y-3 max-w-sm">
        <input className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Senha" type="password" onChange={e => setSenha(e.target.value)} />
      </div>
      <button className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white" onClick={handleLogin}>Entrar</button>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}
