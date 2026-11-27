# Dulce Delicia | Repostería Artesanal & Postres Gourmet

Sistema web integral para la pastelería artesanal **Dulce Delicia**, compuesto por un frontend reactivo con **React + Vite + Tailwind CSS**, un backend API RESTful de alto rendimiento con **FastAPI + SQLAlchemy**, y base de datos relacional compatible con **PostgreSQL (Neon Tech)** y SQLite.

---

## 📁 Estructura del Proyecto

El repositorio está organizado en tres carpetas principales:

```text
mi_primer_proyecto/
├── frontend/             # Aplicación de interfaz de usuario (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── assets/       # Imágenes de los 10 postres y logotipo oficial
│   │   ├── components/   # Header, Footer, Carousel, Modales de Confirmación y Autenticación
│   │   ├── pages/        # Vistas públicas (Inicio, Nosotros, Contacto, Login) y Admin CRUDs
│   │   ├── services/     # api.js: Cliente HTTP con inyección de JWT y soporte para Neon Tech
│   │   ├── App.jsx       # Rutas públicas y protegidas (/admin)
│   │   └── main.jsx
│   ├── .env              # Configuración de URL del API (VITE_API_URL=http://localhost:8000/api)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/              # API RESTful desarrollada con FastAPI y SQLAlchemy
│   ├── app/
│   │   ├── main.py       # Aplicación FastAPI con CORS configurado para Vite
│   │   ├── config.py     # Carga de variables de entorno (.env)
│   │   ├── database.py   # Conexión optimizada para PostgreSQL (Neon Tech) y SQLite
│   │   ├── models.py     # Modelos relacionales ORM (8 entidades)
│   │   ├── schemas.py    # Esquemas de validación de datos con Pydantic v2
│   │   ├── security.py   # Hashing Bcrypt y generación de tokens JWT
│   │   └── routers/      # auth, users, products, categories, orders
│   ├── .env              # << AQUÍ SE COLOCA EL LINK DE NEON (DATABASE_URL) >>
│   ├── init_db.py        # Script seeder para crear tablas y sembrar datos en Neon
│   └── requirements.txt  # Dependencias de Python
│
└── database/             # Diseño y documentación de la base de datos
    ├── MODELO_ER.md      # Diagrama Entidad-Relación y diccionario exhaustivo
    ├── schema.sql        # Script DDL de tablas, claves foráneas e índices
    └── seed_data.sql     # Script DML con roles, permisos, usuarios y los 10 postres
```

---

## 🚀 Puesta en Marcha

### 1. Iniciar el Backend (FastAPI + Neon Tech)
```bash
cd backend

# Instalar librerías
pip install -r requirements.txt

# Inicializar tablas y cargar los 10 postres en Neon
python init_db.py

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
```
- Documentación interactiva de la API: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Iniciar el Frontend (React + Vite)
En otra terminal:
```bash
cd frontend

# Iniciar servidor de desarrollo
npm run dev
```
- Aplicación web: [http://localhost:5173](http://localhost:5173)
