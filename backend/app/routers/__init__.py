from .auth import router as auth_router
from .employee import router as employee_router
from .client import router as client_router
from .visit import router as visit_router
from .tag import router as tag_router
from .match import router as match_router
from .export import router as export_router
from .availability import router as availability_router
from .user import router as user_router
from .audit import router as audit
from .devtools import router as devtools_router  # ✅ ADDED
from .dev_health import router as dev_health_router


__all__ = [
    "auth_router", "employee_router", "client_router", "visit_router",
    "tag_router", "match_router", "export_router", "availability_router",
    "user_router", "audit", "devtools_router"  # ✅ FIXED NAME
]
