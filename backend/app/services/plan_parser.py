import re

def parse_plan_text_to_items(text: str) -> list[str]:
    """
    Parser simples: mantém cada linha de tarefa separada, prefixando o título
    da semana quando necessário. Evita agrupar tudo em um único item por semana
    (o que fazia aparecer só uma tarefa por semana no frontend).
    """
    if not text:
        return []

    def is_week_marker(s: str) -> bool:
        ls = s.lower()
        return ls.startswith("semana") or ls.startswith("week")

    def is_trivial(s: str) -> bool:
        low = s.lower()
        if low in ("início", "inicio", "horas"):
            return True
        if "dd/mm" in low or low.strip() in ("horas", "início", "inicio"):
            return True
        if low.startswith("[ ]") or low.startswith("[x]"):
            return True
        return False

    items: list[str] = []
    current_week: str | None = None

    def push(body: str, prefix: str | None = None):
        """Quebra em subtarefas se vierem separadas por ';' ou '|', e aplica prefixo."""
        segments = [p.strip(" -•;") for p in re.split(r"[;|]+", body) if p.strip(" -•;")]
        if prefix:
            if len(segments) > 1:
                for seg in segments:
                    items.append(f"{prefix} — {seg}")
            else:
                items.append(f"{prefix} — {body.strip()}")
        else:
            if len(segments) > 1:
                items.extend(segments)
            else:
                items.append(body.strip())

    for raw in text.splitlines():
        s = raw.strip()
        if not s:
            continue
        if s.startswith("-") or s.startswith("*"):
            s = s.lstrip("-* ").strip()
        if is_trivial(s):
            continue

        # Linha já começa com "Semana X — ..."
        if is_week_marker(s):
            m = re.match(r"(?i)semana\s*(\d+)\s*[-—–:]?\s*(.*)", s)
            if m:
                num = m.group(1)
                rest = (m.group(2) or "").strip()
                current_week = f"Semana {num}"
                if rest:
                    push(rest, current_week)
                continue
            current_week = s
            continue

        # Linha normal: se há semana em contexto, prefixa
        if current_week:
            push(s, current_week)
        else:
            push(s)

    # Remove duplicatas preservando a ordem
    seen = set()
    uniq = []
    for x in items:
        if x and x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq
