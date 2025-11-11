from typing import Optional, Dict
from app.core.config import settings
from app.services.openai_client import get_openai_client

SYSTEM_MESSAGE = (
    "Você é um planejador de estudos especialista. Gere cronogramas práticos, em português do Brasil, "
    "com foco em resultados e retenção (prática ativa, recordação, revisão espaçada, interleaving). "
    "Tarefas curtas, acionáveis e específicas (verbo de ação + objetivo + resultado). "
    "Respeite rigorosamente as horas informadas. "
    "Não escreva introduções ou conclusões. Apenas a lista de bullets, uma tarefa por linha."
)


class PlanPrompt:
    def __init__(
        self,
        topico: str,
        horas_por_semana: int,
        meses: Optional[int] = None,
        semanas: Optional[int] = None,
        periodo: Optional[str] = None,
        urgente: bool = False,
        distrib_semana: Optional[Dict[str, int]] = None,
    ) -> None:
        self.topico = topico.strip()
        self.horas = int(horas_por_semana)
        self.meses = meses
        self.semanas = semanas
        self.periodo = (periodo or '').strip() or None
        self.urgente = bool(urgente or (self.periodo and 'URGENTE' in self.periodo.upper()))
        self.distrib = distrib_semana or None

    def build(self) -> str:
        assunto = self.topico or 'Estudos'
        if self.urgente:
            parts = [
                f"Plano URGENTE de estudo para hoje sobre: {assunto}.",
                f"Horas disponíveis hoje: {self.horas}.",
            ]
            if self.periodo:
                parts.append(f"Observação: {self.periodo}.")
            parts.extend([
                "Regras: foque em tarefas de alto impacto e diretamente aplicáveis agora; "
                "use ciclos curtos; inclua checagem final (simulado/flashcards) e checklist.",
                "Formato de saída (uma tarefa por bullet):",
                "- Hoje — [título curto] (Xmin): [descrição objetiva]",
                "Não escreva nada além da lista de bullets.",
            ])
            return " ".join(parts)
        # normal
        duracao = (
            f"Duração: {self.semanas} semanas." if self.semanas else (
                f"Duração: {self.meses} meses." if self.meses else ""
            )
        )
        parts = [
            f"Gere um cronograma de estudo semanal para o tópico: {assunto}.",
            f"Disponibilidade: {self.horas} horas por semana.",
            duracao,
        ]
        if self.periodo:
            parts.append(f"Período/observações: {self.periodo}.")
        if self.distrib:
            # Concatena uma dica de distribuição semanal (seg..dom)
            kv = "; ".join([f"{k}:{v}h" for k, v in self.distrib.items()])
            parts.append(f"Distribuição semanal sugerida: {kv}.")
        parts.extend([
            "Regras: cubra fundamentos → prática → revisão; inclua revisão espaçada semanal e marcos de checagem.",
            "Formato de saída (uma tarefa por bullet):",
            "- Semana N — [título curto] (Xh ou Ymin): [descrição objetiva]",
            "Não escreva nada além da lista de bullets.",
        ])
        return " ".join([p for p in parts if p])


def generate_plan_text(prompt: str) -> str:
    client = get_openai_client()
    if not client or not settings.OPENAI_API_KEY:
        # Fallback simples
        weeks = [
            "Semana 1 — Diagnóstico (1h): simulado curto e análise de erros.",
            "Semana 1 — Fundamentos (2h): leitura guiada e anotações.",
            "Semana 1 — Prática (2h): exercícios focados nos pontos fracos.",
            "Semana 1 — Revisão espaçada (30min): flashcards dos conceitos do dia.",
        ]
        return "\n".join(f"- {w}" for w in weeks)

    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_MESSAGE},
            {"role": "user", "content": prompt},
        ],
        max_tokens=settings.OPENAI_MAX_TOKENS,
        temperature=settings.OPENAI_TEMPERATURE,
    )
    return resp.choices[0].message.content or ''
