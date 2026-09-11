import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, OAuthLogin, UserResponse, UserProfile
from app.services.auth import hash_password, verify_password, create_access_token, verify_access_token

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user with email and password."""
    email_clean = user_data.email.lower().strip()
    
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email address already exists. Please sign in instead.")

    hashed_pw = hash_password(user_data.password)
    user = User(
        email=email_clean,
        full_name=user_data.full_name.strip(),
        hashed_password=hashed_pw,
        provider="email"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.full_name})

    logger.info(f"New user registered: {user.email} (ID: {user.id})")
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        provider="email",
        token=token,
        message="Account created successfully!"
    )

@router.post("/login", response_model=UserResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Sign in an existing user with email and password."""
    email_clean = user_data.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user or not user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password. Please check your credentials.")

    if not verify_password(user.hashed_password, user_data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password. Please check your credentials.")

    token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.full_name})

    logger.info(f"User signed in: {user.email} (ID: {user.id})")
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        provider=user.provider or "email",
        token=token,
        message="Signed in successfully!"
    )

@router.post("/oauth", response_model=UserResponse)
def oauth_login(oauth_data: OAuthLogin, db: Session = Depends(get_db)):
    """Sign in or register an OAuth user (Google / GitHub)."""
    email_clean = oauth_data.email.lower().strip()
    provider = oauth_data.provider.lower().strip()
    full_name = (oauth_data.full_name or email_clean.split('@')[0]).strip()

    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        user = User(
            email=email_clean,
            full_name=full_name,
            provider=provider,
            avatar_url=oauth_data.avatar_url
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"New OAuth user created via {provider}: {user.email}")
    else:
        changed = False
        if oauth_data.full_name and user.full_name != oauth_data.full_name:
            user.full_name = oauth_data.full_name
            changed = True
        if oauth_data.avatar_url and user.avatar_url != oauth_data.avatar_url:
            user.avatar_url = oauth_data.avatar_url
            changed = True
        if changed:
            db.commit()
            db.refresh(user)
        logger.info(f"Existing OAuth user signed in via {provider}: {user.email}")

    token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.full_name})

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        provider=user.provider,
        avatar_url=user.avatar_url,
        token=token,
        message=f"Signed in via {provider.capitalize()} successfully!"
    )

@router.get("/me", response_model=UserProfile)
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Fetch current user profile using JWT token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token missing or invalid.")
    
    token = authorization.split(" ")[1]
    payload = verify_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Token expired or invalid.")

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found.")

    return UserProfile(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        provider=user.provider,
        avatar_url=user.avatar_url
    )
