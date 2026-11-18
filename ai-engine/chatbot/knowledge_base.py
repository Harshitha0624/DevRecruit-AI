KNOWLEDGE_BASE = {
    "jobs": {
        "response": (
            "You can browse available developer jobs, view job requirements, "
            "check AI job-match scores, and apply to suitable positions."
        )
    },
    "resume": {
        "response": (
            "The platform can analyze your resume, extract skills and "
            "experience, calculate an ATS score, and identify missing skills."
        )
    },
    "assessment": {
        "response": (
            "You can take skill assessments and coding tests. Coding "
            "submissions are evaluated using functional test cases and AI "
            "analysis of quality, complexity, and plagiarism risk."
        )
    },
    "interview": {
        "response": (
            "The platform supports interview scheduling and AI-generated "
            "interview feedback based on technical, communication, "
            "problem-solving, and behavioral performance."
        )
    },
    "learning": {
        "response": (
            "The Learning Hub provides personalized learning recommendations "
            "based on skill gaps and career goals."
        )
    },
    "application": {
        "response": (
            "You can track applications through stages such as applied, "
            "under review, assessment, interview, offer, or rejection."
        )
    },
    "career": {
        "response": (
            "The AI career module analyzes your skills and experience and "
            "suggests suitable developer career paths."
        )
    },
    "blockchain": {
        "response": (
            "Blockchain-based credential verification is designed to verify "
            "certificate authenticity using decentralized records."
        )
    },
    "greeting": {
        "response": (
            "Hello! I'm the DevRecruit AI assistant. I can help with jobs, "
            "resumes, assessments, applications, interviews, learning, "
            "career paths, and credentials."
        )
    }
}


def get_knowledge(intent):
    return KNOWLEDGE_BASE.get(
        intent,
        {
            "response": (
                "I can help you with jobs, resumes, assessments, "
                "applications, interviews, learning, career paths, "
                "and credential verification."
            )
        }
    )