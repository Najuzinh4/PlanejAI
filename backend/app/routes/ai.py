from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_planner import generate_study_plan

router = APIRouter()

class PlanRequest(BaseModel):
    subject: str
    hours_per_week: int
    difficulty: str

@router.post("/generate-plan")
def generate_plan(request: PlanRequest):
    prompt = (
        f"Crie um cronograma de estudo para a matéria {request.subject}, "
        f"com dificuldade {request.difficulty}, e disponibilidade de {request.hours_per_week} horas por semana."
    )
    plan = generate_study_plan(prompt)
    return {"plan": plan}
