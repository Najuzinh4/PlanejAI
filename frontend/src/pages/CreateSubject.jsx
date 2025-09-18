import { useState } from 'react';

export default function CreateSubject() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");

  return (
    <div>
      <h2>Adicionar Disciplina</h2>
      <input placeholder="Nome da disciplina" onChange={e => setName(e.target.value)} />
      <input placeholder="Horas por semana" type="number" onChange={e => setHours(e.target.value)} />
      <button onClick={() => alert(`Adicionado ${name}, ${hours}h/semana`)}>Adicionar</button>
    </div>
  )
}

