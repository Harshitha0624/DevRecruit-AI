CAREER_PROFILES = {
    "backend_developer": {
        "title": "Backend Developer",
        "skills": {
            "python",
            "java",
            "fastapi",
            "flask",
            "django",
            "node.js",
            "sql",
            "postgresql",
            "mysql",
            "rest api",
        },
    },
    "frontend_developer": {
        "title": "Frontend Developer",
        "skills": {
            "javascript",
            "typescript",
            "react",
            "html",
            "css",
        },
    },
    "data_analyst": {
        "title": "Data Analyst",
        "skills": {
            "python",
            "sql",
            "pandas",
            "numpy",
            "excel",
            "power bi",
            "tableau",
        },
    },
    "machine_learning_engineer": {
        "title": "Machine Learning Engineer",
        "skills": {
            "python",
            "machine learning",
            "scikit-learn",
            "tensorflow",
            "pytorch",
            "pandas",
            "numpy",
        },
    },
    "ai_engineer": {
        "title": "AI Engineer",
        "skills": {
            "python",
            "machine learning",
            "deep learning",
            "natural language processing",
            "computer vision",
            "generative ai",
            "llm",
            "pytorch",
            "tensorflow",
        },
    },
    "cloud_devops_engineer": {
        "title": "Cloud / DevOps Engineer",
        "skills": {
            "docker",
            "kubernetes",
            "aws",
            "azure",
            "google cloud",
            "git",
        },
    },
}


def normalize_skills(skills) -> set[str]:
    if not skills:
        return set()

    return {
        str(skill).strip().lower()
        for skill in skills
        if str(skill).strip()
    }