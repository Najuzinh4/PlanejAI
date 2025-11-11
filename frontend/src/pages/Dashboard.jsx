import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import TasksCard from "../components/TasksCard";
import Loader from "../components/Loader";

function Progress({ percent }) {
  const p = Math.min(100, Math.max(0, Number(percent) || 0));
  return (
    <div className="h-2 w-full rounded bg-gray-200">
      <div className="h-2 rounded bg-blue-600" style={{ width: `${p}%` }} />
    </div>
  );
}

export default function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load plans and pick latest by default
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/planos");
        const arr = Array.isArray(data) ? data : [];
        setPlans(arr);
        if (arr.length > 0) {
          const latest = [...arr].sort((a, b) => b.id - a.id)[0];
          setCurrentId(latest.id);
          const d = await api.get(`/planos/${latest.id}`);
          setDetail(d.data);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // When selector changes, load that plan
  const onSelectPlan = async (id) => {
    setCurrentId(id);
    setLoading(true);
    try {
      const d = await api.get(`/planos/${id}`);
      setDetail(d.data);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const itens = detail?.itens || [];
    const total = itens.length;
    const done = itens.filter((i) => !!i.data_fim).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [detail]);

  const toggle = async (itemId) => {
    try {
      await api.patch(`/planos/items/${itemId}/toggle`);
      if (currentId) {
        const d = await api.get(`/planos/${currentId}`);
        setDetail(d.data);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="container py-6 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="container py-6">
        <h2 className="mb-2 text-2xl font-semibold">Bem‑vindo!</h2>
        <p className="mb-4 text-gray-700">
          Você ainda não possui planos. Crie o seu primeiro para começar.
        </p>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
          onClick={() => navigate("/plans/new")}
        >
          Criar Plano
        </button>
      </div>
    );
  }

  const upcoming = (detail?.itens || [])
    .filter((i) => !i.data_fim)
    .slice(0, 6);

  const others = plans
    .slice(0, 6)
    .map((p) => ({ id: p.id, titulo: p.titulo, descricao: p.descricao }));

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <select
            value={currentId || ""}
            onChange={(e) => onSelectPlan(Number(e.target.value))}
            className="rounded-md border bg-white px-3 py-2 text-sm"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titulo} {p.descricao ? `— ${p.descricao}` : ""}
              </option>
            ))}
          </select>
          <Link className="rounded-md border px-3 py-2 text-sm" to="/plans/new">
            Novo Plano
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Current Plan */}
        <section className="rounded-lg border bg-white p-4 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Plano atual</h3>
            {detail?.id_pe && (
              <Link className="text-sm text-blue-600 hover:underline" to={`/plans/${detail.id_pe}`}>
                Ver cronograma
              </Link>
            )}
          </div>
          <div className="mb-1 text-sm text-gray-700">
            {detail?.topico || "Sem título"} — {detail?.periodo || "sem período"}
          </div>
          <div className="mb-2 text-sm text-gray-700">
            Progresso: {stats.done}/{stats.total} ({stats.percent}%)
          </div>
          <Progress percent={stats.percent} />
        </section>

        {/* Upcoming tasks */}
        <section className="rounded-lg border bg-white p-4 lg:col-span-2">
          <h3 className="mb-2 text-lg font-semibold">Próximas tarefas</h3>
          <TasksCard items={upcoming} onToggle={toggle} />
        </section>

        {/* Your plans */}
        <section className="rounded-lg border bg-white p-4">
          <h3 className="mb-2 text-lg font-semibold">Seus planos</h3>
          <ul className="space-y-2">
            {others.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-md border p-2">
                <div>
                  <div className="text-sm font-medium">{p.titulo}</div>
                  {p.descricao && <div className="text-xs text-gray-600">{p.descricao}</div>}
                </div>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => onSelectPlan(p.id)}
                >
                  Abrir
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

