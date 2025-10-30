def generate_plan(subjects):
    plan = [{"day": "Monday", "subject": s.name} for s in subjects]
#     precisa ter as opcoes ate chegar no dashboard 
#     === CRIAR PLANO (WIZARD) ===
# F --> F1[Passo 1: Disciplinas + Dificuldade]
# F1 --> F2[Passo 2: Horas/semana e Período]
# F2 --> F3[Passo 3: Objetivo]
# F3 --> F4[Passo 4: Gerar com IA → Preview]
# F4 -->|Salvar| E

    return plan