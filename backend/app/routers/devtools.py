from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.devtools.seed_helpers import run_reset, run_seed
from app.utils.auth import require_role, get_user_or_dev_override

router = APIRouter(prefix="/dev", tags=["Dev"])

@router.post("/reset")
def reset_dev_data(db: Session = Depends(get_db)):
    try:
        run_reset(db)
        return {"message": "✅ Reset complete"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failed: {str(e)}")

@router.post("/seed")
def seed_dev_data(db: Session = Depends(get_db)):
    try:
        run_seed(db)
        return {"message": "Seed complete"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": f"Seed failed: {str(e)}"})

