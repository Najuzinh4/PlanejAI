import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError('');
    if (!nome || !email || !senha) {
      setError('Preencha nome, email e senha');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { nome, email, senha });
      if (data?.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/plans/new');
      } else {
        navigate('/login');
      }
    } catch (e) {
      setError('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6">
      <h2 className="mb-4 text-2xl font-semibold">Criar Conta</h2>
      <div className="space-y-3 max-w-sm">
        <input className="w-full rounded-md border px-3 py-2" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2" placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
      </div>
      <button className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={loading} onClick={handleSignup}>{loading ? 'Enviando...' : 'Criar conta'}</button>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <div className="mt-4 text-sm text-gray-700">Já tem conta? <Link className="text-blue-600 hover:underline" to="/login">Entrar</Link></div>
    </div>
  );
}
