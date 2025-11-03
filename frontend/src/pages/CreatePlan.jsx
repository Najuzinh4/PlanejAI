import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

function Step({ title, children }) {
  return (
    <section className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export default function CreatePlan() {
  const [step, setStep] = useState(1);
  const [topico, setTopico] = useState('');
  const [horas, setHoras] = useState(6);
  const [meses, setMeses] = useState(3);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const canNext1 = useMemo(() => topico.trim().length > 2, [topico]);
  const canNext2 = useMemo(() => Number(horas) > 0 && Number(meses) > 0, [horas, meses]);

  const generateAndSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/planos', {
        topico: topico.trim(),
        horas_por_semana: Number(horas),
        meses: Number(meses)
      });
      setPreview((data?.itens || []).map(i => `- ${i.descricao}`).join('\n'));
      setTimeout(() => navigate('/dashboard'), 800);
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
          <Step title="Passo 1: Tópico">
            <input
              className="w-full max-w-xl rounded-md border px-3 py-2"
              placeholder="Ex: Como fazer pizza"
              value={topico}
              onChange={e => setTopico(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={!canNext1} onClick={() => setStep(2)}>Próximo</button>
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="Passo 2: Horas/semana e Duração (meses)">
            <div className="grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
              <input className="rounded-md border px-3 py-2" placeholder="Horas/semana" type="number" value={horas} onChange={e => setHoras(e.target.value)} />
              <input className="rounded-md border px-3 py-2" placeholder="Meses" type="number" value={meses} onChange={e => setMeses(e.target.value)} />
            </div>
            <div className="mt-3 flex gap-2">
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
