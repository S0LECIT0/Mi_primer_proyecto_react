from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Categoria
from app.schemas import CategoriaCreate, CategoriaResponse
from app.security import require_staff

router = APIRouter(prefix="/api/categories", tags=["Categorías"])

@router.get("", response_model=List[CategoriaResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Categoria).filter(Categoria.activo == True).order_by(Categoria.id.asc()).all()

@router.post("", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: CategoriaCreate, 
    db: Session = Depends(get_db),
    staff = Depends(require_staff)
):
    if db.query(Categoria).filter(Categoria.nombre == cat_in.nombre.strip()).first():
        raise HTTPException(status_code=400, detail="Ya existe una categoría con este nombre.")

    nueva_cat = Categoria(
        nombre=cat_in.nombre.strip(),
        descripcion=cat_in.descripcion,
        activo=cat_in.activo
    )
    db.add(nueva_cat)
    db.commit()
    db.refresh(nueva_cat)
    return nueva_cat
