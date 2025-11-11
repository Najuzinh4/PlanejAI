import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../services/api";
import EditButton from "../components/EditButton";

export default function Planos() {
  const [planos, setPlanos] = useState([]);
  const [locked, setLocked] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    api.get("/planos").then((res) => setPlanos(res.data));
  }, []);

  const reload = async () => {
    const { data } = await api.get("/planos");
    setPlanos(data || []);
  };

  const toggleSelect = (id) => {
    setSelectedIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Excluir ${selectedIds.length} plano(s)?`)) return;
    for (const id of selectedIds) {
      try { await api.delete(`/planos/${id}`); } catch {}
    }
    setSelectedIds([]);
    await reload();
  };

  return (
    <div className="container py-6">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus Planos</h1>
        <div className="flex items-center gap-2">
          <EditButton onClick={() => setLocked(!locked)} expanded={!locked} />
          <Link className="text-blue-600 hover:underline" to="/plans/new">Novo Plano</Link>
        </div>
      </div>
      {!locked && (
        <div className="mb-4 flex items-center gap-2">
          <button className="rounded-md border px-3 py-2 text-red-600 disabled:opacity-50" disabled={!selectedIds.length} onClick={deleteSelected}>
            Excluir selecionados {selectedIds.length ? `(${selectedIds.length})` : ''}
          </button>
          {!!selectedIds.length && (
            <button className="text-sm text-gray-600" onClick={() => setSelectedIds([])}>Limpar seleção</button>
          )}
        </div>
      )}
      <ul className="space-y-2">
        {planos.map((plano) => (
          <li key={plano.id} className="rounded-md border bg-white p-3">
            <div className="flex items-start gap-3">
              {!locked && (
                <input type="checkbox" className="mt-1" checked={selectedIds.includes(plano.id)} onChange={() => toggleSelect(plano.id)} />
              )}
              <div className="flex-1">
                {locked ? (
                  <Link to={`/plans/${plano.id}`} className="block">
                    <div className="font-medium">{plano.titulo}</div>
                    <div className="text-sm text-gray-600">{plano.descricao}</div>
                  </Link>
                ) : (
                  <div>
                    <div className="font-medium">{plano.titulo}</div>
                    <div className="text-sm text-gray-600">{plano.descricao}</div>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
        {planos.length === 0 && (
          <li className="text-sm text-gray-600">Nenhum plano encontrado.</li>
        )}
      </ul>
    </div>
  );
}
