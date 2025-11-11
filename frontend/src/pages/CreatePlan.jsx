import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

function Step({ title, children, subtitle }) {
  return (
    <section className="rounded-lg border bg-white p-5">
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mb-3 text-sm text-gray-600">{subtitle}</p>}
      {children}
    </section>
  );
}

export default function CreatePlan() {
  const [step, setStep] = useState(1);
  const [topico, setTopico] = useState('');

  // Tipo do plano
  const [planType, setPlanType] = useState('normal'); // 'normal' | 'urgent'

  // Duração (modo normal)
  const [durType, setDurType] = useState('months'); // 'months' | 'weeks'
  const [horas, setHoras] = useState(6);
  const [meses, setMeses] = useState(3);
  const [semanas, setSemanas] = useState(4);

  // Distribuição semanal (quando organizar por semanas)
  const [weekDist, setWeekDist] = useState({ seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0 });

  // Modo urgente
  const [urgentHours, setUrgentHours] = useState(4);
  const [notes, setNotes] = useState('URGENTE: prova hoje');

  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const distTotal = useMemo(() => Object.values(weekDist).reduce((a, b) => a + (Number(b) || 0), 0), [weekDist]);

  const canNext1 = useMemo(() => topico.trim().length > 2, [topico]);
  const canNext2 = useMemo(() => (
    planType === 'urgent'
      ? Number(urgentHours) > 0
      : durType === 'months'
        ? Number(horas) > 0 && Number(meses) > 0
        : Number(semanas) > 0 && distTotal > 0
  ), [planType, durType, horas, meses, semanas, urgentHours, distTotal]);

  const suggestions = [
    'Fundamentos de Python',
    'Inglês para viagem',
    'Excel avançado',
    'JavaScript do zero',
    'ENEM - Humanas',
    'React em 8 semanas',
    'Violão iniciante',
    'Como fazer pizza napolitana',
  ];

  const updateDay = (k, v) => {
    const n = Math.max(0, Number(v) || 0);
    setWeekDist((cur) => ({ ...cur, [k]: n }));
  };

  const generateAndSave = async () => {
    setLoading(true);
    try {
      const payload = {
        topico: topico.trim(),
      };

      if (planType === 'urgent') {
        payload.horas_por_semana = Number(urgentHours);
        payload.periodo = (notes?.trim() || 'URGENTE');
        payload.urgente = true;
      } else {
        if (durType === 'months') {
          payload.horas_por_semana = Number(horas);
          payload.meses = Number(meses);
        } else {
          // semanas
          payload.semanas = Number(semanas);
          payload.distrib_semana = Object.fromEntries(Object.entries(weekDist).map(([k, v]) => [k, Number(v) || 0]));
          payload.horas_por_semana = distTotal; // redundante, backend recalcula somando a distrib
        }
      }

      // remove undefined
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      const { data } = await api.post('/planos', payload);
      setPreview((data?.itens || []).map(i => `- ${i.descricao}`).join('\n'));
      navigate(`/plans/${data.id_pe || data.id}`);
    } catch (e) {
      setPreview('Erro ao gerar o plano.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-2">
            <Loader />
            <div className="text-sm text-gray-700">Gerando plano...</div>
          </div>
        </div>
      )}

      <h2 className="mb-4 text-2xl font-semibold">Criar Plano</h2>
      <div className="grid gap-4">
        {step === 1 && (
          <Step
            title="Passo 1: O que você quer estudar?"
            subtitle="Pode ser qualquer coisa: uma habilidade, um exame, um hobby ou um projeto pessoal. Depois vamos pedir suas horas e a duração (semanas/meses) ou um modo urgente."
          >
            <label className="block">
              <span className="mb-2 block text-sm text-gray-700">Tópico do plano</span>
              <input
                className="w-full max-w-xl rounded-md border px-3 py-2"
                placeholder="Ex.: Fundamentos de Python"
                value={topico}
                onChange={e => setTopico(e.target.value)}
              />
            </label>
            <div className="mt-2 text-xs text-gray-500">Dica: seja específico (ex.: “Inglês para viagem em 3 meses”).</div>

            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Sugestões rápidas</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full border px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setTopico(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                disabled={!canNext1}
                onClick={() => setStep(2)}
              >
                Próximo
              </button>
              {!canNext1 && (
                <span className="text-xs text-gray-500">Digite pelo menos 3 caracteres.</span>
              )}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step
            title="Passo 2: Como vamos planejar?"
            subtitle="Escolha entre um plano normal (semanas/meses) ou um plano urgente para estudar hoje/agora."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPlanType('normal')}
                className={`rounded-md border p-3 text-left ${planType==='normal' ? 'border-blue-600 ring-2 ring-blue-100' : 'hover:bg-gray-50'}`}
              >
                <div className="mb-1 font-medium">Planejamento normal</div>
                <div className="text-sm text-gray-600">Posso me planejar por semanas/meses.</div>
              </button>
              <button
                type="button"
                onClick={() => setPlanType('urgent')}
                className={`rounded-md border p-3 text-left ${planType==='urgent' ? 'border-blue-600 ring-2 ring-blue-100' : 'hover:bg-gray-50'}`}
              >
                <div className="mb-1 font-medium">Plano urgente</div>
                <div className="text-sm text-gray-600">Preciso estudar hoje/agora (ex.: prova é hoje).</div>
              </button>
            </div>

            {planType === 'normal' ? (
              <>
                <div className="mt-4 flex gap-2">
                  <span className="text-sm text-gray-700">Organizar por:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDurType('weeks')}
                      className={`rounded-md border px-3 py-1 text-sm ${durType==='weeks' ? 'border-blue-600 ring-2 ring-blue-100' : 'hover:bg-gray-50'}`}
                    >Semanas</button>
                    <button
                      type="button"
                      onClick={() => setDurType('months')}
                      className={`rounded-md border px-3 py-1 text-sm ${durType==='months' ? 'border-blue-600 ring-2 ring-blue-100' : 'hover:bg-gray-50'}`}
                    >Meses</button>
                  </div>
                </div>

                {durType === 'months' ? (
                  <div className="mt-3 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-sm text-gray-700">Horas por semana</span>
                      <input className="w-full rounded-md border px-3 py-2" type="number" value={horas} onChange={e => setHoras(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-sm text-gray-700">Meses de duração</span>
                      <input className="w-full rounded-md border px-3 py-2" type="number" value={meses} onChange={e => setMeses(e.target.value)} />
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="mt-3 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-sm text-gray-700">Quantidade de semanas</span>
                        <input className="w-full rounded-md border px-3 py-2" type="number" value={semanas} onChange={e => setSemanas(e.target.value)} />
                      </label>
                    </div>
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">Distribuição por dia (semana-tipo)</div>
                      <div className="grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                        {Object.entries(weekDist).map(([k, v]) => (
                          <label key={k} className="block">
                            <span className="mb-1 block text-xs uppercase text-gray-600">{k}</span>
                            <input className="w-full rounded-md border px-2 py-2" type="number" value={v} onChange={e => updateDay(k, e.target.value)} />
                          </label>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Total/semana: <span className="font-medium text-gray-700">{distTotal}h</span></div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="mt-4 grid max-w-xl grid-cols-1 gap-2">
                <label className="block">
                  <span className="mb-1 block text-sm text-gray-700">Horas disponíveis hoje</span>
                  <input className="w-full rounded-md border px-3 py-2" type="number" value={urgentHours} onChange={e => setUrgentHours(e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-gray-700">Observações (opcional)</span>
                  <input className="w-full rounded-md border px-3 py-2" type="text" value={notes} onChange={e => setNotes(e.target.value)} />
                </label>
                <div className="text-xs text-gray-500">Usaremos essas observações para avisar a IA que o plano é URGENTE.</div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button className="rounded-md border px-4 py-2" onClick={() => setStep(1)}>Voltar</button>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={!canNext2} onClick={() => setStep(3)}>Próximo</button>
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="Passo 3: Gerar com IA → Preview">
            <div className="flex gap-2">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={loading || !canNext2} onClick={generateAndSave}>{loading ? 'Gerando...' : 'Gerar e Salvar'}</button>
            </div>
            {preview && (
              <pre className="mt-4 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm">{preview}</pre>
            )}
            <div className="mt-3">
              <button className="rounded-md border px-4 py-2" onClick={() => setStep(2)}>Voltar</button>
            </div>
          </Step>
        )}
      </div>
    </div>
  );
}


