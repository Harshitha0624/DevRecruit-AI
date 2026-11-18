from pathlib import Path
import sys

import requests

CURRENT_DIR = Path(__file__).resolve().parent

if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from ipfs_utils import get_ipfs_api, normalize_cid


def download_file_from_ipfs(cid, output_path):
    cid = normalize_cid(cid)

    output = Path(output_path)
    output.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    api_url = get_ipfs_api()

    response = requests.post(
        f"{api_url}/api/v0/cat",
        params={
            "arg": cid
        },
        timeout=30
    )

    response.raise_for_status()

    output.write_bytes(
        response.content
    )

    return {
        "cid": cid,
        "output_path": str(output),
        "size": len(response.content)
    }