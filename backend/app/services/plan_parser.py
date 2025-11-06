def parse_plan_text_to_items(text: str) -> list[str]:
    """
    Improved parser that groups lines by week. It looks for lines that
    start with 'Semana' (case-insensitive) or bullets ('-'/'*') and
    accumulates following descriptive lines into a single item until the
    next week marker. It discards trivial lines like 'Início', 'Horas',
    empty date placeholders and short checklist markers.
    """
    if not text:
        return []

    def is_week_marker(s: str) -> bool:
        ls = s.lower()
        return ls.startswith('semana') or ls.startswith('week')

    def is_trivial(s: str) -> bool:
        low = s.lower()
        if low in ('início', 'inicio', 'horas'):
            return True
        # date placeholders like dd/mm/aaaa or lines that are just 'Horas'
        if 'dd/mm' in low or low.strip() in ('horas', 'início', 'inicio'):
            return True
        # short checklist markers
        if low.startswith('[ ]') or low.startswith('[x]'):
            return True
        return False

    items = []
    current = None
    for raw in text.splitlines():
        s = raw.strip()
        if not s:
            continue
        # normalize bullets
        if s.startswith('-') or s.startswith('*'):
            s = s.lstrip('-* ').strip()

        if is_trivial(s):
            continue

        if is_week_marker(s):
            # start a new week item
            if current:
                items.append(current.strip())
            current = s
        else:
            # append descriptive line to current week or start a generic item
            if current:
                current += ' ' + s
            else:
                # if no current week, treat this as its own item
                items.append(s)

    if current:
        items.append(current.strip())

    # remove duplicates preserving order
    seen = set()
    uniq = []
    for x in items:
        if x and x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq
