from typing import Optional
from app.core.config import settings
from app.services.openai_client import get_openai_client


class PlanPrompt:
    def __init__(
        self,
        topico: str,
        horas_por_semana: int,
        meses: Optional[int] = None,
        periodo: Optional[str] = None,
    ) -> None:
        self.topico = topico.strip()
        self.horas = horas_por_semana
        self.meses = meses
        self.periodo = periodo

    def build(self) -> str:
        assunto = self.topico or 'Estudos'
        parts = [
            'Gere um cronograma de estudo estruturado por semanas, claro e acionável.',
            f'Tópico: {assunto}.',
            f'Disponibilidade semanal: {self.horas} horas.',
        ]
        if self.meses:
            parts.append(f'Prazo: {self.meses} meses.')
        if self.periodo:
            parts.append(f'Período/observações: {self.periodo}.')
        parts.append('Responda em lista por semana com bullets de tarefas objetivas, incluindo revisão e checkpoints.')
        return ' '.join(parts)


def generate_plan_text(prompt: str) -> str:
    client = get_openai_client()
    if not client or not settings.OPENAI_API_KEY:
        # Fallback mock
        weeks = [
            'Semana 1: Fundamentos do tópico + mapa mental.',
            'Semana 2: Exercícios práticos 60min/dia.',
            'Semana 3: Simulados e revisão.',
            'Semana 4: Revisão final e checklist.',
        ]
        return '\n'.join(f'- {w}' for w in weeks)

    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "Você é um assistente que cria cronogramas de estudo objetivos."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=settings.OPENAI_MAX_TOKENS,
        temperature=settings.OPENAI_TEMPERATURE,
    )
    return resp.choices[0].message.content or ''