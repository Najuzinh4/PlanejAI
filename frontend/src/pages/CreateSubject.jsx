import { useState } from 'react';
import api from "../services/api";

export default function CreateSubject() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");
  const [difficulty, setDifficulty] = useState('medium');
  const [msg, setMsg] = useState('');

  const submit = async () => {
    try {
      const { data } = await api.post('/subjects', {
        name,
        hours_per_week: Number(hours),
        difficulty,
      });
      setMsg(data.message || 'Adicionado com sucesso');
      setName('');
      setHours('');
      setDifficulty('medium');
    } catch (e) {
      setMsg('Erro ao adicionar disciplina');
    }
  };

  return (
    <div className="container py-6">
      <h2 className="mb-4 text-2xl font-semibold">Adicionar Disciplina</h2>
      <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Nome da disciplina" value={name} onChange={e => setName(e.target.value)} />
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Horas por semana" type="number" value={hours} onChange={e => setHours(e.target.value)} />
        <select className="rounded-md border border-gray-300 px-3 py-2" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="low">baixa</option>
          <option value="medium">média</option>
          <option value="high">alta</option>
        </select>
      </div>
      <button className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white" onClick={submit}>Adicionar</button>
      {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
    </div>
  )
}