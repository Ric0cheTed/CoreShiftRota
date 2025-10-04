import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/drive"]
SERVICE_ACCOUNT_FILE = "exports/credentials.json"
FOLDER_NAME = "CoreShift Exports"

def upload_pdf_to_drive(local_pdf_path: str) -> str:
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("drive", "v3", credentials=credentials)

    # Find folder ID by name
    response = service.files().list(
        q=f"mimeType='application/vnd.google-apps.folder' and name='{FOLDER_NAME}'",
        spaces='drive', fields="files(id, name)", pageSize=1
    ).execute()
    folders = response.get("files", [])

    if not folders:
        raise Exception(f"Folder '{FOLDER_NAME}' not found on Google Drive")

    folder_id = folders[0]["id"]

    file_metadata = {
        "name": os.path.basename(local_pdf_path),
        "parents": [folder_id],
    }
    media = MediaFileUpload(local_pdf_path, mimetype="application/pdf")
    file = service.files().create(body=file_metadata, media_body=media, fields="id").execute()
    return file.get("id")
