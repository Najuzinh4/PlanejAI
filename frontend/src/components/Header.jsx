import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Header({ full = false }) {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };
  const link = ({ isActive }) =>
    `px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600'}`;

  return (
    <header className="border-b bg-white">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-semibold">
          <img src="/planejai-icon.png" alt="PlanejAI" className="h-16 w-auto md:h-20 lg:h-24" />
        </Link>
        {full ? (
          <>
            <nav className="flex gap-2">
              <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
              <NavLink to="/planos" className={link}>Planos</NavLink>
              <NavLink to="/plans/new" className={link}>Novo Plano</NavLink>
            </nav>
            <button onClick={logout} className='text-sm text-gray-600 hover:text-blue-600'>Sair</button>
          </>
        ) : (
          // minimal header shows only the logo; keep space on the right to avoid layout shift
          <div />
        )}
      </div>
    </header>
  );
}
