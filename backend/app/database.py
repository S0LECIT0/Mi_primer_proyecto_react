from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Adaptar URL en caso de que Neon entregue 'postgres://' en lugar de 'postgresql://'
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Argumentos de conexión según el motor (SQLite o PostgreSQL / Neon)
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Crear motor de base de datos SQLAlchemy
engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True  # Recomendado para conexiones serverless de Neon (mantiene viva la conexión)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para inyección de sesión en rutas FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
