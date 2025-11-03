def parse_plan_text_to_items(text: str) -> list[str]:
    """
    Very simple parser: take each non-empty line starting with '-' or '*'
    as a single item description. Fallback: split by newlines and keep
    lines that contain 'Semana' too.
    """
    if not text:
        return []
    lines = []
    for raw in text.splitlines():
        s = raw.strip()
        if not s:
            continue
        if s.startswith("-") or s.startswith("*"):
            # remove bullet symbol
            s2 = s.lstrip("-* ")
            if s2:
                lines.append(s2)
        elif "Semana" in s or "semana" in s:
            lines.append(s)
    # de-duplicate preserving order
    seen = set()
    uniq = []
    for x in lines:
        if x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq

