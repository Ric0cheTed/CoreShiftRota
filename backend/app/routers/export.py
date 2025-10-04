from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from zipfile import ZipFile
from io import BytesIO
from datetime import date, datetime

from app.database import get_db
from app.models.visit import Visit
from app.utils.auth import require_role
from app.exports.pdf_export import generate_rota_pdf  # ✅ links to the canvas file you're editing

router = APIRouter(prefix="/export", tags=["export"])

@router.get("/rota")
def export_rota(
    start: date = Query(...),
    end: date = Query(...),
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    visits = db.query(Visit).filter(Visit.date >= start, Visit.date <= end).all()
    pdf = generate_rota_pdf(visits)

    if not pdf:
        return {"error": "Failed to generate PDF."}

    zip_buffer = BytesIO()
    with ZipFile(zip_buffer, "w") as zip_file:
        zip_file.writestr("rota.pdf", pdf.getvalue())
    zip_buffer.seek(0)

    filename = f"rota_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
    return StreamingResponse(zip_buffer, media_type="application/zip", headers={
        "Content-Disposition": f"attachment; filename={filename}"
    })
