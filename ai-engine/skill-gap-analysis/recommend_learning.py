LEARNING_RESOURCES = {
    "python": {
        "topic": "Python Programming",
        "level": "Beginner to Intermediate",
        "recommendation": "Practice Python fundamentals, functions, OOP, and problem solving."
    },
    "fastapi": {
        "topic": "FastAPI",
        "level": "Intermediate",
        "recommendation": "Learn FastAPI routing, Pydantic schemas, authentication, and REST API development."
    },
    "postgresql": {
        "topic": "PostgreSQL",
        "level": "Intermediate",
        "recommendation": "Study SQL queries, joins, indexing, transactions, and PostgreSQL administration."
    },
    "rest api": {
        "topic": "REST APIs",
        "level": "Intermediate",
        "recommendation": "Learn HTTP methods, status codes, API design, authentication, and API security."
    },
    "docker": {
        "topic": "Docker",
        "level": "Beginner to Intermediate",
        "recommendation": "Learn containers, images, Dockerfiles, volumes, networks, and deployment."
    },
    "git": {
        "topic": "Git",
        "level": "Beginner",
        "recommendation": "Practice Git branching, commits, merging, pull requests, and collaboration workflows."
    },
    "aws": {
        "topic": "AWS Cloud",
        "level": "Intermediate",
        "recommendation": "Learn EC2, S3, IAM, networking, databases, and cloud deployment."
    },
    "machine learning": {
        "topic": "Machine Learning",
        "level": "Intermediate",
        "recommendation": "Study supervised learning, preprocessing, feature engineering, model evaluation, and deployment."
    },
    "java": {
        "topic": "Java Programming",
        "level": "Intermediate",
        "recommendation": "Practice Java OOP, collections, exception handling, and backend development."
    },
    "javascript": {
        "topic": "JavaScript",
        "level": "Intermediate",
        "recommendation": "Strengthen JavaScript fundamentals, asynchronous programming, DOM APIs, and modern ES features."
    },
    "react": {
        "topic": "React",
        "level": "Intermediate",
        "recommendation": "Learn React components, props, state, hooks, routing, and API integration."
    },
    "sql": {
        "topic": "SQL",
        "level": "Beginner to Intermediate",
        "recommendation": "Practice queries, joins, aggregations, subqueries, indexes, and database design."
    },
    "python": {
        "topic": "Python Programming",
        "level": "Beginner to Intermediate",
        "recommendation": "Practice Python fundamentals, OOP, data structures, and problem solving."
    }
}


def recommend_learning_resources(
    missing_skills: list[str]
) -> list[dict]:

    recommendations = []

    for skill in missing_skills:

        normalized = (
            str(skill)
            .strip()
            .lower()
        )

        resource = LEARNING_RESOURCES.get(
            normalized
        )

        if resource:

            recommendations.append({
                "skill": skill,
                **resource
            })

        else:

            recommendations.append({
                "skill": skill,
                "topic": skill,
                "level": "To be assessed",
                "recommendation": (
                    f"Build practical knowledge in {skill} "
                    "through tutorials, documentation, and projects."
                )
            })

    return recommendations