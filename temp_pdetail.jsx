import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState({ topico: '', periodo: '', tempo: '' });
  const [msg, setMsg] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const stats = useMemo(() => {
    const itens = plan?.itens || [];
    const total = itens.length;
    const done = itens.filter(i => !!i.data_fim).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const totalHoras = itens.reduce((acc, i) => acc + (Number(i.temp) || 0), 0);
    const concluidasHoras = itens.filter(i => !!i.data_fim).reduce((acc, i) => acc + (Number(i.temp) || 0), 0);
    return { total, done, percent, totalHoras, concluidasHoras };
  }, [plan]);

  const filteredItems = useMemo(() => {
    const itens = plan?.itens || [];
    const arr = showOnlyPending ? itens.filter(i => !i.data_fim) : itens;
    // sort: pending first, then by data_inicio if exists
    return [...arr].sort((a, b) => {
      const av = a.data_fim ? 1 : 0;
      const bv = b.data_fim ? 1 : 0;
      if (av !== bv) return av - bv;
      return String(a.data_inicio || '') > String(b.data_inicio || '') ? 1 : -1;
    });
  }, [plan, showOnlyPending]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/planos/${id}`);
      setPlan(data);
      setEdit({ topico: data.topico || '', periodo: data.periodo || '', tempo: data.tempo || '' });
    } catch (e) {
      setMsg('Erro ao carregar plano');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const save = async () => {
    try {
      await api.put(`/planos/${id}`, { topico: edit.topico, periodo: edit.periodo, tempo: Number(edit.tempo) });
      await load();
      setMsg('Plano atualizado');
    } catch (e) {
      setMsg('Erro ao atualizar plano');
    }
  };

  const duplicate = async () => {
    try {
      const { data } = await api.post(`/planos/${id}/duplicate`);
      navigate(`/plans/${data.id_pe}`);
    } catch (e) {
      setMsg('Erro ao duplicar');
    }
  };

  const remove = async () => {
    if (!confirm('Excluir plano?')) return;
    try {
      await api.delete(`/planos/${id}`);
      navigate('/planos');
    } catch (e) {
      setMsg('Erro ao excluir');
    }
  };

  const toggleItem = async (itemId) => {
    try {
      await api.patch(`/planos/items/${itemId}/toggle`);
      await load();
    } catch (e) { /* noop */ }
  };

  const updateItem = async (itemId, fields) => {
    try {
      await api.put(`/planos/items/${itemId}`, fields);
      await load();
    } catch (e) { /* noop */ }
  };

  if (loading) return <div className="container py-6">Carregando...</div>;
  if (!plan) return <div className="container py-6">Plano não encontrado</div>;

  return (
    <div className="container py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Plano: {plan.topico || 'Sem título'}</h2>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-2" onClick={duplicate}>Duplicar</button>
          <button className="rounded-md border px-3 py-2 text-red-600" onClick={remove}>Excluir</button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="text-sm text-gray-600">Total tarefas</div>
          <div className="text-xl font-semibold">{stats.total}</div>
        </div>
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="text-sm text-gray-600">Concluídas</div>
          <div className="text-xl font-semibold">{stats.done} ({stats.percent}%)</div>
        </div>
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="text-sm text-gray-600">Horas totais</div>
          <div className="text-xl font-semibold">{stats.totalHoras}</div>
        </div>
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="text-sm text-gray-600">Horas concluídas</div>
          <div className="text-xl font-semibold">{stats.concluidasHoras}</div>
        </div>
      </div>

      <div className="mb-4 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-3">
        <input className="rounded-md border px-3 py-2" placeholder="Tópico" value={edit.topico} onChange={e => setEdit({ ...edit, topico: e.target.value })} />
        <input className="rounded-md border px-3 py-2" placeholder="Período" value={edit.periodo} onChange={e => setEdit({ ...edit, periodo: e.target.value })} />
        <input className="rounded-md border px-3 py-2" placeholder="Tempo (h/sem)" type="number" value={edit.tempo} onChange={e => setEdit({ ...edit, tempo: e.target.value })} />
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white" onClick={save}>Salvar</button>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={showOnlyPending} onChange={e => setShowOnlyPending(e.target.checked)} /> Mostrar só pendentes
        </label>
      </div>
      {msg && <div className="mt-2 text-sm text-gray-700">{msg}</div>}

      <h3 className="mt-6 mb-2 text-lg font-semibold">Itens</h3>
      <ul className="space-y-2">
        {filteredItems.map((it) => (
          <li key={it.id_item_do_plano} className="flex items-center justify-between rounded-md border bg-white p-3">
            <div className="flex flex-1 items-start gap-3">
              <input type="checkbox" className="mt-2" checked={!!it.data_fim} onChange={() => toggleItem(it.id_item_do_plano)} />
              <div className="flex-1">
                <input className="mb-2 w-full rounded-md border px-2 py-1" value={it.descricao} onChange={e => updateItem(it.id_item_do_plano, { descricao: e.target.value })} />
                <div className="flex gap-2 text-sm">
                  <label className="flex items-center gap-2">
                    <span className="text-gray-600">Início</span>
                    <input type="date" className="rounded-md border px-2 py-1" value={it.data_inicio || ''} onChange={e => updateItem(it.id_item_do_plano, { data_inicio: e.target.value })} />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-gray-600">Horas</span>
                    <input type="number" min="0" className="w-20 rounded-md border px-2 py-1" value={it.temp ?? ''} onChange={e => updateItem(it.id_item_do_plano, { temp: Number(e.target.value) })} />
                  </label>
                </div>
              </div>
            </div>
          </li>
        ))}
        {filteredItems.length === 0 && <li className="text-sm text-gray-600">Sem itens.</li>}
      </ul>
    </div>
  );
}

