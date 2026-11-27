from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario
from app.schemas import PedidoCreate, PedidoResponse, PedidoStatusUpdate
from app.security import get_current_user, require_staff
from app.services import order_service

router = APIRouter(prefix="/api/orders", tags=["Pedidos"])


@router.get("", response_model=List[PedidoResponse])
def get_orders(
    estado: Optional[str] = Query(None, description="Filtrar por estado del pedido"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return order_service.list_orders(current_user, db, estado=estado)


@router.get("/{order_id}", response_model=PedidoResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return order_service.get_order_or_404(order_id, current_user, db)


@router.post("", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: PedidoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return order_service.create_order(order_in, current_user, db)


@router.put("/{order_id}/status", response_model=PedidoResponse)
def update_order_status(
    order_id: int,
    status_in: PedidoStatusUpdate,
    db: Session = Depends(get_db),
    staff: Usuario = Depends(require_staff),
):
    return order_service.update_order_status(order_id, status_in.estado, db)
