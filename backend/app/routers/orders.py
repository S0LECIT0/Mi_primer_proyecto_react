from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Pedido, DetallePedido, Producto, Usuario
from app.schemas import PedidoCreate, PedidoResponse, PedidoStatusUpdate
from app.security import get_current_user, require_staff

router = APIRouter(prefix="/api/orders", tags=["Pedidos"])

@router.get("", response_model=List[PedidoResponse])
def get_orders(
    estado: Optional[str] = Query(None, description="Filtrar por estado del pedido"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    query = db.query(Pedido)
    
    # Si es cliente, solo ve sus propios pedidos
    if current_user.rol_id == 3 or (current_user.rol and current_user.rol.nombre == "Cliente"):
        query = query.filter(Pedido.usuario_id == current_user.id)
    
    if estado:
        query = query.filter(Pedido.estado == estado)
        
    return query.order_by(Pedido.fecha_pedido.desc()).all()

@router.get("/{order_id}", response_model=PedidoResponse)
def get_order(
    order_id: int, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    pedido = db.query(Pedido).filter(Pedido.id == order_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
        
    # Verificar propiedad si es cliente
    if current_user.rol_id == 3 and pedido.usuario_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado a este pedido.")
        
    return pedido

@router.post("", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: PedidoCreate, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    # 1. Crear encabezado del pedido
    nuevo_pedido = Pedido(
        usuario_id=current_user.id,
        total=0.00,
        estado="Pendiente",
        metodo_pago=order_in.metodo_pago,
        direccion_entrega=order_in.direccion_entrega,
        notas=order_in.notas,
        fecha_pedido=datetime.utcnow(),
        fecha_actualizacion=datetime.utcnow()
    )
    db.add(nuevo_pedido)
    db.flush()  # Para obtener nuevo_pedido.id

    total_calculado = 0.0

    # 2. Procesar ítems y descontar inventario
    for item in order_in.items:
        producto = db.query(Producto).filter(Producto.id == item.producto_id).first()
        if not producto or not producto.activo:
            db.rollback()
            raise HTTPException(
                status_code=400, 
                detail=f"El producto con ID {item.producto_id} no está disponible."
            )
        if producto.stock < item.cantidad:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para '{producto.nombre}'. Disponible: {producto.stock}, Solicitado: {item.cantidad}"
            )

        subtotal = float(producto.precio) * item.cantidad
        total_calculado += subtotal

        # Descontar stock
        producto.stock -= item.cantidad

        detalle = DetallePedido(
            pedido_id=nuevo_pedido.id,
            producto_id=producto.id,
            cantidad=item.cantidad,
            precio_unitario=producto.precio,
            subtotal=subtotal
        )
        db.add(detalle)

    nuevo_pedido.total = total_calculado
    db.commit()
    db.refresh(nuevo_pedido)
    return nuevo_pedido

@router.put("/{order_id}/status", response_model=PedidoResponse)
def update_order_status(
    order_id: int,
    status_in: PedidoStatusUpdate,
    db: Session = Depends(get_db),
    staff: Usuario = Depends(require_staff)
):
    pedido = db.query(Pedido).filter(Pedido.id == order_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

    pedido.estado = status_in.estado
    pedido.fecha_actualizacion = datetime.utcnow()
    db.commit()
    db.refresh(pedido)
    return pedido
