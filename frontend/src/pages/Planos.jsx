import React, { useEffect, useState } from 'react';
import api from "../services/api";

export default function Planos() {
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    api.get("/planos").then((res) => setPlanos(res.data));
  }, []);

  return (
    <div className="container py-6">
      <h1 className="mb-4 text-2xl font-semibold">Meus Planos</h1>
      <ul className="space-y-2">
        {planos.map((plano) => (
          <li key={plano.id} className="rounded-md border bg-white p-3">
            <div className="font-medium">{plano.titulo}</div>
            <div className="text-sm text-gray-600">{plano.descricao}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
