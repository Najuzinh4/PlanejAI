import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import SubjectInput from '../components/SubjectInput';

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
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState([]); // ids
  const [subjectName, setSubjectName] = useState('');
  const [subjectNames, setSubjectNames] = useState([]); // nomes manuais
  const [dificuldade, setDificuldade] = useState('media');
  const [horas, setHoras] = useState(6);
  const [periodo, setPeriodo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [semanas, setSemanas] = useState(4);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const canNext1 = useMemo(() => selected.length > 0 || subjectNames.length > 0, [selected, subjectNames]);
  const canNext2 = useMemo(() => Number(horas) > 0, [horas]);

  useEffect(() => {
    api.get('/subjects').then(r => setSubjects(r.data)).catch(() => setSubjects([]));
  }, []);

  const toggle = (id) => {
    setSelected((cur) => cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  };

  const addSubjectName = () => {
    const v = subjectName.trim();
    if (!v) return;
    setSubjectNames((cur) => Array.from(new Set([...cur, v])));
    setSubjectName('');
  };

  const removeSubjectName = (name) => {
    setSubjectNames((cur) => cur.filter(n => n !== name));
  };

  const generateAndSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/planos', {
        subject_ids: selected,
        subject_names: subjectNames,
        horas_por_semana: Number(horas),
        dificuldade,
        objetivo,
        periodo,
        timeframe_weeks: Number(semanas)
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
          <Step title="Passo 1: Disciplinas + Dificuldade">
            <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {subjects.map(s => (
                <label key={s.id_disciplina} className="flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2">
                  <input type="checkbox" checked={selected.includes(s.id_disciplina)} onChange={() => toggle(s.id_disciplina)} />
                  <div>
                    <div className="font-medium">{s.nome}</div>
                    <div className="text-sm text-gray-600">{s.horas_por_semana}h/sem · {s.dificuldade}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-3">
              <div className="mb-2 text-sm text-gray-700">Ou informe o que você quer estudar</div>
              <div className="flex items-center gap-3">
                <SubjectInput value={subjectName} onChange={setSubjectName} onAdd={addSubjectName} />
                <button className="rounded-md border px-3 py-2" onClick={addSubjectName}>Adicionar</button>
              </div>
              {!!subjectNames.length && (
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {subjectNames.map(n => (
                    <span key={n} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                      {n}
                      <button className="text-red-600" onClick={() => removeSubjectName(n)}>x</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-2">
              <label className="mr-2 text-sm text-gray-700">Dificuldade geral</label>
              <select className="rounded-md border px-3 py-2" value={dificuldade} onChange={e => setDificuldade(e.target.value)}>
                <option value="baixa">baixa</option>
                <option value="media">media</option>
                <option value="alta">alta</option>
              </select>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={!canNext1} onClick={() => setStep(2)}>Próximo</button>
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="Passo 2: Horas/semana e Período">
            <div className="grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
              <input className="rounded-md border px-3 py-2" placeholder="Horas/semana" type="number" value={horas} onChange={e => setHoras(e.target.value)} />
              <input className="rounded-md border px-3 py-2" placeholder="Período (ex: 2025-01)" value={periodo} onChange={e => setPeriodo(e.target.value)} />
              <input className="rounded-md border px-3 py-2" placeholder="Semanas" type="number" value={semanas} onChange={e => setSemanas(e.target.value)} />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md border px-4 py-2" onClick={() => setStep(1)}>Voltar</button>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={!canNext2} onClick={() => setStep(3)}>Próximo</button>
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="Passo 3: Objetivo">
            <input className="max-w-xl rounded-md border px-3 py-2" placeholder="Objetivo (opcional)" value={objetivo} onChange={e => setObjetivo(e.target.value)} />
            <div className="mt-3 flex gap-2">
              <button className="rounded-md border px-4 py-2" onClick={() => setStep(2)}>Voltar</button>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white" onClick={() => setStep(4)}>Próximo</button>
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step title="Passo 4: Gerar com IA → Preview">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50" disabled={loading || (selected.length === 0 && subjectNames.length === 0)} onClick={generateAndSave}>
              {loading ? 'Gerando...' : 'Gerar e Salvar'}
            </button>
            {preview && (
              <pre className="mt-4 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm">{preview}</pre>
            )}
            <div className="mt-3">
              <button className="rounded-md border px-4 py-2" onClick={() => setStep(3)}>Voltar</button>
            </div>
          </Step>
        )}
      </div>
    </div>
  );
}
