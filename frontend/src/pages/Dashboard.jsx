import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container py-6">
      <h2 className="mb-4 text-2xl font-semibold">Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li><Link className="text-blue-600 hover:underline" to="/planos">Meus Planos</Link></li>
          <li><Link className="text-blue-600 hover:underline" to="/subjects">Adicionar Disciplina</Link></li>
          <li><Link className="text-blue-600 hover:underline" to="/cronograma">Gerar Cronograma (IA)</Link></li>
        </ul>
      </nav>
    </div>
  );
}