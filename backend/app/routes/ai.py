from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_planner import generate_study_plan

router = APIRouter()


class PlanRequest(BaseModel):
    subject: str
    hours_per_week: int
    difficulty: str  # e.g., "baixa", "média", "alta"
    goal: str | None = None
    timeframe_weeks: int | None = None


@router.post("/generate-plan")
def generate_plan(request: PlanRequest):
    prompt = (
        "Gere um cronograma de estudo estruturado, com semanas e tarefas diárias, "
        "com recomendações de técnicas (Pomodoro, revisão espaçada) e checkpoints. "
        f"Disciplina: {request.subject}. "
        f"Dificuldade percebida: {request.difficulty}. "
        f"Disponibilidade: {request.hours_per_week} horas por semana. "
        + (f"Objetivo: {request.goal}. " if request.goal else "")
        + (f"Prazo: {request.timeframe_weeks} semanas. " if request.timeframe_weeks else "")
        + "Responda em formato de lista por semana."
    )
    plan = generate_study_plan(prompt)
    return {"plan": plan}

