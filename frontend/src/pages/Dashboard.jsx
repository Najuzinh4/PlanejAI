import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container py-6">
      <h2 className="mb-4 text-2xl font-semibold">Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li><Link className="text-blue-600 hover:underline" to="/planos">Meus Planos</Link></li>
          <li><Link className="text-blue-600 hover:underline" to="/plans/new">Novo Plano</Link></li>
          <li><Link className="text-blue-600 hover:underline" to="/subjects">Disciplinas</Link></li>
        </ul>
      </nav>
    </div>
  );
}
