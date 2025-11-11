import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import PrimaryButton from "../components/PrimaryButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState({ topico: "", periodo: "", tempo: "" });
  const [msg, setMsg] = useState("");
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [locked, setLocked] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const stats = useMemo(() => {
    const itens = plan?.itens || [];
    const total = itens.length;
    const done = itens.filter((i) => !!i.data_fim).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const totalHoras = itens.reduce((acc, i) => acc + (Number(i.temp) || 0), 0);
    const concluidasHoras = itens
      .filter((i) => !!i.data_fim)
      .reduce((acc, i) => acc + (Number(i.temp) || 0), 0);
    // Horas planejadas = (h/semana) * semanas (ou meses*4)
    let plannedWeeks = 0;
    const per = String(plan?.periodo || "").toLowerCase();
    const mSem = per.match(/(\d+)\s*semana/);
    const mMes = per.match(/(\d+)\s*mes/);
    if (mSem && mSem[1]) plannedWeeks = parseInt(mSem[1], 10);
    else if (mMes && mMes[1]) plannedWeeks = parseInt(mMes[1], 10) * 4;
    const plannedHoras = (Number(plan?.tempo) || 0) * plannedWeeks;
    return { total, done, percent, totalHoras, concluidasHoras, plannedHoras, plannedWeeks };
  }, [plan]);

  // Agrupa por semana a partir da descrição ("Semana N — ..." ou "Hoje — ...")
  const grouped = useMemo(() => {
    const raw = plan?.itens || [];
    const items = showOnlyPending ? raw.filter((i) => !i.data_fim) : raw;
    const map = new Map();
    const getGroup = (desc) => {
      const s = String(desc || "").toLowerCase();
      const w = s.match(/semana\s*(\d+)/i);
      if (w && w[1]) return `Semana ${parseInt(w[1], 10)}`;
      if (s.startsWith("hoje")) return "Hoje";
      return "Outros";
    };
    for (const it of items) {
      const key = getGroup(it.descricao);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    const keys = Array.from(map.keys());
    keys.sort((a, b) => {
      if (a === "Hoje") return -1;
      if (b === "Hoje") return 1;
      const ra = a.match(/Semana\s*(\d+)/);
      const rb = b.match(/Semana\s*(\d+)/);
      if (ra && rb) return parseInt(ra[1], 10) - parseInt(rb[1], 10);
      if (ra) return -1;
      if (rb) return 1;
      return a.localeCompare(b);
    });
    return keys.map((k) => ({ title: k === "Outros" ? null : k, items: map.get(k) }));
  }, [plan, showOnlyPending]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/planos/${id}`);
      setPlan(data);
      setEdit({ topico: data.topico || "", periodo: data.periodo || "", tempo: data.tempo || "" });
    } catch (e) {
      setMsg("Erro ao carregar plano");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async () => {
    try {
      await api.put(`/planos/${id}`, { topico: edit.topico, periodo: edit.periodo, tempo: Number(edit.tempo) });
      await load();
      setMsg("Plano atualizado");
    } catch (e) {
      setMsg("Erro ao atualizar plano");
    }
  };

  const duplicate = async () => {
    try {
      const { data } = await api.post(`/planos/${id}/duplicate`);
      navigate(`/plans/${data.id_pe}`);
    } catch (e) {
      setMsg("Erro ao duplicar");
    }
  };

  const remove = async () => {
    if (!confirm("Excluir plano?")) return;
    try {
      await api.delete(`/planos/${id}`);
      navigate("/planos");
    } catch (e) {
      setMsg("Erro ao excluir");
    }
  };

  const toggleItem = async (itemId) => {
    try {
      await api.patch(`/planos/items/${itemId}/toggle`);
      await load();
    } catch {}
  };

  const updateItem = async (itemId, fields) => {
    try {
      await api.put(`/planos/items/${itemId}`, fields);
      await load();
    } catch {}
  };

  const deleteItem = async (itemId) => {
    if (!confirm("Remover esta tarefa?")) return;
    try {
      await api.delete(`/planos/items/${itemId}`);
      await load();
    } catch {}
  };

  const toggleSelect = (itemId) => {
    setSelectedIds((cur) => (cur.includes(itemId) ? cur.filter((x) => x !== itemId) : [...cur, itemId]));
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Excluir ${selectedIds.length} tarefa(s)?`)) return;
    try {
      for (const itemId of selectedIds) {
        await api.delete(`/planos/items/${itemId}`);
      }
      setSelectedIds([]);
      await load();
    } catch {}
  };

  if (loading) return <div className="container py-6">Carregando...</div>;
  if (!plan) return <div className="container py-6">Plano não encontrado</div>;

  return (
    <div className="container py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Plano: {plan.topico || "Sem título"}</h2>
        <div className="flex items-center gap-2">
          <EditButton onClick={() => setLocked(!locked)} expanded={!locked} />
          <PrimaryButton onClick={duplicate}>Duplicar</PrimaryButton>
          <DeleteButton onClick={remove} />
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
          <div className="text-xl font-semibold">
            {stats.done} ({stats.percent}%)
          </div>
        </div>
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="text-sm text-gray-600">Horas planejadas</div>
          <div className="text-xl font-semibold">{stats.plannedHoras}</div>
        </div>
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="text-sm text-gray-600">Horas concluídas</div>
          <div className="text-xl font-semibold">{stats.concluidasHoras}</div>
        </div>
      </div>

      <div className="mb-4 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          disabled={locked}
          className={`rounded-md border px-3 py-2 ${locked ? "opacity-60" : ""}`}
          placeholder="Tópico"
          value={edit.topico}
          onChange={(e) => setEdit({ ...edit, topico: e.target.value })}
        />
        <input
          disabled={locked}
          className={`rounded-md border px-3 py-2 ${locked ? "opacity-60" : ""}`}
          placeholder="Período"
          value={edit.periodo}
          onChange={(e) => setEdit({ ...edit, periodo: e.target.value })}
        />
        <input
          disabled={locked}
          className={`rounded-md border px-3 py-2 ${locked ? "opacity-60" : ""}`}
          placeholder="Tempo (h/sem)"
          type="number"
          value={edit.tempo}
          onChange={(e) => setEdit({ ...edit, tempo: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-3">
        <PrimaryButton onClick={async () => { await save(); setLocked(true); }} disabled={locked}>
          Salvar
        </PrimaryButton>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showOnlyPending}
            onChange={(e) => setShowOnlyPending(e.target.checked)}
          />
          Mostrar só pendentes
        </label>
      </div>
      {!locked && (
        <div className="mt-2 flex items-center gap-2">
          <button
            className="rounded-md border px-3 py-2 text-red-600 disabled:opacity-50"
            disabled={!selectedIds.length}
            onClick={deleteSelected}
          >
            Excluir selecionadas {selectedIds.length ? `(${selectedIds.length})` : ""}
          </button>
          {!!selectedIds.length && (
            <button className="text-sm text-gray-600" onClick={() => setSelectedIds([])}>
              Limpar seleção
            </button>
          )}
        </div>
      )}
      {msg && <div className="mt-2 text-sm text-gray-700">{msg}</div>}

      <h3 className="mt-6 mb-2 text-lg font-semibold">Itens</h3>
      {grouped.length === 0 && <div className="text-sm text-gray-600">Sem itens.</div>}
      <div className="space-y-4">
        {grouped.map((grp, gi) => (
          <section key={gi} className="rounded-md border bg-white p-3">
            {grp.title && <h4 className="mb-2 font-medium">{grp.title}</h4>}
            <ul className="space-y-2">
              {grp.items.map((it) => (
                <li key={it.id_item_do_plano} className="rounded-md border p-3">
                  <div className="flex items-start gap-3">
                    {locked ? (
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={!!it.data_fim}
                        onChange={() => toggleItem(it.id_item_do_plano)}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selectedIds.includes(it.id_item_do_plano)}
                        onChange={() => toggleSelect(it.id_item_do_plano)}
                      />
                    )}
                    <div className="flex-1">
                      <div className="mb-2 whitespace-pre-wrap text-sm">{it.descricao}</div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <label className="flex items-center gap-2">
                          <span className="text-gray-600">Início</span>
                          <input
                            type="date"
                            className="rounded-md border px-2 py-1"
                            value={it.data_inicio || ""}
                            onChange={(e) => updateItem(it.id_item_do_plano, { data_inicio: e.target.value })}
                          />
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="text-gray-600">Horas</span>
                          <input
                            type="number"
                            min="0"
                            className="w-20 rounded-md border px-2 py-1"
                            value={it.temp ?? ""}
                            onChange={(e) => updateItem(it.id_item_do_plano, { temp: Number(e.target.value) })}
                          />
                        </label>
                        <button
                          className="ml-2 rounded-md border px-2 py-1 text-xs text-red-600"
                          onClick={() => deleteItem(it.id_item_do_plano)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
