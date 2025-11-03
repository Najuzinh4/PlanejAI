import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TasksCard from '../components/TasksCard';

function Progress({ percent }) {
  return (
    <div className="h-2 w-full rounded bg-gray-200">
      <div className="h-2 rounded bg-blue-600" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
    </div>
  );
}

export default function Dashboard() {
  const [list, setList] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/planos');
        setList(data || []);
        if ((data || []).length > 0) {
          const id = data[0].id; // pega o primeiro por simplicidade
          const d = await api.get(`/planos/${id}`);
          setDetail(d.data);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const itens = detail?.itens || [];
    const total = itens.length;
    const done = itens.filter(i => !!i.data_fim).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [detail]);

  const toggle = async (itemId) => {
    try { await api.patch(`/planos/items/${itemId}/toggle`); const id = list[0]?.id; if (id) { const d = await api.get(`/planos/${id}`); setDetail(d.data); } } catch {}
  };

  if (loading) return <div className="container py-6">Carregando...</div>;

  if (list.length === 0) {
    return (
      <div className="container py-6">
        <h2 className="mb-4 text-2xl font-semibold">Bem-vindo!</h2>
        <p className="mb-4 text-gray-700">Você ainda não possui planos. Crie o seu primeiro para começar.</p>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white" onClick={() => navigate('/plans/new')}>Criar Plano</button>
      </div>
    );
  }

  const preview = (detail?.itens || []).sort((a,b) => (a.data_fim?1:0)-(b.data_fim?1:0)).slice(0,6);

  return (
    <div className="container py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <Link className="text-blue-600 hover:underline" to="/plans/new">Novo Plano</Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border bg-white p-4">
          <h3 className="mb-2 text-lg font-semibold">Plano atual</h3>
          <div className="mb-2 text-sm text-gray-700">{detail?.topico || 'Sem título'} • {detail?.periodo || 'sem período'}</div>
          <div className="mb-2 text-sm text-gray-700">Progresso: {stats.done}/{stats.total} ({stats.percent}%)</div>
          <Progress percent={stats.percent} />
          <div className="mt-3 flex gap-2">
            <Link className="rounded-md border px-3 py-2" to={`/plans/${detail?.id_pe}`}>Ver cronograma</Link>
            <Link className="rounded-md border px-3 py-2" to="/planos">Todos os planos</Link>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-4">
          <h3 className="mb-2 text-lg font-semibold">Tarefas rápidas</h3>
          <TasksCard items={preview} onToggle={toggle} />
        </section>
      </div>
    </div>
  );
}

