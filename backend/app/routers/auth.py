from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario
from app.schemas import (
    UsuarioCreate,
    UsuarioResponse,
    LoginRequest,
    TokenResponse,
    RecoverPasswordRequest,
    RecoverPasswordResponse,
    ResetPasswordRequest,
    MessageResponse,
)
from app.security import get_current_user
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(usuario_in: UsuarioCreate, db: Session = Depends(get_db)):
    return auth_service.register_user(usuario_in, db)


@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.authenticate_user(credentials.email, credentials.password, db)


@router.post("/token", response_model=TokenResponse)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Endpoint OAuth2 Password Flow para autenticación interactiva desde Swagger UI (/docs)."""
    return auth_service.authenticate_user(form_data.username, form_data.password, db)


@router.post("/recover-password", response_model=RecoverPasswordResponse)
def recover_password(payload: RecoverPasswordRequest, db: Session = Depends(get_db)):
    """Solicita un token temporal JWT de recuperación de contraseña para un correo registrado."""
    return auth_service.request_password_recovery(payload.email, db)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Restablece la contraseña validando el token de recuperación y almacenando el hash bcrypt."""
    return auth_service.reset_user_password(payload.token, payload.new_password, db)


@router.get("/me", response_model=UsuarioResponse)
def get_current_user_profile(current_user: Usuario = Depends(get_current_user)):
    return current_user
