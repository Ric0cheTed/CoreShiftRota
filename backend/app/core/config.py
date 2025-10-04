from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve backend/.env no matter where uvicorn is launched from
ENV_FILE = str(Path(__file__).resolve().parents[2] / ".env")

class Settings(BaseSettings):
    database_url: str = "sqlite:///./coreshift.db"
    secret_key: str = "change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    allowed_dev_login: bool = False
    dev_admin_username: str = "ric_admin"
    dev_admin_password: str = "RicDev123!"
    use_weasyprint: bool = False

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,   # <- absolute path to backend/.env
        env_prefix="",
        case_sensitive=False,
        extra="ignore",
    )

settings = Settings()
