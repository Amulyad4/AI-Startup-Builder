import hashlib
import os
import hmac
import base64
import json
import time
from typing import Dict, Any, Optional

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-ai-startup-builder-jwt-key-2026")

def hash_password(password: str) -> str:
    """Hash password securely using PBKDF2 with HMAC-SHA256."""
    salt = os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return base64.b64encode(salt + pwd_hash).decode('utf-8')

def verify_password(stored_password_hash: str, provided_password: str) -> bool:
    """Verify provided password against stored PBKDF2 hash."""
    try:
        decoded = base64.b64decode(stored_password_hash.encode('utf-8'))
        salt = decoded[:16]
        stored_pwd_hash = decoded[16:]
        new_pwd_hash = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt, 100000)
        return hmac.compare_digest(stored_pwd_hash, new_pwd_hash)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_in_seconds: int = 86400 * 7) -> str:
    """Create lightweight signed JWT access token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = data.copy()
    payload["exp"] = int(time.time()) + expires_in_seconds

    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode('utf-8')).decode('utf-8').rstrip('=')
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8').rstrip('=')

    to_sign = f"{header_b64}.{payload_b64}"
    signature = hmac.new(SECRET_KEY.encode('utf-8'), to_sign.encode('utf-8'), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')

    return f"{to_sign}.{sig_b64}"

def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT access token signature and expiration."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_b64, payload_b64, sig_b64 = parts
        to_sign = f"{header_b64}.{payload_b64}"
        
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), to_sign.encode('utf-8'), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode('utf-8').rstrip('=')

        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return None

        # Add padding back if needed for base64 decode
        padded_payload = payload_b64 + '=' * (-len(payload_b64) % 4)
        payload = json.loads(base64.b64decode(padded_payload.encode('utf-8')).decode('utf-8'))

        if payload.get("exp", 0) < int(time.time()):
            return None

        return payload
    except Exception:
        return None
