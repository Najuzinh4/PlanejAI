from __future__ import annotations
import os
from typing import Optional

try:
    from openai import OpenAI  # type: ignore
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore

from app.core.config import settings

_client: Optional[OpenAI] = None


def get_openai_client() -> Optional[OpenAI]:
    global _client
    api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        return None
    if _client is None:
        _client = OpenAI(api_key=api_key)
    return _client

