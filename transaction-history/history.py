import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
HISTORY_FILE = PROJECT_ROOT / "transaction-history" / "history.json"


def get_history():
    if not HISTORY_FILE.exists():
        return []

    with open(
        HISTORY_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def print_history():
    history = get_history()

    print("\nBLOCKCHAIN TRANSACTION HISTORY")
    print("==============================")

    if not history:
        print("No transactions recorded.")
        return

    for item in history:
        print(
            f"Module: {item.get('module')}"
        )
        print(
            f"Operation: {item.get('operation')}"
        )
        print(
            f"Hash: {item.get('hash')}"
        )
        print(
            f"Block: {item.get('block_number')}"
        )
        print("-" * 40)


if __name__ == "__main__":
    print_history()