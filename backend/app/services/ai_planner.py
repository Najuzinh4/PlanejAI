import os

try:
    # Newer SDK import; if unavailable, fallback handled below
    from openai import OpenAI  # type: ignore
    _HAS_OPENAI = True
except Exception:
    _HAS_OPENAI = False


def generate_study_plan(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or not _HAS_OPENAI:
        # Fallback mock for local dev/testing without API key
        return (
            "Plano (mock):\n"
            "- Semana 1: Revisar fundamentos e mapas mentais.\n"
            "- Semana 2: Exercicios praticos 60min/dia.\n"
            "- Semana 3: Simulados e revisao espacada.\n"
            "- Semana 4: Revisao final e descanso ativo."
        )

    client = OpenAI(api_key=api_key)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Voce e um assistente que cria planos de estudo personalizados e acionaveis."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
        temperature=0.7,
    )
    return completion.choices[0].message.content or ""
