from pydantic import BaseSettings


class Settings(BaseSettings):
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_MAX_TOKENS: int = 800
    OPENAI_TEMPERATURE: float = 0.6

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

