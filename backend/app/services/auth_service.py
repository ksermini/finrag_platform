from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.future import select
from datetime import datetime, timedelta

from app.config import settings
from app.db import SessionLocal
from app.models.user import User

# -- Password hashing --
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using bcrypt.
    Args:
        password (str): The user's raw password.
    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """
    Verify a plain-text password against its hashed version.
    Args:
        password (str): The raw password input.
        hashed (str): The stored hashed password.
    Returns:
        bool: True if matched, False otherwise.
    """
    return pwd_context.verify(password, hashed)


# -- OAuth2 / Token handling --
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Create a JWT access token from user data.
    Args:
        data (dict): The payload to encode (e.g., {"sub": email, "role": "admin"}).
        expires_delta (timedelta, optional): Token expiry time.
    Returns:
        str: Encoded JWT token.
    """
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    Args:
        token (str): The JWT string.
    Raises:
        HTTPException: If decoding fails or token is invalid.
    Returns:
        dict: The decoded token payload.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# -- Dependencies --
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Retrieve the current user based on the provided JWT token.
    Args:
        token (str): JWT token from the Authorization header.
    Raises:
        HTTPException: If the token is invalid or the user is not found.
    Returns:
        User: The authenticated user from the database.
    """
    payload = decode_token(token)
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
        user (User): Injected from `get_current_user`.
    Raises:
        HTTPException: If the user is not an admin.
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
