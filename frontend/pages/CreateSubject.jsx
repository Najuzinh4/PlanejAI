import { useState } from 'react';

export default function CreateSubject() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");

  return (
    <div>
      <h2>📘 Add Subject</h2>
      <input placeholder="Subject name" onChange={e => setName(e.target.value)} />
      <input placeholder="Hours per week" type="number" onChange={e => setHours(e.target.value)} />
      <button onClick={() => alert(`Added ${name}, ${hours}h/week`)}>Add</button>
    </div>
  )
