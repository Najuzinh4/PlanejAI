import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email || !senha) return;
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', data.access_token);
      const planos = await api.get('/planos');
      const hasPlan = Array.isArray(planos.data) && planos.data.length > 0;
      navigate(hasPlan ? '/dashboard' : '/plans/new');
    } catch (e) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 transform -translate-y-8 md:-translate-y-12 lg:-translate-y-16">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="mb-4 text-2xl font-semibold">Entrar</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <input className="w-full rounded-md border px-3 py-2" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full rounded-md border px-3 py-2" placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />

          <button className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50 w-full justify-center" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

          <div className="mt-4 text-sm text-gray-700">Não tem conta? <Link className="text-blue-600 hover:underline" to="/signup">Criar conta</Link></div>
        </form>
      </div>
    </div>
  );
}

