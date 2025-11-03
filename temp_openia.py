from typing import Optional
from app.core.config import settings
from app.services.openai_client import get_openai_client


class PlanPrompt:
    def __init__(
        self,
        subjects: list[str],
        horas_por_semana: int,
        dificuldade: Optional[str] = None,
        objetivo: Optional[str] = None,
        periodo: Optional[str] = None,
        timeframe_weeks: Optional[int] = None,
        weekly_focus: Optional[str] = None,
        task_estimated_hours: Optional[int] = None,
    ) -> None:
        self.subjects = subjects
        self.horas = horas_por_semana
        self.dificuldade = dificuldade
        self.objetivo = objetivo
        self.periodo = periodo
        self.weeks = timeframe_weeks
        self.weekly_focus = weekly_focus
        self.task_estimated_hours = task_estimated_hours

    def build(self) -> str:
        subj_str = ", ".join(self.subjects) if self.subjects else "Estudos"
        parts = [
            "Gere um cronograma de estudo estruturado por semanas, claro e acionavel.",
            f"Disciplinas: {subj_str}.",
            f"Disponibilidade semanal: {self.horas} horas.",
        ]
        if self.dificuldade:
            parts.append(f"Dificuldade percebida: {self.dificuldade}.")
        if self.objetivo:
            parts.append(f"Objetivo: {self.objetivo}.")
        if self.periodo:
            parts.append(f"Periodo alvo: {self.periodo}.")
        if self.weeks:
            parts.append(f"Prazo: {self.weeks} semanas.")
        if self.weekly_focus:
            parts.append(f"Foco da semana: {self.weekly_focus}.")
        if self.task_estimated_hours:
            parts.append(f"Tente estimar ~{self.task_estimated_hours} horas por tarefa quando aplicavel.")
        parts.append(
            "Responda em lista por semana com bullets de tarefas, incluindo revisao espacada e checkpoints."
        )
        return " ".join(parts)


def generate_plan_text(prompt: str) -> str:
    client = get_openai_client()
    if not client or not settings.OPENAI_API_KEY:
        # Fallback mock
        weeks = [
            "Semana 1: Fundamentos + mapas mentais.",
            "Semana 2: Exercicios práticos 60min/dia.",
            "Semana 3: Simulados e revisao.",
            "Semana 4: Revisao final.",
        ]
        return "\n".join(f"- {w}" for w in weeks)

    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "Você é um assistente que cria cronogramas de estudo objetivos."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=settings.OPENAI_MAX_TOKENS,
        temperature=settings.OPENAI_TEMPERATURE,
    )
    return resp.choices[0].message.content or ""

