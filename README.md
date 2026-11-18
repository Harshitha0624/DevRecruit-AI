# DevRecruit AI

AI-Powered Decentralized Developer Recruitment Platform

 An intelligent recruitment platform designed to streamline developer hiring through AI-assisted candidate evaluation, skill analysis, coding assessments, and blockchain-based verification.

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Application Modules](#-application-modules)
- [Installation and Setup](#-installation-and-setup)
- [Backend API Documentation](#-backend-api-documentation)
- [Blockchain Development](#-blockchain-development)
- [Security](#-security)
- [Testing](#-testing)
- [Future Enhancements](#-future-enhancements)
- [Project Status](#-project-status)
- [Author](#-author)

---

## 🚀 Overview

**DevRecruit AI** is a full-stack developer recruitment platform that brings together artificial intelligence, skill assessment, and blockchain technology to improve the recruitment process.

Traditional recruitment often involves manually reviewing large numbers of resumes, evaluating candidates using inconsistent criteria, and managing multiple hiring stages across disconnected systems.

DevRecruit AI aims to simplify this process by providing a centralized platform where recruiters can manage job openings, evaluate applicants, conduct technical assessments, and track recruitment progress. Candidates can create profiles, upload resumes, explore opportunities, complete assessments, and monitor their applications.

The platform incorporates AI-assisted resume analysis, candidate recommendations, skill-based evaluation, and blockchain-based verification workflows to support a more structured and transparent recruitment experience.

### Why DevRecruit AI?

- Reduces repetitive manual recruitment activities.
- Supports structured candidate evaluation.
- Helps recruiters identify relevant skills and qualifications.
- Provides candidates with a centralized application experience.
- Organizes recruitment activities through role-based dashboards.
- Introduces blockchain-based verification workflows for improved trust.

---

## 🎯 Problem Statement

Conventional recruitment processes face several challenges:

1. **Manual Resume Screening:** Reviewing large volumes of resumes consumes time and resources.
2. **Inconsistent Candidate Evaluation:** Different evaluation methods can make candidate comparisons difficult.
3. **Skill Assessment Challenges:** Recruiters need reliable ways to assess technical abilities beyond resume information.
4. **Disconnected Recruitment Activities:** Applications, interviews, assessments, and hiring updates are often managed separately.
5. **Limited Recruitment Visibility:** Candidates may find it difficult to track their application progress.
6. **Verification and Trust:** Recruitment credentials and related records require reliable verification processes.

DevRecruit AI addresses these challenges through a unified recruitment platform that combines AI-assisted evaluation, assessment management, application tracking, and blockchain-based verification workflows.

---

## 🎯 Project Objectives

- Develop a centralized recruitment management platform.
- Automate parts of resume analysis and candidate evaluation.
- Provide AI-assisted job and candidate recommendations.
- Support skill-based candidate assessment.
- Enable recruiters to manage job postings and applications.
- Provide candidates with application tracking and profile management.
- Integrate blockchain-based verification workflows.
- Implement secure authentication and role-based access.
- Provide administrative monitoring and recruitment analytics.

---

## ✨ Key Features

### 👨‍💻 Candidate Features

- Candidate registration and secure login.
- Profile creation and management.
- Resume upload and parsing.
- Skill and qualification analysis.
- Job discovery and application management.
- AI-assisted job recommendations.
- Coding assessments and technical tests.
- Interview and application status tracking.
- Skill graph and skill-based insights.
- Access to placement-related resources.

### 🏢 Recruiter Features

- Recruiter registration and authentication.
- Recruiter profile management.
- Job creation and management.
- Applicant listing and candidate review.
- Resume-based candidate evaluation.
- Candidate ranking and recommendations.
- Application pipeline management.
- Interview scheduling and tracking.
- Assessment creation and management.
- Recruitment progress monitoring.

### 🤖 AI-Powered Features

- Resume parsing and information extraction.
- ATS-oriented resume analysis.
- Candidate-job relevance recommendations.
- Skill identification and analysis.
- Candidate ranking support.
- Skill graph generation.
- AI-assisted recruitment insights.

### 🧪 Assessment Features

- Technical assessment management.
- Coding test workflows.
- Candidate assessment tracking.
- Evaluation and result management.

### ⛓️ Blockchain Features

- Solidity-based smart contracts.
- Smart contract development using Hardhat.
- Blockchain interaction through Web3.py.
- Certificate verification workflow.
- Hash-based verification support.
- Recruiter and access-control contract workflows.

*Blockchain functionality is developed and tested in a local Ethereum-compatible development environment. It is not represented as a production Mainnet deployment.*

### 🛡️ Admin Features

- Administrative authentication.
- User and platform management.
- Role-based access management.
- Recruitment activity monitoring.
- Platform-level analytics and insights.

---

## 🛠️ Technology Stack

| Category                    | Technologies                                          |
| --------------------------- | ----------------------------------------------------- |
| Backend                     | Python, FastAPI                                       |
| Frontend                    | HTML5, CSS3, JavaScript                               |
| AI / Intelligent Processing | Python-based AI and analysis modules                  |
| Blockchain                  | Solidity, Ethereum-compatible development environment |
| Smart Contract Development  | Hardhat                                               |
| Blockchain Integration      | Web3.py                                               |
| Authentication              | JWT, Role-Based Access Control                        |
| Database Layer              | SQL-based data management                             |
| Database Migrations         | Alembic                                               |
| API Documentation           | FastAPI, Swagger UI                                   |
| Version Control             | Git, GitHub                                           |

---

## 🏗️ System Architecture

DevRecruit AI follows a modular full-stack architecture. The frontend communicates with backend APIs, which coordinate authentication, recruitment workflows, AI processing, data management, and blockchain interactions.

### High-Level Architecture

```text
                  DEVRECRUIT AI
                        |
          +-------------+-------------+
          |                           |
     Frontend Layer              User Roles
          |                           |
     HTML / CSS / JS       +----------+----------+
                           |          |          |
                       Candidate  Recruiter    Admin
                           |          |          |
                           +----------+----------+
                                      |
                              Backend API Layer
                                  FastAPI
                                      |
             +------------------------+----------------------+
             |             |            |          |         |
        Authentication  Recruitment   AI Engine  Assessment  Analytics
             |             |            |          |         |
             +-------------+------------+----------+---------+
                                      |
                                Data Layer
                                      |
                              Database Services
                                      |
                              Blockchain Layer
                                      |
                            Solidity Smart Contracts
                                      |
                                  Hardhat
```

### Architecture Components

**1. Presentation Layer**

Provides interfaces for candidates, recruiters, and administrators through web-based dashboards.

**2. Backend Layer**

Handles API requests, authentication, business logic, recruitment workflows, and communication between modules.

**3. AI Processing Layer**

Supports resume parsing, skill analysis, candidate recommendations, and ranking-related workflows.

**4. Data Management Layer**

Manages application data, user information, recruitment records, and related operations.

**5. Blockchain Layer**

Provides smart contract functionality and verification workflows through an Ethereum-compatible development environment.

---

## 📁 Project Structure

The repository is organized into modular directories to separate application functionality and simplify development.

```text
DevRecruit-AI/
│
├── ai-engine/                 # AI and intelligent processing modules
├── analytics/                 # Analytics and reporting
├── app/                       # Application-level components
├── assessments/               # Assessment and coding test modules
├── backend/                   # FastAPI backend application
│   ├── main.py                # Backend application entry point
│   └── ...
│
├── blockchain/                # Smart contracts and blockchain workflows
│   ├── contracts/             # Solidity smart contracts
│   ├── scripts/               # Blockchain scripts
│   └── hardhat.config.js      # Hardhat configuration
│
├── database/                  # Database-related modules
├── deployment/                # Deployment-related resources
├── documentation/             # Project documentation
├── frontend/                  # Frontend application
├── infrastructure/            # Infrastructure components
├── integrations/              # External integration modules
├── mobile/                    # Mobile-related components
├── pages/                     # Application pages
├── scheduler/                 # Scheduling-related modules
├── scripts/                   # Utility scripts
├── security/                  # Security-related modules
├── shared/                    # Shared components
├── storage/                   # Storage-related modules
├── testing/                   # Testing resources
├── transaction-history/       # Transaction-related resources
├── workers/                   # Background processing modules
│
├── .gitignore
└── README.md
```

*The structure above highlights the major repository directories. Individual files and subdirectories may vary as development progresses.*

---

## 🧩 Application Modules

| Module               | Responsibility                                       |
| -------------------- | ---------------------------------------------------- |
| Authentication       | User login, registration, and access control         |
| Candidate Management | Candidate profiles and application activities        |
| Recruiter Management | Recruiter profiles and hiring workflows              |
| Job Management       | Job creation, updates, and application handling      |
| Resume Processing    | Resume parsing and information extraction            |
| AI Engine            | Recommendations, skill analysis, and ranking support |
| Assessments          | Technical assessments and coding test workflows      |
| Skill Graph          | Skill relationships and candidate skill insights     |
| Blockchain           | Smart contract and verification workflows            |
| Analytics            | Recruitment monitoring and reporting                 |
| Administration       | Platform-level management and monitoring             |

---

## ⚙️ Installation and Setup

Follow the steps below to configure the project locally.

### Prerequisites

Install the following tools before starting:

- Python 3.10 or a compatible version supported by the project dependencies.
- pip
- Node.js and npm for blockchain development.
- Git
- A code editor such as Visual Studio Code.

### 1. Clone the Repository

```bash
git clone https://github.com/Harshitha0624/DevRecruit-AI.git
```

Navigate into the project:

```bash
cd DevRecruit-AI
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate the environment.

**Windows:**

```powershell
.venv\Scripts\activate
```

**Linux / macOS:**

```bash
source .venv/bin/activate
```

Install the project dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a local `.env` file using the configuration required by the backend.

Add the necessary values for:

- Application configuration.
- Database connection.
- JWT authentication.
- AI service credentials, if required.
- Blockchain connection settings, if required.

**Important:** Never upload `.env` files, API keys, private keys, passwords, or other credentials to GitHub.

### 4. Start the Backend Server

From the `backend` directory, run:

```bash
python -m uvicorn main:app --reload --port 8000
```

The backend should be accessible at:

```text
http://127.0.0.1:8000
```

### 5. Run the Frontend

Open a separate terminal and navigate to the project root.

Serve the frontend directory using a local development server compatible with the project's frontend structure.

For example, if the frontend entry point is `index.html`, you can use:

```bash
python -m http.server 5500 --directory frontend
```

Open:

```text
http://127.0.0.1:5500
```

If the application uses a different entry point or requires a particular backend URL, configure the frontend accordingly.

### 6. Configure Blockchain Development

Open another terminal and navigate to the blockchain directory:

```bash
cd blockchain
```

Install the Node.js dependencies:

```bash
npm install
```

Use the Hardhat configuration and scripts included in the repository to start the local blockchain development environment, deploy contracts, and run the relevant verification workflows.

---

## 📡 Backend API Documentation

DevRecruit AI uses FastAPI for backend API development.

When the backend server is running, interactive API documentation is available at:

**Swagger UI**

```text
http://127.0.0.1:8000/docs
```

**ReDoc**

```text
http://127.0.0.1:8000/redoc
```

These interfaces can be used to explore available endpoints, review request and response schemas, and test supported API operations.

---

## ⛓️ Blockchain Development

The blockchain component uses Solidity smart contracts and Hardhat for development and testing.

### Smart Contracts

The repository includes the following contract files:

- `AccessControl.sol` – access-control functionality.
- `CertificateVerification.sol` – certificate verification workflow.
- `RecruiterVerification.sol` – recruiter verification-related functionality.
- `SkillBadge.sol` – skill badge-related functionality.

### Blockchain Technology

- Solidity for smart contract development.
- Hardhat for local development and testing.
- Web3.py for Python-based blockchain interaction.

The blockchain component is intended to support verifiable recruitment-related workflows. Local development and testing should not be confused with a live, publicly deployed blockchain service.

---

## 🔐 Security

Security is an important consideration in a recruitment platform that handles user profiles, resumes, and application information.

The project incorporates security-related mechanisms such as:

- JWT-based authentication.
- Role-based access control.
- Protected application workflows.
- Separation of candidate, recruiter, and administrator permissions.
- Environment-based configuration for sensitive credentials.
- Smart contract access-control functionality.

Sensitive user documents and configuration files should remain outside public version control.

---

## 🧪 Testing

The repository includes testing-related resources and modules.

Recommended validation areas include:

- User registration and authentication.
- Role-based access permissions.
- Candidate profile management.
- Recruiter and job management workflows.
- Resume parsing and analysis.
- Candidate recommendations.
- Coding assessment workflows.
- Application status tracking.
- Smart contract functionality.
- Blockchain verification workflows.
- API request and response validation.

Run the tests using the commands and configuration provided by the relevant project modules.

---

## 🔮 Future Enhancements

The platform can be extended with the following improvements:

1. **IPFS-Based Document Storage:** Decentralized storage for resumes, certificates, and other relevant documents.
2. **Advanced AI Recommendations:** More refined candidate-job matching using additional evaluation signals.
3. **Explainable AI:** Clear explanations of candidate rankings and recommendations.
4. **Advanced Analytics:** Recruitment trend analysis and predictive hiring insights.
5. **Enhanced Assessment Engine:** Additional coding languages and evaluation capabilities.
6. **Cloud Deployment:** Scalable cloud hosting and infrastructure.
7. **Notification System:** Real-time updates for applications, interviews, and assessments.
8. **Enhanced User Experience:** Further improvements to dashboard usability and accessibility.

---

## 📌 Project Status

**DevRecruit AI** is an academic full-stack software engineering project focused on combining AI-assisted recruitment workflows with blockchain-based verification.

The project brings together candidate management, recruiter workflows, resume analysis, assessments, application tracking, analytics, and smart contract functionality in a modular platform.

Further improvements and integrations can be introduced as the project evolves.

---

## 👩‍💻 Author

**Harshitha NV**

Bachelor of Engineering – Computer Science and Engineering

2027 Batch

GitHub: [Harshitha0624](https://github.com/Harshitha0624)

Project Repository: [DevRecruit AI](https://github.com/Harshitha0624/DevRecruit-AI)

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

Contributions, suggestions, and feedback are welcome.
