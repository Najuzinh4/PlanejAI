from typing import Optional, Union
import logging
import json
import re

from app.core.config import settings
from app.services.openai_client import get_openai_client

logger = logging.getLogger(__name__)


class PlanPrompt:
    def __init__(
        self,
        topico: str,
        horas_por_semana: int,
        meses: Optional[int] = None,
        periodo: Optional[str] = None,
    ) -> None:
        self.topico = topico.strip()
        self.horas = horas_por_semana
        self.meses = meses
        self.periodo = periodo

    def build(self) -> str:
        assunto = self.topico or 'Estudos'
        parts = [
            'Gere um cronograma de estudo estruturado por semanas, claro e acionável.',
            f'Tópico: {assunto}.',
            f'Disponibilidade semanal: {self.horas} horas.',
        ]
        if self.meses:
            parts.append(f'Prazo: {self.meses} meses.')
        if self.periodo:
            parts.append(f'Período/observações: {self.periodo}.')
        # Prefer strict JSON so parsing is deterministic for the backend
        parts.append('Responda apenas em JSON estrito com o formato:')
        parts.append('{"weeks": [{"title": "Semana 1", "tasks": ["tarefa 1", "tarefa 2"]}]}')
        parts.append('Cada tarefa deve ser curta (até 12 palavras) e acionável. Não inclua texto explicativo adicional ou placeholders como "Início" ou "dd/mm/aaaa".')
        return ' '.join(parts)


def generate_plan_text(prompt: str) -> Union[dict, str]:
    """
    Calls the OpenAI client and tries to parse a JSON response with structure {"weeks": [...] }.
    Returns a dict when JSON with 'weeks' is detected, otherwise returns the raw text.
    Falls back to a mock structured dict when client/key isn't available.
    """
    client = get_openai_client()
    if not client or not settings.OPENAI_API_KEY:
        logger.warning("OPENAI client not available or OPENAI_API_KEY not set — using fallback mock plan structure")
        return {
            "weeks": [
                {"title": "Semana 1", "tasks": ["Fundamentos do tópico", "Mapa mental"]},
                {"title": "Semana 2", "tasks": ["Exercícios práticos 60min/dia", "Revisão"]},
                {"title": "Semana 3", "tasks": ["Simulados e revisão", "Checklist final"]},
            ]
        }

    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "Você é um assistente que cria cronogramas de estudo objetivos. Responda apenas em JSON conforme solicitado."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=settings.OPENAI_MAX_TOKENS,
        temperature=settings.OPENAI_TEMPERATURE,
    )
    text = resp.choices[0].message.content or ''

    # Try to extract JSON block from the response
    try:
        match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', text, re.DOTALL)
        if match:
            candidate = match.group(1)
            parsed = json.loads(candidate)
            if isinstance(parsed, dict) and 'weeks' in parsed:
                return parsed
    except Exception:
        logger.debug('Failed to parse JSON from model response', exc_info=True)

    # fallback: return raw text
    return text