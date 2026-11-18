from pathlib import Path
import sys

import requests

CURRENT_DIR = Path(__file__).resolve().parent

if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from ipfs_utils import get_ipfs_api, gateway_url


def upload_file_to_ipfs(file_path):
    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError(
            f"File not found: {path}"
        )

    api_url = get_ipfs_api()

    with path.open("rb") as file:
        response = requests.post(
            f"{api_url}/api/v0/add",
            files={
                "file": (
                    path.name,
                    file,
                    "application/octet-stream"
                )
            },
            params={
                "pin": "true"
            },
            timeout=30
        )

    response.raise_for_status()

    data = response.json()

    cid = data.get("Hash")

    if not cid:
        raise RuntimeError(
            "IPFS did not return a CID."
        )

    return {
        "file_name": path.name,
        "cid": cid,
        "size": data.get("Size"),
        "gateway_url": gateway_url(cid)
    }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(
            "Usage: python upload_to_ipfs.py <file>"
        )
        sys.exit(1)

    try:
        result = upload_file_to_ipfs(sys.argv[1])

        print("\nIPFS UPLOAD")
        print("===========")
        print(f"File: {result['file_name']}")
        print(f"CID: {result['cid']}")
        print(f"Gateway: {result['gateway_url']}")

    except Exception as error:
        print(f"IPFS upload failed: {error}")
        sys.exit(1)