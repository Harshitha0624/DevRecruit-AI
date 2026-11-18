from company_questions import get_company_questions
from difficulty_manager import (
    normalize_difficulty,
    get_difficulty_description,
    get_default_marks
)


def generate_questions(
    skill="Python",
    difficulty="Medium",
    question_count=1,
    programming_language="Python",
    company=None
):
    difficulty = normalize_difficulty(difficulty)

    try:
        question_count = int(question_count)
    except (TypeError, ValueError):
        question_count = 1

    question_count = max(1, min(question_count, 20))

    question_bank = get_company_questions(company)

    matching_questions = [
        question
        for question in question_bank
        if question["difficulty"].lower() == difficulty.lower()
    ]

    if not matching_questions:
        matching_questions = question_bank

    generated_questions = []

    for index in range(question_count):
        template = matching_questions[
            index % len(matching_questions)
        ]

        question = {
            "question_number": index + 1,
            "title": template["title"],
            "description": template["description"],
            "skill": skill,
            "difficulty": difficulty,
            "difficulty_description": get_difficulty_description(
                difficulty
            ),
            "programming_language": programming_language,
            "input_format": template["input_format"],
            "output_format": template["output_format"],
            "constraints": template["constraints"],
            "sample_input": template["sample_input"],
            "sample_output": template["sample_output"],
            "marks": get_default_marks(difficulty)
        }

        generated_questions.append(question)

    return {
        "company": company or "General",
        "skill": skill,
        "difficulty": difficulty,
        "programming_language": programming_language,
        "question_count": question_count,
        "questions": generated_questions
    }


if __name__ == "__main__":
    result = generate_questions(
        skill="Python",
        difficulty="Medium",
        question_count=3,
        programming_language="Python",
        company="Amazon"
    )

    print("\nCODING QUESTION GENERATOR")
    print("=========================")

    print(f"Company: {result['company']}")
    print(f"Skill: {result['skill']}")
    print(f"Difficulty: {result['difficulty']}")
    print(f"Language: {result['programming_language']}")

    for question in result["questions"]:
        print("\n--------------------------------")
        print(f"Question {question['question_number']}")
        print(f"Title: {question['title']}")
        print(f"Description: {question['description']}")
        print(f"Marks: {question['marks']}")
        print(f"Sample Input: {question['sample_input']}")
        print(f"Sample Output: {question['sample_output']}")