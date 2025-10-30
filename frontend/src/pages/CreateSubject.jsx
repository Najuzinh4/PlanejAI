import { useEffect, useState } from 'react';
import api from "../services/api";

export default function CreateSubject() {
  const [nome, setNome] = useState("");
  const [horas, setHoras] = useState("");
  const [dificuldade, setDificuldade] = useState('media');
  const [msg, setMsg] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // id_disciplina em edição

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/subjects');
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setNome('');
    setHoras('');
    setDificuldade('media');
    setEditing(null);
  };

  const submit = async () => {
    setMsg('');
    try {
      if (editing) {
        await api.put(`/subjects/${editing}`, {
          nome,
          horas_por_semana: Number(horas),
          dificuldade,
        });
      } else {
        await api.post('/subjects', {
          nome,
          horas_por_semana: Number(horas),
          dificuldade,
        });
      }
      await load();
      resetForm();
      setMsg('Salvo com sucesso');
    } catch (e) {
      setMsg('Erro ao salvar disciplina');
    }
  };

  const onEdit = (item) => {
    setEditing(item.id_disciplina);
    setNome(item.nome);
    setHoras(String(item.horas_por_semana ?? ''));
    setDificuldade(item.dificuldade || 'media');
  };

  const onDelete = async (id) => {
    if (!confirm('Excluir disciplina?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      await load();
    } catch (e) {
      setMsg('Erro ao excluir');
    }
  };

  return (
    <div className="container py-6">
      <h2 className="mb-4 text-2xl font-semibold">Disciplinas</h2>

      <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Nome da disciplina" value={nome} onChange={e => setNome(e.target.value)} />
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Horas por semana" type="number" value={horas} onChange={e => setHoras(e.target.value)} />
        <select className="rounded-md border border-gray-300 px-3 py-2" value={dificuldade} onChange={e => setDificuldade(e.target.value)}>
          <option value="baixa">baixa</option>
          <option value="media">media</option>
          <option value="alta">alta</option>
        </select>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white" onClick={submit}>{editing ? 'Salvar alterações' : 'Adicionar'}</button>
        {editing && (
          <button className="inline-flex items-center rounded-md border px-4 py-2" onClick={resetForm}>Cancelar</button>
        )}
      </div>
      {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}

      <div className="mt-8">
        <h3 className="mb-2 text-lg font-semibold">Minhas Disciplinas</h3>
        {loading ? (
          <div className="text-sm text-gray-600">Carregando...</div>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id_disciplina} className="flex items-center justify-between rounded-md border bg-white p-3">
                <div>
                  <div className="font-medium">{it.nome}</div>
                  <div className="text-sm text-gray-600">{it.horas_por_semana}h/semana · {it.dificuldade}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:underline" onClick={() => onEdit(it)}>Editar</button>
                  <button className="text-red-600 hover:underline" onClick={() => onDelete(it.id_disciplina)}>Excluir</button>
                </div>
              </li>
            ))}
            {items.length === 0 && <li className="text-sm text-gray-600">Nenhuma disciplina cadastrada.</li>}
          </ul>
        )}
      </div>
    </div>
  )
}
