from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    full_name: str = Field(..., min_length=2, description="User full name")
    password: str = Field(..., min_length=6, description="Password (at least 6 chars)")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")

class OAuthLogin(BaseModel):
    email: EmailStr = Field(..., description="OAuth user email address")
    full_name: Optional[str] = Field(None, description="OAuth full name")
    provider: str = Field(default="google", description="OAuth provider name (google, github)")
    avatar_url: Optional[str] = Field(None, description="Profile picture URL")

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    provider: str
    token: str
    avatar_url: Optional[str] = None
    message: str = "Success"

class UserProfile(BaseModel):
    id: int
    email: str
    full_name: str
    provider: str
    avatar_url: Optional[str] = None
