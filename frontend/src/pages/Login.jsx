import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Mock auth; replace with real API later
    if (email && password) {
      localStorage.setItem('token', 'mock-token');
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

