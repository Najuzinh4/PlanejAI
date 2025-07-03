from pydantic import BaseModel

class SubjectSchema(BaseModel):
    name: str
    hours_per_week: int
