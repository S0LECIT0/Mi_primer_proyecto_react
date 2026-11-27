from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Producto, Categoria
from app.schemas import ProductoCreate, ProductoUpdate, ProductoResponse
from app.security import require_staff

router = APIRouter(prefix="/api/products", tags=["Productos y Postres"])

@router.get("", response_model=List[ProductoResponse])
def get_products(
    categoria_id: Optional[int] = Query(None, description="Filtrar por categoría"),
    search: Optional[str] = Query(None, description="Buscar por nombre o descripción"),
    solo_activos: bool = Query(True, description="Mostrar solo productos activos"),
    db: Session = Depends(get_db)
):
    query = db.query(Producto)
    if solo_activos:
        query = query.filter(Producto.activo == True)
    if categoria_id:
        query = query.filter(Producto.categoria_id == categoria_id)
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (Producto.nombre.ilike(search_filter)) |
            (Producto.descripcion.ilike(search_filter))
        )
    return query.order_by(Producto.id.asc()).all()

@router.get("/{product_id}", response_model=ProductoResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == product_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto

@router.post("", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_in: ProductoCreate, 
    db: Session = Depends(get_db),
    staff = Depends(require_staff)
):
    # Validar que la categoría exista
    cat = db.query(Categoria).filter(Categoria.id == prod_in.categoria_id).first()
    if not cat:
        raise HTTPException(status_code=400, detail="La categoría especificada no existe.")

    nuevo_producto = Producto(
        nombre=prod_in.nombre.strip(),
        descripcion=prod_in.descripcion.strip(),
        precio=prod_in.precio,
        stock=prod_in.stock,
        categoria_id=prod_in.categoria_id,
        imagen_url=prod_in.imagen_url,
        activo=prod_in.activo,
        fecha_creacion=datetime.utcnow(),
        fecha_actualizacion=datetime.utcnow()
    )
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@router.put("/{product_id}", response_model=ProductoResponse)
def update_product(
    product_id: int,
    prod_in: ProductoUpdate,
    db: Session = Depends(get_db),
    staff = Depends(require_staff)
):
    producto = db.query(Producto).filter(Producto.id == product_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

    update_data = prod_in.model_dump(exclude_unset=True)
    if "categoria_id" in update_data:
        cat = db.query(Categoria).filter(Categoria.id == update_data["categoria_id"]).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Categoría no válida.")

    for field, value in update_data.items():
        setattr(producto, field, value)

    producto.fecha_actualizacion = datetime.utcnow()
    db.commit()
    db.refresh(producto)
    return producto

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    staff = Depends(require_staff)
):
    producto = db.query(Producto).filter(Producto.id == product_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

    # Si tiene historial de compras se desactiva para mantener integridad referencial
    if producto.detalles and len(producto.detalles) > 0:
        producto.activo = False
        db.commit()
        return {"message": "El producto se ha desactivado para proteger el historial de pedidos.", "id": product_id, "desactivado": True}

    db.delete(producto)
    db.commit()
    return {"message": "Producto eliminado exitosamente del catálogo.", "id": product_id, "eliminado": True}
