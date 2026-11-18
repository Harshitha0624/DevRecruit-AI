import re


SKILL_ALIASES = {
    "Python": ["python"],
    "Java": ["java"],
    "JavaScript": ["javascript", "js"],
    "TypeScript": ["typescript", "ts"],
    "C++": ["c++"],
    "C#": ["c#", "c sharp"],
    "SQL": ["sql"],
    "HTML": ["html"],
    "CSS": ["css"],

    "FastAPI": ["fastapi"],
    "Flask": ["flask"],
    "Django": ["django"],
    "Spring Boot": ["spring boot"],
    "React": ["react", "react.js"],
    "Node.js": ["node.js", "nodejs"],
    "REST API": ["rest api", "restful api"],
    "GraphQL": ["graphql"],

    "PostgreSQL": ["postgresql", "postgres"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo db"],
    "Redis": ["redis"],

    "Git": ["git"],
    "GitHub": ["github"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],

    "AWS": ["aws", "amazon web services"],
    "Azure": ["azure"],
    "Google Cloud": ["google cloud", "gcp"],

    "Machine Learning": ["machine learning", "ml"],
    "Deep Learning": ["deep learning"],
    "Natural Language Processing": [
        "natural language processing",
        "nlp"
    ],
    "Computer Vision": ["computer vision"],
    "Generative AI": ["generative ai", "genai"],
    "LLM": [
        "llm",
        "large language model",
        "large language models"
    ],
    "RAG": [
        "rag",
        "retrieval augmented generation"
    ],

    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch"],
    "scikit-learn": [
        "scikit-learn",
        "sklearn"
    ],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "OpenCV": ["opencv"],

    "Blockchain": ["blockchain"],
    "Ethereum": ["ethereum"],
    "Solidity": ["solidity"],
    "Smart Contracts": [
        "smart contracts",
        "smart contract"
    ],
    "IPFS": ["ipfs"],

    "Power BI": ["power bi"],
    "Tableau": ["tableau"],
    "Excel": ["excel"],
}


def _contains_skill(text: str, alias: str) -> bool:
    escaped = re.escape(alias)

    special_skills = {
        "c++",
        "c#",
        "node.js",
        "scikit-learn"
    }

    if alias.lower() in special_skills:
        return re.search(
            escaped,
            text,
            re.IGNORECASE
        ) is not None

    return re.search(
        rf"(?<!\w){escaped}(?!\w)",
        text,
        re.IGNORECASE
    ) is not None


def extract_skills(text: str) -> list[str]:
    if not text:
        return []

    found = []

    for canonical_name, aliases in SKILL_ALIASES.items():

        for alias in aliases:

            if _contains_skill(text, alias):
                found.append(canonical_name)
                break

    return sorted(set(found))


def extract_skills_by_category(text: str) -> dict:
    skills = extract_skills(text)

    categories = {
        "programming_languages": {
            "Python",
            "Java",
            "JavaScript",
            "TypeScript",
            "C++",
            "C#",
            "SQL",
        },

        "web_backend": {
            "FastAPI",
            "Flask",
            "Django",
            "Spring Boot",
            "React",
            "Node.js",
            "REST API",
            "GraphQL",
        },

        "databases": {
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Redis",
        },

        "cloud_devops": {
            "AWS",
            "Azure",
            "Google Cloud",
            "Docker",
            "Kubernetes",
        },

        "ai_ml": {
            "Machine Learning",
            "Deep Learning",
            "Natural Language Processing",
            "Computer Vision",
            "Generative AI",
            "LLM",
            "RAG",
            "TensorFlow",
            "PyTorch",
            "scikit-learn",
            "Pandas",
            "NumPy",
            "OpenCV",
        },

        "blockchain": {
            "Blockchain",
            "Ethereum",
            "Solidity",
            "Smart Contracts",
            "IPFS",
        },

        "tools": {
            "Git",
            "GitHub",
            "Power BI",
            "Tableau",
            "Excel",
        },
    }

    result = {}

    for category, allowed_skills in categories.items():

        result[category] = [
            skill
            for skill in skills
            if skill in allowed_skills
        ]

    return result