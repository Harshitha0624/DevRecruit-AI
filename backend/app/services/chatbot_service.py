from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

CHATBOT_DIR = PROJECT_ROOT / "ai-engine" / "chatbot"

if str(CHATBOT_DIR) not in sys.path:
    sys.path.insert(0, str(CHATBOT_DIR))


from chatbot import chat


def generate_chatbot_response(message: str):
    return chat(message)