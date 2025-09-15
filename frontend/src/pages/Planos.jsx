import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Planos() {
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    api.get("/planos").then((res) => {
      setPlanos(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Meus Planos</h1>
      <ul>
        {planos.map((plano) => (
          <li key={plano.id}>{plano.titulo} - {plano.descricao}</li>
        ))}
      </ul>
    </div>
  );
}
