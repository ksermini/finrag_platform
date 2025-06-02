from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, Request, Depends
from sqlalchemy.future import select
from datetime import datetime, timedelta

from app.config import settings
from app.db import SessionLocal
from app.models.user import User

# -- Password hashing --
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """Verify a plain-text password against its hashed version."""
    return pwd_context.verify(password, hashed)


# -- Token creation --
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """
    Create a longer-lived JWT refresh token (7 days).
    
    Args:
        data (dict): Payload including user email, ID, and role.
    
    Returns:
        str: Encoded JWT string.
    """
    to_encode = data.copy()
    to_encode.update({
        "exp": datetime.now() + timedelta(days=7),
        "type": "refresh"
    })
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    """
    print("TOKEN RECEIVED:", token)

    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print("DECODED PAYLOAD:", decoded)
        return decoded
    except JWTError as e:
        print("JWT DECODE ERROR:", str(e))
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )



# -- Dependencies --
async def get_current_user(request: Request) -> User:
    """
    Retrieve the current user based on the access_token cookie.

    Raises:
        HTTPException: If token is missing, invalid, or user not found.

    Returns:
        User: The authenticated user from the database.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Missing access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(token)
    print(">> Decoded Token Payload:", payload)
    email: str = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid token: missing subject",
            headers={"WWW-Authenticate": "Bearer"},
        )

    async with SessionLocal() as session:
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user


async def get_current_admin_user(user: User = Depends(get_current_user)) -> User:
    """
    Ensure the current user has admin privileges.

    Args:
        user (User): The current authenticated user from get_current_user.

    Raises:
        HTTPException: If user is not an admin.

    Returns:
        User: The validated admin user.
    """
    if not user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
