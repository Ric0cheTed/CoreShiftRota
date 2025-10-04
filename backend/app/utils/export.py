import os
import pandas as pd
from datetime import datetime
from app.database import SessionLocal
from app.models.visit import Visit
from app.models.employee import Employee
from app.models.client import Client
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

EXPORT_DIR = "exports"

def generate_exports():
    db = SessionLocal()
    date_folder = datetime.now().strftime("%Y-%m-%d")
    export_path = os.path.join(EXPORT_DIR, date_folder)
    os.makedirs(export_path, exist_ok=True)

    # ✅ Visits CSV
    visits = db.query(Visit).all()
    visit_data = [{
        "client": v.client.full_name,
        "employee": v.employee.full_name,
        "start_time": v.start_time,
        "end_time": v.end_time,
        "notes": v.notes or ""
    } for v in visits]
    pd.DataFrame(visit_data).to_csv(os.path.join(export_path, "visits.csv"), index=False)

    # ✅ Employees CSV
    emps = db.query(Employee).all()
    emp_data = [{
        "name": e.full_name,
        "role": e.role,
        "phone": e.phone,
        "email": e.email,
        "status": e.status
    } for e in emps]
    pd.DataFrame(emp_data).to_csv(os.path.join(export_path, "employees.csv"), index=False)

    # ✅ PDF Summary
    pdf_path = os.path.join(export_path, "visits_summary.pdf")
    c = canvas.Canvas(pdf_path, pagesize=A4)
    c.drawString(50, 800, f"CoreShift Visit Summary – {date_folder}")
    for i, v in enumerate(visit_data[:30]):
        c.drawString(50, 770 - i * 20, f"{v['start_time']} - {v['client']} ← {v['employee']}")
    c.save()

    db.close()
    return export_path
