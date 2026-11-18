from pathlib import Path
import hashlib
import json
import os

from dotenv import load_dotenv
from web3 import Web3


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

ARTIFACT_PATH = (
    PROJECT_ROOT
    / "blockchain"
    / "artifacts-local"
    / "RecruiterVerification.json"
)

ENV_PATH = PROJECT_ROOT / "backend" / ".env"


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv(ENV_PATH)

RPC_URL = os.getenv(
    "BLOCKCHAIN_RPC_URL",
    "http://127.0.0.1:8545"
)

PRIVATE_KEY = os.getenv(
    "BLOCKCHAIN_PRIVATE_KEY"
)

CONTRACT_ADDRESS = os.getenv(
    "RECRUITER_VERIFICATION_CONTRACT_ADDRESS"
)


# ============================================================
# VALIDATION
# ============================================================

if not PRIVATE_KEY:
    raise RuntimeError(
        "BLOCKCHAIN_PRIVATE_KEY is not configured in backend/.env"
    )

if not CONTRACT_ADDRESS:
    raise RuntimeError(
        "RECRUITER_VERIFICATION_CONTRACT_ADDRESS "
        "is not configured in backend/.env"
    )

if not ARTIFACT_PATH.exists():
    raise RuntimeError(
        f"RecruiterVerification artifact not found:\n{ARTIFACT_PATH}"
    )


# ============================================================
# WEB3 CONNECTION
# ============================================================

w3 = Web3(
    Web3.HTTPProvider(RPC_URL)
)

if not w3.is_connected():
    raise RuntimeError(
        f"Unable to connect to blockchain at {RPC_URL}"
    )


# ============================================================
# LOAD SMART CONTRACT ABI
# ============================================================

with open(
    ARTIFACT_PATH,
    "r",
    encoding="utf-8"
) as file:
    artifact = json.load(file)


contract = w3.eth.contract(
    address=Web3.to_checksum_address(
        CONTRACT_ADDRESS
    ),
    abi=artifact["abi"]
)


# ============================================================
# COMPANY HASH
# ============================================================

def generate_company_hash(
    company_name: str,
    registration_id: str,
    email: str
) -> str:

    data = (
        f"{company_name.strip().lower()}|"
        f"{registration_id.strip().lower()}|"
        f"{email.strip().lower()}"
    )

    return hashlib.sha256(
        data.encode("utf-8")
    ).hexdigest()


# ============================================================
# REGISTER RECRUITER
# ============================================================

def register_recruiter(
    recruiter_id: int,
    company_name: str,
    registration_id: str,
    email: str
):

    company_hash = generate_company_hash(
        company_name,
        registration_id,
        email
    )

    account = w3.eth.account.from_key(
        PRIVATE_KEY
    )

    nonce = w3.eth.get_transaction_count(
        account.address
    )

    transaction = contract.functions.registerRecruiter(
        recruiter_id,
        company_name,
        registration_id,
        company_hash
    ).build_transaction(
        {
            "from": account.address,
            "nonce": nonce,
            "gas": 500000,
            "gasPrice": w3.eth.gas_price,
            "chainId": w3.eth.chain_id,
        }
    )

    signed_transaction = account.sign_transaction(
        transaction
    )

    tx_hash = w3.eth.send_raw_transaction(
        signed_transaction.raw_transaction
    )

    receipt = w3.eth.wait_for_transaction_receipt(
        tx_hash
    )

    record = contract.functions.getRecruiter(
        recruiter_id
    ).call()

    return {
        "success": True,
        "recruiter_id": recruiter_id,
        "company_name": record[1],
        "registration_id": record[2],
        "company_hash": record[3],
        "verified": record[4],
        "verified_at": record[5],
        "active": record[6],
        "transaction_hash": tx_hash.hex(),
        "block_number": receipt.blockNumber,
        "contract_address": CONTRACT_ADDRESS,
    }


# ============================================================
# VERIFY RECRUITER
# ============================================================

def verify_recruiter(
    recruiter_id: int,
    company_name: str,
    registration_id: str,
    email: str
):

    company_hash = generate_company_hash(
        company_name,
        registration_id,
        email
    )

    result = contract.functions.verifyRecruiter(
        recruiter_id,
        company_hash
    ).call()

    return {
        "verified": result[0],
        "company_name": result[1],
        "registration_id": result[2],
        "verified_at": result[3],
        "company_hash": company_hash,
        "contract_address": CONTRACT_ADDRESS,
    }


# ============================================================
# GET RECRUITER
# ============================================================

def get_recruiter(
    recruiter_id: int
):

    record = contract.functions.getRecruiter(
        recruiter_id
    ).call()

    return {
        "recruiter_id": record[0],
        "company_name": record[1],
        "registration_id": record[2],
        "company_hash": record[3],
        "verified": record[4],
        "verified_at": record[5],
        "active": record[6],
        "contract_address": CONTRACT_ADDRESS,
    }