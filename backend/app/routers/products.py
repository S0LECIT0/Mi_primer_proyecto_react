from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ProductoCreate, ProductoUpdate, ProductoResponse
from app.security import require_staff
from app.services import product_service

router = APIRouter(prefix="/api/products", tags=["Productos y Postres"])


@router.get("", response_model=List[ProductoResponse])
def get_products(
    categoria_id: Optional[int] = Query(None, description="Filtrar por categoría"),
    search: Optional[str] = Query(None, description="Buscar por nombre o descripción"),
    solo_activos: bool = Query(True, description="Mostrar solo productos activos"),
    db: Session = Depends(get_db),
):
    return product_service.list_products(
        db, categoria_id=categoria_id, search=search, solo_activos=solo_activos
    )


@router.get("/{product_id}", response_model=ProductoResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return product_service.get_product_or_404(product_id, db)


@router.post("", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_in: ProductoCreate,
    db: Session = Depends(get_db),
    staff=Depends(require_staff),
):
    return product_service.create_product(prod_in, db)


@router.put("/{product_id}", response_model=ProductoResponse)
def update_product(
    product_id: int,
    prod_in: ProductoUpdate,
    db: Session = Depends(get_db),
    staff=Depends(require_staff),
):
    return product_service.update_product(product_id, prod_in, db)


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    staff=Depends(require_staff),
):
    return product_service.delete_product(product_id, db)
