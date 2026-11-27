from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario
from app.schemas import AdminUsuarioCreate, UsuarioResponse, UsuarioUpdate, RolResponse
from app.security import require_admin, get_current_user
from app.services import user_service

router = APIRouter(prefix="/api/users", tags=["Usuarios"])


@router.get("", response_model=List[UsuarioResponse])
def get_users(
    search: Optional[str] = Query(None, description="Buscar por nombre, apellido o correo"),
    rol_id: Optional[int] = Query(None, description="Filtrar por rol"),
    activo: Optional[bool] = Query(None, description="Filtrar por estado"),
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin),
):
    return user_service.list_users(db, search=search, rol_id=rol_id, activo=activo)


@router.get("/roles", response_model=List[RolResponse])
def get_roles(db: Session = Depends(get_db)):
    return user_service.list_roles(db)


@router.get("/{user_id}", response_model=UsuarioResponse)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    if current_user.rol_id != 1 and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para consultar este usuario.",
        )
    return user_service.get_user_or_404(user_id, db)


@router.post("", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: AdminUsuarioCreate,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin),
):
    return user_service.create_user_by_admin(user_in, db)


@router.put("/{user_id}", response_model=UsuarioResponse)
def update_user(
    user_id: int,
    user_in: UsuarioUpdate,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin),
):
    return user_service.update_user_by_admin(user_id, user_in, db)


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin),
):
    return user_service.delete_user_by_admin(user_id, admin, db)
