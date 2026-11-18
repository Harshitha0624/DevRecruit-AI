import json
import os
from pathlib import Path

from dotenv import load_dotenv
from web3 import Web3


# =======================================================
# PROJECT PATHS
# =======================================================

BACKEND_ROOT = Path(__file__).resolve().parents[2]

PROJECT_ROOT = Path(__file__).resolve().parents[3]


# Load backend/.env
load_dotenv(BACKEND_ROOT / ".env")


# =======================================================
# BLOCKCHAIN CONFIGURATION
# =======================================================

RPC_URL = os.getenv(
    "BLOCKCHAIN_RPC_URL",
    "http://127.0.0.1:8545"
)

PRIVATE_KEY = os.getenv(
    "BLOCKCHAIN_PRIVATE_KEY"
)

CONTRACT_ADDRESS = os.getenv(
    "CERTIFICATE_CONTRACT_ADDRESS"
)


# Artifact is in project-root/blockchain
ARTIFACT_PATH = (
    PROJECT_ROOT
    / "blockchain"
    / "artifacts-local"
    / "CertificateVerification.json"
)


# =======================================================
# BLOCKCHAIN OBJECTS
# =======================================================

def _get_blockchain_objects():

    if not PRIVATE_KEY:
        raise RuntimeError(
            "BLOCKCHAIN_PRIVATE_KEY is not configured."
        )

    if not CONTRACT_ADDRESS:
        raise RuntimeError(
            "CERTIFICATE_CONTRACT_ADDRESS is not configured."
        )

    if not ARTIFACT_PATH.exists():
        raise FileNotFoundError(
            f"Contract artifact not found: {ARTIFACT_PATH}"
        )

    with ARTIFACT_PATH.open(
        "r",
        encoding="utf-8"
    ) as file:
        artifact = json.load(file)

    web3 = Web3(
        Web3.HTTPProvider(RPC_URL)
    )

    if not web3.is_connected():
        raise ConnectionError(
            f"Unable to connect to blockchain at {RPC_URL}"
        )

    account = web3.eth.account.from_key(
        PRIVATE_KEY
    )

    contract = web3.eth.contract(
        address=Web3.to_checksum_address(
            CONTRACT_ADDRESS
        ),
        abi=artifact["abi"]
    )

    return web3, account, contract


# =======================================================
# REGISTER CERTIFICATE
# =======================================================

def register_certificate(
    certificate_id,
    candidate_id,
    certificate_hash,
    ipfs_cid,
    issuer
):

    web3, account, contract = (
        _get_blockchain_objects()
    )

    nonce = web3.eth.get_transaction_count(
        account.address
    )

    transaction = contract.functions.registerCertificate(
        certificate_id,
        int(candidate_id),
        certificate_hash,
        ipfs_cid,
        issuer
    ).build_transaction({
        "from": account.address,
        "nonce": nonce,
        "chainId": web3.eth.chain_id,
        "gas": 500000,
        "gasPrice": web3.eth.gas_price
    })

    signed_transaction = (
        web3.eth.account.sign_transaction(
            transaction,
            PRIVATE_KEY
        )
    )

    transaction_hash = (
        web3.eth.send_raw_transaction(
            signed_transaction.raw_transaction
        )
    )

    receipt = (
        web3.eth.wait_for_transaction_receipt(
            transaction_hash
        )
    )

    return {
        "transaction_hash": transaction_hash.hex(),
        "block_number": receipt.blockNumber,
        "contract_address": CONTRACT_ADDRESS,
        "certificate_id": certificate_id
    }


# =======================================================
# VERIFY CERTIFICATE
# =======================================================

def verify_certificate(
    certificate_id,
    certificate_hash
):

    _, _, contract = (
        _get_blockchain_objects()
    )

    result = contract.functions.verifyCertificate(
        certificate_id,
        certificate_hash
    ).call()

    return {
        "verified": result[0],
        "ipfs_cid": result[1],
        "issuer": result[2],
        "issued_at": result[3]
    }


# =======================================================
# GET CERTIFICATE
# =======================================================

def get_certificate(
    certificate_id
):

    _, _, contract = (
        _get_blockchain_objects()
    )

    result = contract.functions.getCertificate(
        certificate_id
    ).call()

    return {
        "certificate_id": result[0],
        "candidate_id": result[1],
        "certificate_hash": result[2],
        "ipfs_cid": result[3],
        "issuer": result[4],
        "issued_at": result[5],
        "active": result[6]
    }