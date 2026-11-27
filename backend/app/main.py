from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, users, products, categories, orders

# Inicializar aplicación FastAPI con Swagger UI en /docs
app = FastAPI(
    title="Dulce Delicia Repostería API",
    description="Backend RESTful para la pastelería artesanal Dulce Delicia con autenticación JWT, control de roles (RBAC), catálogo de postres y gestión de pedidos.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
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
        "estado": "Servicio Activo"
    }

@app.get("/api/health", tags=["General"])
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }
