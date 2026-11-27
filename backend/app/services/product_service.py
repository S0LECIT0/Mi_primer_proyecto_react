from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models import Producto, Categoria
from app.schemas import ProductoCreate, ProductoUpdate, CategoriaCreate


def list_categories(db: Session) -> List[Categoria]:
    """Lista las categorías activas ordenadas por ID."""
    return db.query(Categoria).filter(Categoria.activo == True).order_by(Categoria.id.asc()).all()


def create_category(cat_in: CategoriaCreate, db: Session) -> Categoria:
    """Crea una nueva categoría validando que su nombre sea único."""
    nombre_limpio = cat_in.nombre.strip()
    if db.query(Categoria).filter(Categoria.nombre == nombre_limpio).first():
        raise HTTPException(status_code=400, detail="Ya existe una categoría con este nombre.")

    nueva_cat = Categoria(
        nombre=nombre_limpio,
        descripcion=cat_in.descripcion,
        activo=cat_in.activo,
    )
    db.add(nueva_cat)
    db.commit()
    db.refresh(nueva_cat)
    return nueva_cat


def list_products(
    db: Session,
    categoria_id: Optional[int] = None,
    search: Optional[str] = None,
    solo_activos: bool = True,
) -> List[Producto]:
    """Lista productos con filtros de estado, categoría y búsqueda."""
    query = db.query(Producto)
    if solo_activos:
        query = query.filter(Producto.activo == True)
    if categoria_id:
        query = query.filter(Producto.categoria_id == categoria_id)
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (Producto.nombre.ilike(search_filter)) | (Producto.descripcion.ilike(search_filter))
        )
    return query.order_by(Producto.id.asc()).all()


def get_product_or_404(product_id: int, db: Session) -> Producto:
    """Obtiene un producto por ID o lanza 404."""
    producto = db.query(Producto).filter(Producto.id == product_id).first()
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto


def create_product(prod_in: ProductoCreate, db: Session) -> Producto:
    """Crea un producto validando la existencia de la categoría."""
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
        fecha_actualizacion=datetime.utcnow(),
    )
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto


def update_product(product_id: int, prod_in: ProductoUpdate, db: Session) -> Producto:
    """Actualiza los campos enviados de un producto existente."""
    producto = get_product_or_404(product_id, db)
    update_data = prod_in.model_dump(exclude_unset=True)

    if "categoria_id" in update_data:
        cat = db.query(Categoria).filter(Categoria.id == update_data["categoria_id"]).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Categoría no válida.")

    for field, value in update_data.items():
        if isinstance(value, str) and field in ("nombre", "descripcion"):
            value = value.strip()
        setattr(producto, field, value)

    producto.fecha_actualizacion = datetime.utcnow()
    db.commit()
    db.refresh(producto)
    return producto


def delete_product(product_id: int, db: Session) -> dict:
    """Elimina un producto o lo desactiva si tiene detalles de pedidos asociados."""
    producto = get_product_or_404(product_id, db)

    if producto.detalles and len(producto.detalles) > 0:
        producto.activo = False
        db.commit()
        return {
            "message": "El producto se ha desactivado para proteger el historial de pedidos.",
            "id": product_id,
            "desactivado": True,
        }

    db.delete(producto)
    db.commit()
    return {
        "message": "Producto eliminado exitosamente del catálogo.",
        "id": product_id,
        "eliminado": True,
    }
