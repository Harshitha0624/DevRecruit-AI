import requests

from ipfs_utils import (
    get_ipfs_api,
    normalize_cid
)


def pin_cid(cid):
    cid = normalize_cid(cid)

    api_url = get_ipfs_api()

    response = requests.post(
        f"{api_url}/api/v0/pin/add",
        params={
            "arg": cid
        },
        timeout=30
    )

    response.raise_for_status()

    return {
        "cid": cid,
        "pinned": True
    }


def unpin_cid(cid):
    cid = normalize_cid(cid)

    api_url = get_ipfs_api()

    response = requests.post(
        f"{api_url}/api/v0/pin/rm",
        params={
            "arg": cid
        },
        timeout=30
    )

    response.raise_for_status()

    return {
        "cid": cid,
        "pinned": False
    }