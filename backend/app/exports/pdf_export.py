from datetime import datetime

# Try to use WeasyPrint if available (best layout fidelity).
WEASYPRINT_AVAILABLE = False
try:
    from weasyprint import HTML  # type: ignore
    WEASYPRINT_AVAILABLE = True
except Exception:
    WEASYPRINT_AVAILABLE = False

# Fallback: pure-Python PDF (no native deps) via ReportLab
from io import BytesIO
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

def _build_html(organisation: str, period: str, rows: list[dict]) -> str:
    """Minimal HTML template for WeasyPrint."""
    def esc(s):  # super light escaping
        return (str(s)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;"))
    head = f"""
    <html>
    <head>
        <meta charset="utf-8"/>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            h1 {{ margin: 0 0 4px 0; font-size: 20px; }}
            h2 {{ margin: 0 0 12px 0; font-size: 14px; color: #444; }}
            table {{ width: 100%; border-collapse: collapse; font-size: 12px; }}
            th, td {{ border: 1px solid #ddd; padding: 6px; text-align: left; }}
            th {{ background: #f3f3f3; }}
        </style>
    </head>
    <body>
        <h1>Rota Export — {esc(organisation)}</h1>
        <h2>{esc(period)} • Generated {datetime.now().strftime('%Y-%m-%d %H:%M')}</h2>
        <table>
            <thead>
                <tr>
                    <th>Visit ID</th>
                    <th>Client</th>
                    <th>Carer</th>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
    """
    body_rows = []
    for r in rows:
        body_rows.append(
            f"<tr>"
            f"<td>{esc(r.get('id',''))}</td>"
            f"<td>{esc(r.get('client_name',''))}</td>"
            f"<td>{esc(r.get('employee_name',''))}</td>"
            f"<td>{esc(r.get('date',''))}</td>"
            f"<td>{esc(r.get('start_time',''))}</td>"
            f"<td>{esc(r.get('end_time',''))}</td>"
            f"<td>{esc(r.get('notes',''))}</td>"
            f"</tr>"
        )
    tail = """
            </tbody>
        </table>
    </body>
    </html>
    """
    return head + "\n".join(body_rows) + tail

def _render_with_weasyprint(html: str) -> bytes:
    """Render HTML to PDF using WeasyPrint."""
    return HTML(string=html).write_pdf()

def _render_with_reportlab(organisation: str, period: str, rows: list[dict]) -> bytes:
    """Render a simple, readable rota PDF using ReportLab (no native deps)."""
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=landscape(A4),
        leftMargin=24, rightMargin=24, topMargin=24, bottomMargin=24
    )

    styles = getSampleStyleSheet()
    story = []
    title = f"Rota Export — {organisation}"
    sub = f"{period} • Generated {datetime.now().strftime('%Y-%m-%d %H:%M')}"

    story.append(Paragraph(title, styles["Title"]))
    story.append(Paragraph(sub, styles["Normal"]))
    story.append(Spacer(1, 12))

    # Table data
    data = [[
        "Visit ID", "Client", "Carer", "Date", "Start", "End", "Notes"
    ]]
    for r in rows:
        data.append([
            str(r.get("id", "")),
            str(r.get("client_name", "")),
            str(r.get("employee_name", "")),
            str(r.get("date", "")),
            str(r.get("start_time", "")),
            str(r.get("end_time", "")),
            str(r.get("notes", "")),
        ])

    table = Table(data, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f3f3f3")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.lightgrey),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, 0), 12),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.HexColor("#ffffff")]),
    ]))
    story.append(table)

    doc.build(story)
    pdf = buf.getvalue()
    buf.close()
    return pdf

def generate_rota_pdf(organisation: str, period: str, rows: list[dict]) -> bytes:
    """
    Generate a rota PDF.
    - If WeasyPrint is installed, render the HTML template (better styling).
    - Otherwise, fall back to ReportLab (portable, no native deps).
    Returns raw PDF bytes.
    """
    if WEASYPRINT_AVAILABLE:
        html = _build_html(organisation, period, rows)
        return _render_with_weasyprint(html)
    # Fallback
    return _render_with_reportlab(organisation, period, rows)
