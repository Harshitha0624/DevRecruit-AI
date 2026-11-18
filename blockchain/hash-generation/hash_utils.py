import hashlib
from pathlib import Path


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(file_path) -> str:
    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError(
            f"File not found: {path}"
        )

    sha256 = hashlib.sha256()

    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(8192), b""):
            sha256.update(chunk)

    return sha256.hexdigest()


def normalize_hash(value: str) -> str:
    if not isinstance(value, str):
        raise TypeError("Hash must be a string.")

    return value.strip().lower()


def is_valid_sha256(value: str) -> bool:
    value = normalize_hash(value)

    if len(value) != 64:
        return False

    return all(
        character in "0123456789abcdef"
        for character in value
    )