# Backend FastAPI - Dulce Delicia Repostería

API RESTful desarrollada con **FastAPI**, **SQLAlchemy** y **PostgreSQL (Neon Tech)** para la gestión de usuarios, roles, catálogo de postres y pedidos de la pastelería artesanal **Dulce Delicia**.

---

## 1. Dónde colocar el Link de Neon Tech

Tu enlace de conexión a Neon debe colocarse en el archivo `backend/.env`.

1. Abre tu proyecto en la consola de **[Neon Tech](https://console.neon.tech/)**.
2. En la sección **Dashboard**, ubica la tarjeta **Connection Details**.
3. Selecciona la opción **Connection string** (y asegúrate de tener seleccionado `PostgreSQL`).
4. Copia la URL completa, que tiene una estructura similar a:
   ```env
   postgresql://neondb_owner:tu_password_aqui@ep-cool-cloud-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Abre el archivo:
   `backend/.env`
6. Pega la URL en la variable `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://neondb_owner:tu_password_aqui@ep-cool-cloud-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

*(Nota: Si no configuras la URL de Neon de inmediato, el backend funcionará en modo local con SQLite `sqlite:///./dulce_delicia.db` sin bloquearse).*

---

## 2. Instalación y Ejecución

### Paso 1: Instalar dependencias de Python
En una terminal situada en la carpeta `backend`:
```bash
cd backend
pip install -r requirements.txt
```

### Paso 2: Crear las tablas y cargar datos iniciales en Neon
Ejecuta el script de inicialización para crear automáticamente todas las tablas relacionales y sembrar los 10 postres, roles y usuarios en tu base de datos de Neon:
```bash
python init_db.py
```

### Paso 3: Iniciar el servidor FastAPI
Inicia el servidor en modo desarrollo con recarga automática:
```bash
uvicorn app.main:app --reload --port 8000
```

---

## 3. Documentación Interactiva de la API

Una vez iniciado el servidor, puedes probar todos los endpoints desde tu navegador:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 4. Endpoints Principales

### Autenticación (`/api/auth`)
- `POST /api/auth/register`: Registro de nuevos usuarios con validación de documento y correo único.
- `POST /api/auth/login`: Inicio de sesión y generación de token JWT.
- `GET /api/auth/me`: Datos del usuario autenticado actual.

### Usuarios (`/api/users`)
- `GET /api/users`: Lista y búsqueda de usuarios (requiere Administrador).
- `GET /api/users/roles`: Lista de roles del sistema.
- `PUT /api/users/{id}`: Actualización de datos y roles.
- `DELETE /api/users/{id}`: Eliminación o desactivación segura.

### Catálogo de Postres (`/api/products`)
- `GET /api/products`: Catálogo público con filtros por categoría y búsqueda en tiempo real.
- `POST /api/products`: Creación de nuevos postres (requiere Personal).
- `PUT /api/products/{id}`: Edición de precios, stock e imágenes.
- `DELETE /api/products/{id}`: Retiro de postres de la vitrina.

### Pedidos (`/api/orders`)
- `POST /api/orders`: Generación de pedido con validación de stock y cálculo de totales.
- `GET /api/orders`: Historial de pedidos (cliente consulta los suyos, admin consulta todos).
- `PUT /api/orders/{id}/status`: Actualización de estado en cocina o despacho.
