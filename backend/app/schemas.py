from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# -------------------------------------------------------------
# Esquemas de Roles y Permisos
# -------------------------------------------------------------
class PermisoResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    modulo: str

    class Config:
        from_attributes = True

class RolResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    activo: bool

    class Config:
        from_attributes = True

# -------------------------------------------------------------
# Esquemas de Usuarios y Autenticación
# -------------------------------------------------------------
class UsuarioBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    apellido: str = Field(..., min_length=2, max_length=100)
    tipo_documento: str = Field(default="CC")
    numero_documento: str = Field(..., min_length=5, max_length=30)
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8)
    rol_id: Optional[int] = 3  # Por defecto: Cliente

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    rol_id: Optional[int] = None
    activo: Optional[bool] = None

class UsuarioResponse(UsuarioBase):
    id: int
    rol_id: int
    activo: bool
    fecha_registro: datetime
    ultimo_acceso: Optional[datetime] = None
    rol: Optional[RolResponse] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UsuarioResponse

# -------------------------------------------------------------
# Esquemas de Categorías
# -------------------------------------------------------------
class CategoriaBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=100)
    descripcion: Optional[str] = None
    activo: bool = True

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

# -------------------------------------------------------------
# Esquemas de Productos (Pastelería)
# -------------------------------------------------------------
class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=150)
    descripcion: str
    precio: float = Field(..., ge=0)
    stock: int = Field(default=0, ge=0)
    categoria_id: int
    imagen_url: Optional[str] = None
    activo: bool = True

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None
    categoria_id: Optional[int] = None
    imagen_url: Optional[str] = None
    activo: Optional[bool] = None

class ProductoResponse(ProductoBase):
    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    categoria: Optional[CategoriaResponse] = None

    class Config:
        from_attributes = True

# -------------------------------------------------------------
# Esquemas de Pedidos y Detalles
# -------------------------------------------------------------
class DetallePedidoCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(..., gt=0)

class DetallePedidoResponse(BaseModel):
    id: int
    producto_id: int
    cantidad: int
    precio_unitario: float
    subtotal: float
    producto: Optional[ProductoResponse] = None

    class Config:
        from_attributes = True

class PedidoCreate(BaseModel):
    metodo_pago: str = Field(default="Transferencia")
    direccion_entrega: str
    notas: Optional[str] = None
    items: List[DetallePedidoCreate] = Field(..., min_items=1)

class PedidoStatusUpdate(BaseModel):
    estado: str = Field(..., pattern="^(Pendiente|En Preparacion|Enviado|Entregado|Cancelado)$")

class PedidoResponse(BaseModel):
    id: int
    usuario_id: int
    total: float
    estado: str
    metodo_pago: str
    direccion_entrega: str
    notas: Optional[str] = None
    fecha_pedido: datetime
    fecha_actualizacion: datetime
    usuario: Optional[UsuarioResponse] = None
    items: List[DetallePedidoResponse] = []

    class Config:
        from_attributes = True
