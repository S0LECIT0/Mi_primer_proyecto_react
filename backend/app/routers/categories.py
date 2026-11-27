from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import CategoriaCreate, CategoriaResponse
from app.security import require_staff
from app.services import product_service

router = APIRouter(prefix="/api/categories", tags=["Categorías"])


@router.get("", response_model=List[CategoriaResponse])
def get_categories(db: Session = Depends(get_db)):
    return product_service.list_categories(db)


@router.post("", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: CategoriaCreate,
    db: Session = Depends(get_db),
    staff=Depends(require_staff),
):
    return product_service.create_category(cat_in, db)
