from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models import Usuario, Rol
from app.schemas import AdminUsuarioCreate, UsuarioUpdate
from app.security import get_password_hash


def list_users(
    db: Session,
    search: Optional[str] = None,
    rol_id: Optional[int] = None,
    activo: Optional[bool] = None,
) -> List[Usuario]:
    """Lista usuarios aplicando filtros opcionales de rol, estado y búsqueda."""
    query = db.query(Usuario)
    if rol_id is not None:
        query = query.filter(Usuario.rol_id == rol_id)
    if activo is not None:
        query = query.filter(Usuario.activo == activo)
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (Usuario.nombre.ilike(search_filter))
            | (Usuario.apellido.ilike(search_filter))
            | (Usuario.email.ilike(search_filter))
            | (Usuario.numero_documento.ilike(search_filter))
        )
    return query.order_by(Usuario.id.asc()).all()


def list_roles(db: Session) -> List[Rol]:
    """Lista todos los roles activos del sistema."""
    return db.query(Rol).filter(Rol.activo == True).order_by(Rol.id.asc()).all()


def get_user_or_404(user_id: int, db: Session) -> Usuario:
    """Obtiene un usuario por ID o lanza 404."""
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return user


def create_user_by_admin(user_in: AdminUsuarioCreate, db: Session) -> Usuario:
    """Crea un usuario desde el panel administrativo con contraseña encriptada con bcrypt."""
    normalized_email = user_in.email.strip().lower()
    normalized_doc = user_in.numero_documento.strip()

    if db.query(Usuario).filter(Usuario.email == normalized_email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario registrado con este correo electrónico.",
        )

    if db.query(Usuario).filter(Usuario.numero_documento == normalized_doc).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El número de documento ya se encuentra registrado.",
        )

    rol = db.query(Rol).filter(Rol.id == user_in.rol_id, Rol.activo == True).first()
    if not rol:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El rol especificado no existe.")

    nuevo_usuario = Usuario(
        nombre=user_in.nombre.strip(),
        apellido=user_in.apellido.strip(),
        tipo_documento=user_in.tipo_documento,
        numero_documento=normalized_doc,
        telefono=user_in.telefono.strip() if user_in.telefono else None,
        direccion=user_in.direccion.strip() if user_in.direccion else None,
        email=normalized_email,
        password_hash=get_password_hash(user_in.password),
        rol_id=user_in.rol_id,
        activo=user_in.activo,
        fecha_registro=datetime.utcnow(),
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario


def update_user_by_admin(user_id: int, user_in: UsuarioUpdate, db: Session) -> Usuario:
    """Actualiza datos, rol, estado o contraseña de un usuario existente."""
    user = get_user_or_404(user_id, db)
    update_data = user_in.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        normalized_email = update_data["email"].strip().lower()
        existing_email = (
            db.query(Usuario)
            .filter(Usuario.email == normalized_email, Usuario.id != user_id)
            .first()
        )
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Otro usuario ya utiliza este correo electrónico.",
            )
        update_data["email"] = normalized_email

    if "numero_documento" in update_data and update_data["numero_documento"]:
        normalized_doc = update_data["numero_documento"].strip()
        existing_doc = (
            db.query(Usuario)
            .filter(Usuario.numero_documento == normalized_doc, Usuario.id != user_id)
            .first()
        )
        if existing_doc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Otro usuario ya utiliza este número de documento.",
            )
        update_data["numero_documento"] = normalized_doc

    if "rol_id" in update_data and update_data["rol_id"] is not None:
        rol = db.query(Rol).filter(Rol.id == update_data["rol_id"], Rol.activo == True).first()
        if not rol:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El rol especificado no existe.")

    if "password" in update_data:
        raw_password = update_data.pop("password")
        if raw_password:
            user.password_hash = get_password_hash(raw_password)

    for field, value in update_data.items():
        if isinstance(value, str) and field in ("nombre", "apellido", "telefono", "direccion"):
            value = value.strip()
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


def delete_user_by_admin(user_id: int, admin: Usuario, db: Session) -> dict:
    """Elimina un usuario o lo desactiva si posee historial de pedidos."""
    user = get_user_or_404(user_id, db)

    if user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminar tu propia cuenta de Administrador principal.",
        )

    if user.pedidos and len(user.pedidos) > 0:
        user.activo = False
        db.commit()
        return {
            "message": "El usuario cuenta con historial de compras; se ha desactivado correctamente.",
            "id": user_id,
            "desactivado": True,
        }

    db.delete(user)
    db.commit()
    return {
        "message": "Usuario eliminado exitosamente del sistema.",
        "id": user_id,
        "eliminado": True,
    }
