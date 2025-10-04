# app/core/security.py
from passlib.context import CryptContext

# Use pbkdf2_sha256 (pure-Python, no 72-byte limit or native deps)
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
