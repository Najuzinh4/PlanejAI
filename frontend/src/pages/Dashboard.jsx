import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/planos">Meus Planos</Link></li>
          <li><Link to="/subjects">Adicionar Disciplina</Link></li>
          <li><Link to="/cronograma">Gerar Cronograma (IA)</Link></li>
        </ul>
      </nav>
    </div>
  );
}
