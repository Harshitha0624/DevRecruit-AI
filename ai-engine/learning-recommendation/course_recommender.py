COURSE_CATALOG = {
    "python": {
        "title": "Python Programming",
        "level": "Beginner to Intermediate",
        "type": "Programming",
        "resources": [
            "Python fundamentals",
            "Object-oriented programming",
            "Data structures and algorithms",
            "File handling and APIs"
        ]
    },

    "fastapi": {
        "title": "FastAPI Backend Development",
        "level": "Intermediate",
        "type": "Backend",
        "resources": [
            "FastAPI routing",
            "Pydantic models",
            "Authentication and JWT",
            "REST API development",
            "Deployment"
        ]
    },

    "postgresql": {
        "title": "PostgreSQL",
        "level": "Intermediate",
        "type": "Database",
        "resources": [
            "SQL queries",
            "Joins and aggregations",
            "Indexes",
            "Transactions",
            "Database design"
        ]
    },

    "rest api": {
        "title": "REST API Development",
        "level": "Intermediate",
        "type": "Backend",
        "resources": [
            "HTTP methods",
            "Status codes",
            "REST architecture",
            "API authentication",
            "API security"
        ]
    },

    "docker": {
        "title": "Docker and Containers",
        "level": "Beginner to Intermediate",
        "type": "DevOps",
        "resources": [
            "Docker images",
            "Containers",
            "Dockerfiles",
            "Volumes and networks",
            "Container deployment"
        ]
    },

    "git": {
        "title": "Git and GitHub",
        "level": "Beginner",
        "type": "Developer Tools",
        "resources": [
            "Git fundamentals",
            "Branching",
            "Merging",
            "Pull requests",
            "Team collaboration"
        ]
    },

    "aws": {
        "title": "AWS Cloud",
        "level": "Intermediate",
        "type": "Cloud",
        "resources": [
            "EC2",
            "S3",
            "IAM",
            "Networking",
            "Cloud deployment"
        ]
    },

    "machine learning": {
        "title": "Machine Learning",
        "level": "Intermediate",
        "type": "AI/ML",
        "resources": [
            "Data preprocessing",
            "Feature engineering",
            "Supervised learning",
            "Model evaluation",
            "Model deployment"
        ]
    },

    "java": {
        "title": "Java Programming",
        "level": "Intermediate",
        "type": "Programming",
        "resources": [
            "OOP",
            "Collections",
            "Exception handling",
            "Generics",
            "Backend development"
        ]
    },

    "javascript": {
        "title": "JavaScript Development",
        "level": "Intermediate",
        "type": "Frontend",
        "resources": [
            "JavaScript fundamentals",
            "DOM",
            "Async programming",
            "Fetch API",
            "Modern JavaScript"
        ]
    },

    "react": {
        "title": "React Development",
        "level": "Intermediate",
        "type": "Frontend",
        "resources": [
            "Components",
            "Props and state",
            "Hooks",
            "Routing",
            "API integration"
        ]
    },

    "sql": {
        "title": "SQL",
        "level": "Beginner to Intermediate",
        "type": "Database",
        "resources": [
            "SELECT queries",
            "Joins",
            "Aggregations",
            "Subqueries",
            "Indexes"
        ]
    }
}


def recommend_courses(
    missing_skills: list[str]
) -> list[dict]:

    recommendations = []

    for skill in missing_skills:

        normalized_skill = (
            str(skill)
            .strip()
            .lower()
        )

        course = COURSE_CATALOG.get(
            normalized_skill
        )

        if course:

            recommendations.append({
                "skill": skill,
                "course_title": course["title"],
                "level": course["level"],
                "category": course["type"],
                "resources": course["resources"],
            })

        else:

            recommendations.append({
                "skill": skill,
                "course_title": (
                    f"Learn {skill}"
                ),
                "level": "To be assessed",
                "category": "General",
                "resources": [
                    f"Study {skill} fundamentals",
                    f"Practice {skill} with examples",
                    f"Build a project using {skill}",
                ],
            })

    return recommendations