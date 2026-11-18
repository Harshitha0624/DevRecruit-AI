import json
from pathlib import Path

from web3 import Web3


PROJECT_ROOT = Path(__file__).resolve().parents[1]
HISTORY_FILE = PROJECT_ROOT / "transaction-history" / "history.json"


def get_web3(
    rpc_url="http://127.0.0.1:8545"
):
    w3 = Web3(
        Web3.HTTPProvider(rpc_url)
    )

    if not w3.is_connected():
        raise RuntimeError(
            f"Unable to connect to {rpc_url}"
        )

    return w3


def get_transaction(tx_hash, rpc_url="http://127.0.0.1:8545"):
    w3 = get_web3(rpc_url)

    tx = w3.eth.get_transaction(tx_hash)

    return {
        "hash": tx.hash.hex(),
        "from": tx["from"],
        "to": tx["to"],
        "value": str(
            w3.from_wei(tx["value"], "ether")
        ),
        "nonce": tx["nonce"],
        "block_number": tx["blockNumber"],
    }


def get_transaction_status(
    tx_hash,
    rpc_url="http://127.0.0.1:8545"
):
    w3 = get_web3(rpc_url)

    receipt = w3.eth.get_transaction_receipt(
        tx_hash
    )

    return {
        "hash": tx_hash,
        "status": (
            "success"
            if receipt["status"] == 1
            else "failed"
        ),
        "block_number": receipt["blockNumber"],
        "gas_used": receipt["gasUsed"],
    }


def save_transaction(
    transaction,
    module,
    operation
):
    HISTORY_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    if HISTORY_FILE.exists():
        with open(
            HISTORY_FILE,
            "r",
            encoding="utf-8"
        ) as file:
            history = json.load(file)
    else:
        history = []

    record = {
        "module": module,
        "operation": operation,
        **transaction
    }

    history.append(record)

    with open(
        HISTORY_FILE,
        "w",
        encoding="utf-8"
    ) as file:
        json.dump(
            history,
            file,
            indent=2
        )

    return record