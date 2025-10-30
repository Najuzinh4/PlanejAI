import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../services/api";

export default function Planos() {
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    api.get("/planos").then((res) => setPlanos(res.data));
  }, []);

  return (
    <div className="container py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus Planos</h1>
        <Link className="text-blue-600 hover:underline" to="/plans/new">Novo Plano</Link>
      </div>
      <ul className="space-y-2">
        {planos.map((plano) => (
          <li key={plano.id} className="rounded-md border bg-white p-3">
            <Link to={`/plans/${plano.id}`} className="block">
              <div className="font-medium">{plano.titulo}</div>
              <div className="text-sm text-gray-600">{plano.descricao}</div>
            </Link>
          </li>
        ))}
        {planos.length === 0 && <li className="text-sm text-gray-600">Nenhum plano encontrado.</li>}
      </ul>
    </div>
  );
}
