def generate_plan(subjects):
    plan = [{"day": "Monday", "subject": s.name} for s in subjects]
    return plan