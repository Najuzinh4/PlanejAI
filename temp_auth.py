from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.usuario import UsuarioOut
from app.core.security import (
    create_access_token,
    verify_password,
    hash_password,
)
from app.core.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado")

    user = Usuario(
        nome=payload.nome,
        email=payload.email,
        senha=hash_password(payload.senha),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id_usuario), "email": user.email})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user: Optional[Usuario] = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if not user or not verify_password(payload.senha, user.senha):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")

    token = create_access_token({"sub": str(user.id_usuario), "email": user.email})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UsuarioOut)
def me(current_user: Usuario = Depends(get_current_user)):
    return current_user

