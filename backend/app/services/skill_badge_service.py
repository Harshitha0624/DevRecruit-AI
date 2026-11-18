from pathlib import Path
import hashlib
import json
import os

from dotenv import load_dotenv
from web3 import Web3


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

ARTIFACT_PATH = (
    PROJECT_ROOT
    / "blockchain"
    / "artifacts-local"
    / "SkillBadge.json"
)

ENV_PATH = PROJECT_ROOT / "backend" / ".env"


# ============================================================
# ENVIRONMENT
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
    "SKILL_BADGE_CONTRACT_ADDRESS"
)


# ============================================================
# VALIDATION
# ============================================================

if not PRIVATE_KEY:
    raise RuntimeError(
        "BLOCKCHAIN_PRIVATE_KEY is not configured."
    )

if not CONTRACT_ADDRESS:
    raise RuntimeError(
        "SKILL_BADGE_CONTRACT_ADDRESS is not configured."
    )

if not ARTIFACT_PATH.exists():
    raise RuntimeError(
        f"SkillBadge artifact not found: {ARTIFACT_PATH}"
    )


# ============================================================
# WEB3
# ============================================================

w3 = Web3(
    Web3.HTTPProvider(RPC_URL)
)

if not w3.is_connected():
    raise RuntimeError(
        f"Unable to connect to blockchain at {RPC_URL}"
    )


# ============================================================
# CONTRACT
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
# BADGE HASH
# ============================================================

def generate_badge_hash(
    candidate_id: int,
    skill: str,
    score: float
) -> str:

    data = (
        f"{int(candidate_id)}|"
        f"{skill.strip().lower()}|"
        f"{float(score):.2f}"
    )

    return hashlib.sha256(
        data.encode("utf-8")
    ).hexdigest()


# ============================================================
# ISSUE BADGE
# ============================================================

def issue_badge(
    badge_id: int,
    candidate_id: int,
    skill: str,
    score: float
):

    badge_hash = generate_badge_hash(
        candidate_id,
        skill,
        score
    )

    account = w3.eth.account.from_key(
        PRIVATE_KEY
    )

    nonce = w3.eth.get_transaction_count(
        account.address
    )

    transaction = contract.functions.issueBadge(
        badge_id,
        candidate_id,
        skill,
        int(score),
        badge_hash
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

    record = contract.functions.getBadge(
        badge_id
    ).call()

    return {
        "success": True,
        "badge_id": record[0],
        "candidate_id": record[1],
        "skill": record[2],
        "score": record[3],
        "badge_hash": record[4],
        "issued_at": record[5],
        "active": record[6],
        "transaction_hash": tx_hash.hex(),
        "block_number": receipt.blockNumber,
        "contract_address": CONTRACT_ADDRESS,
    }


# ============================================================
# VERIFY BADGE
# ============================================================

def verify_badge(
    badge_id: int,
    candidate_id: int,
    skill: str,
    score: float
):

    badge_hash = generate_badge_hash(
        candidate_id,
        skill,
        score
    )

    result = contract.functions.verifyBadge(
        badge_id,
        badge_hash
    ).call()

    return {
        "verified": result[0],
        "candidate_id": result[1],
        "skill": result[2],
        "score": result[3],
        "issued_at": result[4],
        "badge_hash": badge_hash,
        "contract_address": CONTRACT_ADDRESS,
    }


# ============================================================
# GET BADGE
# ============================================================

def get_badge(
    badge_id: int
):

    record = contract.functions.getBadge(
        badge_id
    ).call()

    return {
        "badge_id": record[0],
        "candidate_id": record[1],
        "skill": record[2],
        "score": record[3],
        "badge_hash": record[4],
        "issued_at": record[5],
        "active": record[6],
        "contract_address": CONTRACT_ADDRESS,
    }