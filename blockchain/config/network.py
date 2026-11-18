from pathlib import Path
import sys

CONFIG_DIR = Path(__file__).resolve().parent

if str(CONFIG_DIR) not in sys.path:
    sys.path.insert(0, str(CONFIG_DIR))

from settings import (
    DEFAULT_NETWORK,
    RPC_URL,
    CHAIN_ID
)


NETWORKS = {
    "local": {
        "rpc_url": RPC_URL,
        "chain_id": CHAIN_ID
    },
    "ethereum": {
        "rpc_url": RPC_URL,
        "chain_id": CHAIN_ID
    }
}


def get_network(network_name=None):
    network_name = (
        network_name or DEFAULT_NETWORK
    ).lower()

    return NETWORKS.get(
        network_name,
        NETWORKS["local"]
    )