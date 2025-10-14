import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      localStorage.setItem('token', 'mock-token');
      navigate('/dashboard');
    }
  };

  return (
    <div className="container py-6">
      <h2 className="mb-4 text-2xl font-semibold">Login</h2>
      <div className="space-y-3 max-w-sm">
        <input className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
      </div>
      <button className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white" onClick={handleLogin}>Entrar</button>
    </div>
  );
}