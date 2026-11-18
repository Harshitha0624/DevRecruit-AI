import os
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

BLOCKCHAIN_ROOT = PROJECT_ROOT / "blockchain"

DEFAULT_NETWORK = os.getenv(
    "BLOCKCHAIN_NETWORK",
    "local"
)

RPC_URL = os.getenv(
    "BLOCKCHAIN_RPC_URL",
    "http://127.0.0.1:8545"
)

CHAIN_ID = int(
    os.getenv(
        "BLOCKCHAIN_CHAIN_ID",
        "31337"
    )
)

CONTRACT_ADDRESS = os.getenv(
    "CERTIFICATE_CONTRACT_ADDRESS",
    ""
)

IPFS_API_URL = os.getenv(
    "IPFS_API_URL",
    "http://127.0.0.1:5001"
)

IPFS_GATEWAY_URL = os.getenv(
    "IPFS_GATEWAY_URL",
    "http://127.0.0.1:8080/ipfs"
)