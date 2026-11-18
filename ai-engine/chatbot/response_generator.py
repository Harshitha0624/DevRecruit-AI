from knowledge_base import get_knowledge


def generate_response(message, intent):
    knowledge = get_knowledge(intent)

    response = knowledge["response"]

    return {
        "message": message,
        "intent": intent,
        "response": response
    }