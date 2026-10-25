"""
Supabase Storage integration for product photography.
Enforces strict file type whitelisting, size boundaries, and UUID filename safety.
"""
import uuid
from typing import Tuple
from app.core.config import settings

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


class StorageClient:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.bucket = settings.SUPABASE_STORAGE_BUCKET

    def validate_file(self, content_type: str, file_size: int) -> Tuple[bool, str]:
        """Validates MIME type and file size boundaries."""
        if content_type not in ALLOWED_MIME_TYPES:
            return False, f"Unsupported file type '{content_type}'. Allowed: JPEG, PNG, WEBP."
        if file_size > MAX_FILE_SIZE_BYTES:
            return False, f"File exceeds maximum allowed size of 5 MB."
        return True, ""

    def generate_safe_filename(self, content_type: str) -> str:
        """Generates a non-guessable collision-free filename."""
        extension = ALLOWED_MIME_TYPES.get(content_type, ".jpg")
        return f"{uuid.uuid4().hex}{extension}"

    def get_public_url(self, filename: str) -> str:
        """Constructs the canonical public URL for an asset."""
        return f"{self.url}/storage/v1/object/public/{self.bucket}/{filename}"


storage_client = StorageClient()
