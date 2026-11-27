from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, users, products, categories, orders

# Inicializar aplicación FastAPI
app = FastAPI(
    title="Dulce Delicia Repostería API",
    description="Backend RESTful para la pastelería artesanal Dulce Delicia con autenticación JWT, control de roles (RBAC), catálogo de postres y gestión de pedidos.",
    version="1.0.0"
)

# Configurar Middleware CORS para permitir solicitudes del Frontend React (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar Routers Modulares
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(orders.router)

@app.get("/", tags=["General"])
def read_root():
    return {
        "marca": "Dulce Delicia Repostería Artesanal",
        "estado": "Servicio Activo",
        "documentacion": "/docs",
        "especificacion": "/openapi.json"
    }

@app.get("/api/health", tags=["General"])
def health_check():
    db_tipo = "PostgreSQL (Neon Tech)" if "postgres" in settings.DATABASE_URL else "SQLite Local"
    return {
        "status": "healthy",
        "motor_bd": db_tipo,
        "timestamp": datetime.utcnow().isoformat()
    }
