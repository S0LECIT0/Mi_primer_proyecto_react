from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.models import Usuario, Rol
from app.schemas import (
    UsuarioCreate,
    TokenResponse,
    RecoverPasswordResponse,
)
from app.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_reset_token,
    verify_reset_token,
)


def _issue_token_for_user(user: Usuario) -> TokenResponse:
    """Genera un TokenResponse JWT con la información del usuario."""
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user,
    )


def register_user(usuario_in: UsuarioCreate, db: Session) -> TokenResponse:
    """Registra un nuevo cliente con contraseña encriptada con bcrypt y emite JWT."""
    normalized_email = usuario_in.email.strip().lower()
    normalized_doc = usuario_in.numero_documento.strip()

    if db.query(Usuario).filter(Usuario.email == normalized_email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una cuenta registrada con este correo electrónico.",
        )

    if db.query(Usuario).filter(Usuario.numero_documento == normalized_doc).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de documento ya se encuentra registrado.",
        )

    # El registro público siempre asigna rol Cliente para evitar escalamiento de privilegios
    rol_cliente = db.query(Rol).filter(Rol.nombre == "Cliente").first()
    rol_id = rol_cliente.id if rol_cliente else 3

    nuevo_usuario = Usuario(
        nombre=usuario_in.nombre.strip(),
        apellido=usuario_in.apellido.strip(),
        tipo_documento=usuario_in.tipo_documento,
        numero_documento=normalized_doc,
        telefono=usuario_in.telefono.strip() if usuario_in.telefono else None,
        direccion=usuario_in.direccion.strip() if usuario_in.direccion else None,
        email=normalized_email,
        password_hash=get_password_hash(usuario_in.password),
        rol_id=rol_id,
        activo=True,
        fecha_registro=datetime.utcnow(),
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return _issue_token_for_user(nuevo_usuario)


def authenticate_user(email: str, password: str, db: Session) -> TokenResponse:
    """Valida credenciales contra el hash bcrypt almacenado y emite JWT."""
    normalized_email = email.lower().strip()
    usuario = db.query(Usuario).filter(Usuario.email == normalized_email).first()

    if not usuario or not verify_password(password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta cuenta ha sido deshabilitada. Contacte a la administración.",
        )

    usuario.ultimo_acceso = datetime.utcnow()
    db.commit()
    db.refresh(usuario)

    return _issue_token_for_user(usuario)


def request_password_recovery(email: str, db: Session) -> RecoverPasswordResponse:
    """Verifica el correo registrado y genera un token JWT temporal de recuperación."""
    normalized_email = email.lower().strip()
    usuario = db.query(Usuario).filter(Usuario.email == normalized_email).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe ninguna cuenta registrada con este correo electrónico.",
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta está deshabilitada. Contacta al administrador.",
        )

    reset_token = create_reset_token(user_id=usuario.id, email=usuario.email)
    return RecoverPasswordResponse(
        message="Se ha generado el token de recuperación para restablecer tu contraseña.",
        email=usuario.email,
        reset_token=reset_token,
        expires_in_minutes=settings.RESET_TOKEN_EXPIRE_MINUTES,
    )


def reset_user_password(token: str, new_password: str, db: Session) -> dict:
    """Valida el token JWT de recuperación y actualiza la contraseña encriptada con bcrypt."""
    payload = verify_reset_token(token)
    try:
        user_id = int(payload["sub"])
    except (KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de recuperación inválido.",
        )

    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta se encuentra inactiva.",
        )

    usuario.password_hash = get_password_hash(new_password)
    db.commit()
    return {"message": "Contraseña restablecida exitosamente. Ya puedes iniciar sesión."}
