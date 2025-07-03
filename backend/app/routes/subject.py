from fastapi import APIRouter
from app.schemas.subject import SubjectSchema

router = APIRouter()

@router.post("/subjects")
def create_subject(subject: SubjectSchema):
    return {"message": f"Subject '{subject.name}' added"}