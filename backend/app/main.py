from app.routers.rota import router as rota_router
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.utils.auth import get_current_user
from app.core.config import settings
from app.db.session import Base, engine
from app.routers.dev_health import router as dev_health_router

from app.routers import (
    auth_router, employee_router, client_router, visit_router,
    tag_router, match_router, export_router, availability_router,
    user_router, audit, devtools_router, autogen
)
from app.routers.visit_conflicts import router as visit_conflicts_router
from app.routers.coverage import router as coverage_router

app = FastAPI(title="CoreShift API")

# Enable CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(auth_router)
app.include_router(employee_router)
app.include_router(client_router)
app.include_router(visit_router)
app.include_router(tag_router)
app.include_router(match_router)
app.include_router(export_router)
app.include_router(availability_router)
app.include_router(user_router)
app.include_router(audit)
app.include_router(devtools_router)
app.include_router(autogen.router)
app.include_router(visit_conflicts_router)  # ✅ no AttributeError
app.include_router(coverage_router)
app.include_router(dev_health_router)

# Inject Swagger JWT support
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="CoreShift API",
        version="1.0.0",
        description="CoreShift backend",
        routes=app.routes,
    )

    # Example extras you might be adding — use lowercase settings.*
    openapi_schema.setdefault("x-dev", {})
    openapi_schema["x-dev"]["allowed_dev_login"] = bool(settings.allowed_dev_login)
    openapi_schema["x-dev"]["dev_admin_username"] = settings.dev_admin_username
    openapi_schema["x-dev"]["pdf_engine_flag_use_weasyprint"] = bool(settings.use_weasyprint)

    app.openapi_schema = openapi_schema
    return app.openapi_schema

@app.get("/dev/token-debug")
def debug_token(current_user=Depends(get_current_user)):
    return {"user_id": current_user.id, "role": current_user.role}

@app.on_event("startup")
def _startup_create_tables():
    Base.metadata.create_all(bind=engine)  # safe no-op if tables already exist

app.openapi = custom_openapi

app.include_router(rota_router)
