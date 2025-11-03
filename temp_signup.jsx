import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const CTA = styled.button`
  display:flex; width:170px; align-items:center; justify-content:space-between; background:#1d2129; color:#fff; border:none; border-radius:40px; box-shadow:0 5px 10px #bebebe; cursor:pointer;
  .text{padding:10px 16px;}
  .icon-Container{width:45px;height:45px;background:#f59aff;display:flex;align-items:center;justify-content:center;border-radius:50%;border:3px solid #1d2129}
  .icon-Container svg{transition-duration:1.5s}
  &:hover .icon-Container svg{animation:arrow 1s linear infinite}
  @keyframes arrow{0%{opacity:0;margin-left:0}100%{opacity:1;margin-left:10px}}
`;

export default function Signup() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError('');
    if (!nome || !email || !senha) { setError('Preencha nome, email e senha'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { nome, email, senha });
      if (data?.access_token) {
        localStorage.setItem('token', data.access_token);
        setDone(true);
      } else {
        navigate('/login');
      }
    } catch (e) { setError('Erro ao criar conta'); }
    finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="container py-6">
        <h2 className="mb-2 text-2xl font-semibold">Conta criada!</h2>
        <p className="mb-4 text-gray-700">Vamos criar seu primeiro plano.</p>
        <CTA onClick={() => navigate('/plans/new')}>
          <span className="text">let's go!</span>
          <span className="icon-Container">
            <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="1.61321" cy="1.61321" r="1.5" fill="black" />
              <circle cx="5.73583" cy="1.61321" r="1.5" fill="black" />
              <circle cx="5.73583" cy="5.5566" r="1.5" fill="black" />
              <circle cx="9.85851" cy="5.5566" r="1.5" fill="black" />
              <circle cx="9.85851" cy="9.5" r="1.5" fill="black" />
              <circle cx="13.9811" cy="9.5" r="1.5" fill="black" />
              <circle cx="5.73583" cy="13.4434" r="1.5" fill="black" />
              <circle cx="9.85851" cy="13.4434" r="1.5" fill="black" />
              <circle cx="1.61321" cy="17.3868" r="1.5" fill="black" />
              <circle cx="5.73583" cy="17.3868" r="1.5" fill="black" />
            </svg>
          </span>
        </CTA>
      </div>
    );
  }

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

