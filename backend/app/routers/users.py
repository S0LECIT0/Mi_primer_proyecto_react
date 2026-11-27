from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario, Rol
from app.schemas import UsuarioResponse, UsuarioUpdate, RolResponse
from app.security import require_admin, get_current_user

router = APIRouter(prefix="/api/users", tags=["Usuarios"])

@router.get("", response_model=List[UsuarioResponse])
def get_users(
    search: Optional[str] = Query(None, description="Buscar por nombre, apellido o correo"),
    rol_id: Optional[int] = Query(None, description="Filtrar por rol"),
    activo: Optional[bool] = Query(None, description="Filtrar por estado"),
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin)
):
    query = db.query(Usuario)
    if rol_id is not None:
        query = query.filter(Usuario.rol_id == rol_id)
    if activo is not None:
        query = query.filter(Usuario.activo == activo)
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (Usuario.nombre.ilike(search_filter)) |
            (Usuario.apellido.ilike(search_filter)) |
            (Usuario.email.ilike(search_filter)) |
            (Usuario.numero_documento.ilike(search_filter))
        )
    return query.order_by(Usuario.id.asc()).all()

@router.get("/roles", response_model=List[RolResponse])
def get_roles(db: Session = Depends(get_db)):
    return db.query(Rol).filter(Rol.activo == True).all()

@router.get("/{user_id}", response_model=UsuarioResponse)
def get_user_by_id(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    # Solo el admin o el propio usuario pueden consultar sus datos
    if current_user.rol_id != 1 and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para consultar este usuario."
        )
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return user

@router.put("/{user_id}", response_model=UsuarioResponse)
def update_user(
    user_id: int, 
    user_in: UsuarioUpdate, 
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin)
):
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin)
):
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    # Proteger contra eliminación de la propia cuenta administradora activa
    if user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminar tu propia cuenta de Administrador principal."
        )

    # Borrado físico si no tiene pedidos asociados, o borrado lógico (desactivación)
    if user.pedidos and len(user.pedidos) > 0:
        user.activo = False
        db.commit()
        return {"message": "El usuario cuenta con historial de compras; se ha desactivado correctamente.", "id": user_id, "desactivado": True}
    
    db.delete(user)
    db.commit()
    return {"message": "Usuario eliminado exitosamente del sistema.", "id": user_id, "eliminado": True}
