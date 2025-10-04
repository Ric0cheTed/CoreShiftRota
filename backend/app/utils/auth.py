# app/utils/auth.py
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

# Use pbkdf2_sha256 to avoid bcrypt backend issues on Windows
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def decode_token(token: str):
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None

def _get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def _get_user_password_hash(user: User) -> Optional[str]:
    return getattr(user, "hashed_password", None) or getattr(user, "password_hash", None)

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = _get_user_by_username(db, username)
    if not user:
        return None
    stored_hash = _get_user_password_hash(user)
    if not stored_hash or not verify_password(password, stored_hash):
        return None
    return user

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = auth.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = _get_user_by_username(db, payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_role(*roles: str):
    def role_checker(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Access forbidden")
        return user
    return role_checker

def get_current_admin(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins are allowed to access this resource")
    return current_user

def get_user_or_dev_override(request: Request, db: Session = Depends(get_db)) -> User:
    if settings.allowed_dev_login:
        dev_user = _get_user_by_username(db, settings.dev_admin_username)
        if dev_user:
            return dev_user
        raise HTTPException(status_code=401, detail="Dev user not found")
    return get_current_user(request, db)
