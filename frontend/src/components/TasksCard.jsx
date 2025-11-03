import React from 'react';

export default function TasksCard({ items = [], onToggle }) {
  const top = [...items]
    .sort((a, b) => (a && a.data_fim ? 1 : 0) - (b && b.data_fim ? 1 : 0))
    .slice(0, 6);

  return (
    <div className="relative w-[300px]">
      <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md">
        <div className="mb-2 text-center text-xl tracking-[0.3em] text-gray-900">TASKS</div>
        <ul className="space-y-2">
          {top.length ? (
            top.map((t) => (
              <li key={t.id_item_do_plano} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={!!t.data_fim}
                  onChange={() => onToggle && onToggle(t.id_item_do_plano)}
                />
                <span className={t.data_fim ? 'line-through text-gray-500' : ''}>{t.descricao}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-600">Sem tarefas ainda.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
