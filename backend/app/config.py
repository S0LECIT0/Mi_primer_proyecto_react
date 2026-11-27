import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Cargar variables desde el archivo backend/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    # Por defecto busca la variable DATABASE_URL de Neon; si no está definida o contiene el placeholder,
    # permite fallback a SQLite local para no detener la ejecución.
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./dulce_delicia.db"
    )
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", 
        "dulce_delicia_reposteria_secreta_jwt_key_2026_super_segura"
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:5173,http://127.0.0.1:5173"
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
