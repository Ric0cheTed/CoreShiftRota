# app/routers/auth.py  (excerpt – keep other endpoints)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.utils.auth import create_access_token, hash_password

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/dev-login")
def dev_login(db: Session = Depends(get_db)):
    if not settings.allowed_dev_login:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Dev login disabled")

    username = settings.dev_admin_username
    raw_pw = settings.dev_admin_password

    # Ensure user exists
    user = db.query(User).filter(User.username == username).first()
    if not user:
        user = User(username=username, role="admin")

        # Hash using bcrypt_sha256 (from app.utils.auth)
        hashed = hash_password(raw_pw)

        # Be tolerant to model field naming
        if hasattr(user, "hashed_password"):
            user.hashed_password = hashed
        if hasattr(user, "password_hash"):
            user.password_hash = hashed

        db.add(user)
        db.commit()
        db.refresh(user)

    # Issue a JWT
    token = create_access_token({"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
