from pydantic import BaseModel

class Subject(BaseModel):
    name: str
    hours_per_week: int
