import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const StyledWrapper = styled.div`
  .form { display:flex; flex-direction:column; gap:10px; background:#ffffff; padding:30px; width:450px; border-radius:20px; }
  .flex-column > label { color:#151717; font-weight:600; }
  .inputForm { border:1.5px solid #ecedec; border-radius:10px; height:50px; display:flex; align-items:center; padding-left:10px; transition:0.2s ease-in-out; }
  .input { margin-left:10px; border-radius:10px; border:none; width:100%; height:100%; }
  .input:focus { outline:none; }
  .inputForm:focus-within { border:1.5px solid #2d79f3; }
  .button-submit { margin: 20px 0 10px 0; background:#151717; border:none; color:white; font-size:15px; font-weight:500; border-radius:10px; height:50px; width:100%; cursor:pointer; }
  .error { margin-top:8px; color:#dc2626; font-size:14px; }
`;

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 transform -translate-y-8 md:-translate-y-12 lg:-translate-y-16">
      <StyledWrapper>
        <form className="form" onSubmit={handleLogin}>
          <div className="flex-column"><label>Email</label></div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 32 32" height={20}><g data-name="Layer 3" id="Layer_3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></g></svg>
            <input placeholder="Digite seu email" className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="flex-column"><label>Senha</label></div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="-64 0 512 512" height={20}><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>
            <input placeholder="Digite sua senha" className="input" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
          </div>

          <button className="button-submit" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          {error && <div className="error">{error}</div>}

          <p className="p">Não tem conta? <Link className="span" to="/signup">Criar conta</Link></p>
        </form>
      </StyledWrapper>
    </div>
  );
}

