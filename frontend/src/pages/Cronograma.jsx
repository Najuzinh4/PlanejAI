import React, { useState } from 'react';
import api from '../services/api';

export default function Cronograma() {
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState(6);
  const [difficulty, setDifficulty] = useState('média');
  const [goal, setGoal] = useState('');
  const [weeks, setWeeks] = useState(4);
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div>
      <h2>Gerar Cronograma</h2>
      <input placeholder="Disciplina" value={subject} onChange={e => setSubject(e.target.value)} />
      <input placeholder="Horas/semana" type="number" value={hours} onChange={e => setHours(e.target.value)} />
      <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="baixa">baixa</option>
        <option value="média">média</option>
        <option value="alta">alta</option>
      </select>
      <input placeholder="Objetivo (opcional)" value={goal} onChange={e => setGoal(e.target.value)} />
      <input placeholder="Semanas (opcional)" type="number" value={weeks} onChange={e => setWeeks(e.target.value)} />
      <button onClick={generate} disabled={loading || !subject}> {loading ? 'Gerando...' : 'Gerar'} </button>

      {plan && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12, marginTop: 16 }}>
          {plan}
        </pre>
      )}
    </div>
  )
}

