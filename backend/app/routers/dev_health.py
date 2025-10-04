from fastapi import APIRouter
from importlib import util as importlib_util
from importlib.metadata import version, PackageNotFoundError
import platform
import sys

from app.core.config import settings

router = APIRouter(prefix="/dev", tags=["Dev"])

def _pkg_version(name: str) -> str:
    try:
        return version(name)
    except PackageNotFoundError:
        return "not-installed"

def _weasyprint_importable() -> bool:
    if not settings.use_weasyprint:
        return False
    spec = importlib_util.find_spec("weasyprint")
    if not spec:
        return False
    try:
        # import to ensure it at least loads
        import weasyprint  # noqa: F401
        return True
    except Exception:
        return False

def _pdf_engine() -> str:
    # Mirror runtime logic: only use Weasy if flag is set AND it imports
    return "weasyprint" if _weasyprint_importable() else "reportlab"

@router.get("/health")
def dev_health():
    engine = _pdf_engine()
    return {
        "app": "CoreShift API",
        "auth": {
            "allowed_dev_login": bool(settings.allowed_dev_login),
            "dev_admin_username": settings.dev_admin_username,
        },
        "pdf": {
            "engine": engine,
            "use_weasyprint_flag": bool(settings.use_weasyprint),
            "weasyprint_importable": _weasyprint_importable(),
            "reportlab_installed": importlib_util.find_spec("reportlab") is not None,
        },
        "env": {
            "python": sys.version.split()[0],
            "platform": platform.platform(),
        },
        "versions": {
            "fastapi": _pkg_version("fastapi"),
            "uvicorn": _pkg_version("uvicorn"),
            "weasyprint": _pkg_version("weasyprint"),
            "reportlab": _pkg_version("reportlab"),
            "sqlalchemy": _pkg_version("sqlalchemy"),
            "pydantic": _pkg_version("pydantic"),
        },
    }
