import React from 'react';
import api from '../services/api';

export default function Cronograma() {
  const [subject, setSubject] = React.useState('');
  const [hours, setHours] = React.useState(6);
  const [difficulty, setDifficulty] = React.useState('media');
  const [goal, setGoal] = React.useState('');
  const [weeks, setWeeks] = React.useState(4);
  const [plan, setPlan] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/generate-plan', {
        subject,
        hours_per_week: Number(hours),
        difficulty,
        goal,
        timeframe_weeks: Number(weeks)
      });
      setPlan(data.plan || '');
    } catch (e) {
      setPlan('Erro ao gerar plano.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-6">
      <h2 className="mb-4 text-2xl font-semibold">Gerar Cronograma</h2>

      <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Disciplina" value={subject} onChange={e => setSubject(e.target.value)} />
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Horas/semana" type="number" value={hours} onChange={e => setHours(e.target.value)} />
        <select className="rounded-md border border-gray-300 px-3 py-2" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="baixa">baixa</option>
          <option value="media">média</option>
          <option value="alta">alta</option>
        </select>
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Objetivo (opcional)" value={goal} onChange={e => setGoal(e.target.value)} />
        <input className="rounded-md border border-gray-300 px-3 py-2" placeholder="Semanas (opcional)" type="number" value={weeks} onChange={e => setWeeks(e.target.value)} />
      </div>

      <button className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50" onClick={generate} disabled={loading || !subject}> {loading ? 'Gerando...' : 'Gerar'} </button>

      {plan && (
        <pre className="mt-4 whitespace-pre-wrap rounded-md bg-white p-4 text-sm">
          {plan}
        </pre>
      )}
    </div>
  )
}