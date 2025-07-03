import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_study_plan(prompt: str):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # ou gpt-4 se tiver
        messages=[
            {"role": "system", "content": "Você é um assistente que cria planos de estudo personalizados."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.7,
    )
    return response.choices[0].message["content"]
