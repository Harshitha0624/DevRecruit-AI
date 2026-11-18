import os
import re


DEFAULT_IPFS_API = "http://127.0.0.1:5001"


def get_ipfs_api():
    return os.getenv(
        "IPFS_API_URL",
        DEFAULT_IPFS_API
    ).rstrip("/")


def normalize_cid(cid):
    if not isinstance(cid, str):
        raise TypeError("CID must be a string.")

    return cid.strip()


def is_valid_cid(cid):
    cid = normalize_cid(cid)

    if not cid:
        return False

    # Supports common CIDv0 (Qm...) and CIDv1 formats.
    if cid.startswith("Qm") and len(cid) == 46:
        return bool(
            re.fullmatch(r"Qm[1-9A-HJ-NP-Za-km-z]{44}", cid)
        )

    if cid.startswith("b") and len(cid) > 10:
        return True

    return False


def gateway_url(cid):
    cid = normalize_cid(cid)

    if not is_valid_cid(cid):
        raise ValueError("Invalid IPFS CID.")

    return f"https://ipfs.io/ipfs/{cid}"