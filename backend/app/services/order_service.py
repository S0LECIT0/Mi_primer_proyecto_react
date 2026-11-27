from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models import Pedido, DetallePedido, Producto, Usuario
from app.schemas import PedidoCreate


def list_orders(current_user: Usuario, db: Session, estado: Optional[str] = None) -> List[Pedido]:
    """Lista pedidos según el rol del usuario autenticado."""
    query = db.query(Pedido)

    if current_user.rol_id == 3 or (current_user.rol and current_user.rol.nombre == "Cliente"):
        query = query.filter(Pedido.usuario_id == current_user.id)

    if estado:
        query = query.filter(Pedido.estado == estado)

    return query.order_by(Pedido.fecha_pedido.desc()).all()


def get_order_or_404(order_id: int, current_user: Usuario, db: Session) -> Pedido:
    """Obtiene un pedido por ID validando que un cliente solo vea los suyos."""
    pedido = db.query(Pedido).filter(Pedido.id == order_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

    if current_user.rol_id == 3 and pedido.usuario_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado a este pedido.")

    return pedido


def create_order(order_in: PedidoCreate, current_user: Usuario, db: Session) -> Pedido:
    """Crea un pedido calculando totales y descontando inventario de forma transaccional."""
    nuevo_pedido = Pedido(
        usuario_id=current_user.id,
        total=0.00,
        estado="Pendiente",
        metodo_pago=order_in.metodo_pago,
        direccion_entrega=order_in.direccion_entrega,
        notas=order_in.notas,
        fecha_pedido=datetime.utcnow(),
        fecha_actualizacion=datetime.utcnow(),
    )
    db.add(nuevo_pedido)
    db.flush()

    total_calculado = 0.0

    for item in order_in.items:
        producto = db.query(Producto).filter(Producto.id == item.producto_id).first()
        if not producto or not producto.activo:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"El producto con ID {item.producto_id} no está disponible.",
            )
        if producto.stock < item.cantidad:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para '{producto.nombre}'. Disponible: {producto.stock}, Solicitado: {item.cantidad}",
            )

        subtotal = float(producto.precio) * item.cantidad
        total_calculado += subtotal
        producto.stock -= item.cantidad

        detalle = DetallePedido(
            pedido_id=nuevo_pedido.id,
            producto_id=producto.id,
            cantidad=item.cantidad,
            precio_unitario=producto.precio,
            subtotal=subtotal,
        )
        db.add(detalle)

    nuevo_pedido.total = total_calculado
    db.commit()
    db.refresh(nuevo_pedido)
    return nuevo_pedido


def update_order_status(order_id: int, estado: str, db: Session) -> Pedido:
    """Actualiza el estado de un pedido."""
    pedido = db.query(Pedido).filter(Pedido.id == order_id).first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

    pedido.estado = estado
    pedido.fecha_actualizacion = datetime.utcnow()
    db.commit()
    db.refresh(pedido)
    return pedido
