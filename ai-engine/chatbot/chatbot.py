from intent_classifier import classify_intent
from response_generator import generate_response


def chat(message):
    if not isinstance(message, str):
        raise TypeError("Message must be a string.")

    message = message.strip()

    if not message:
        return {
            "message": "",
            "intent": "unknown",
            "response": "Please enter a message so I can help you."
        }

    intent = classify_intent(message)

    return generate_response(
        message=message,
        intent=intent
    )


if __name__ == "__main__":
    test_messages = [
        "Hello",
        "How can I improve my resume?",
        "How does the coding assessment work?",
        "How can I track my application?",
        "What courses should I learn?",
        "How does certificate verification work?"
    ]

    print("\nDEVRECRUIT AI CHATBOT")
    print("====================")

    for message in test_messages:
        result = chat(message)

        print(f"\nUser: {message}")
        print(f"Intent: {result['intent']}")
        print(f"Bot: {result['response']}")