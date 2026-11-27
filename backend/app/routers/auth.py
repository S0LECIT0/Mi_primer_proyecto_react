from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario, Rol
from app.schemas import UsuarioCreate, UsuarioResponse, LoginRequest, TokenResponse
from app.security import (
    verify_password, get_password_hash, create_access_token, get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(usuario_in: UsuarioCreate, db: Session = Depends(get_db)):
    # 1. Verificar si el correo ya existe
    if db.query(Usuario).filter(Usuario.email == usuario_in.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una cuenta registrada con este correo electrónico."
        )
    
    # 2. Verificar si el número de documento ya existe
    if db.query(Usuario).filter(Usuario.numero_documento == usuario_in.numero_documento).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de documento ya se encuentra registrado."
        )

    # 3. Rol por defecto: Cliente (ID: 3)
    rol_id = usuario_in.rol_id or 3
    rol = db.query(Rol).filter(Rol.id == rol_id).first()
    if not rol:
        rol = db.query(Rol).filter(Rol.nombre == "Cliente").first()
        rol_id = rol.id if rol else 3

    # 4. Crear usuario con hash de contraseña
    nuevo_usuario = Usuario(
        nombre=usuario_in.nombre.strip(),
        apellido=usuario_in.apellido.strip(),
        tipo_documento=usuario_in.tipo_documento,
        numero_documento=usuario_in.numero_documento.strip(),
        telefono=usuario_in.telefono.strip() if usuario_in.telefono else None,
        direccion=usuario_in.direccion.strip() if usuario_in.direccion else None,
        email=usuario_in.email.strip().lower(),
        password_hash=get_password_hash(usuario_in.password),
        rol_id=rol_id,
        activo=True,
        fecha_registro=datetime.utcnow()
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    # 5. Emitir token JWT
    access_token = create_access_token(data={"sub": str(nuevo_usuario.id), "email": nuevo_usuario.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=nuevo_usuario
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == credentials.email.lower().strip()).first()
    if not usuario or not verify_password(credentials.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta cuenta ha sido deshabilitada. Contacte a la administración."
        )

    # Registrar último acceso
    usuario.ultimo_acceso = datetime.utcnow()
    db.commit()

    access_token = create_access_token(data={"sub": str(usuario.id), "email": usuario.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=usuario
    )

# Endpoint compatible con OAuth2 Password Request Form (para Swagger UI /docs)
@router.post("/token", response_model=TokenResponse)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username.lower().strip()).first()
    if not usuario or not verify_password(form_data.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    usuario.ultimo_acceso = datetime.utcnow()
    db.commit()
    access_token = create_access_token(data={"sub": str(usuario.id), "email": usuario.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=usuario
    )

@router.get("/me", response_model=UsuarioResponse)
def get_current_user_profile(current_user: Usuario = Depends(get_current_user)):
    return current_user
