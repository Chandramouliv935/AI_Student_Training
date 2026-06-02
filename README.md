# <div align="center">🔮 CareerFlow AI — Space-Dark Career Navigation & Job Matching</div>

<div align="center">
  
  **Empowering professional growth with AI-powered ATS Analysis, Smart Job Matching, and Adaptive Learning Paths.**
  
  ![Version](https://img.shields.io/badge/version-2.0.0-violet.svg?style=for-the-badge)
  ![React](https://img.shields.io/badge/frontend-React%2019-06b6d4.svg?style=for-the-badge)
  ![Vite](https://img.shields.io/badge/build-Vite%206-7c3aed.svg?style=for-the-badge)
  ![n8n](https://img.shields.io/badge/automation-n8n-FF6D5A.svg?style=for-the-badge)
  ![TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6.svg?style=for-the-badge)
  
</div>

---

## 🌟 Unique Value Proposition

Traditional job portals only search. **CareerFlow AI** *analyzes, trains, and matches*. It doesn't just show you jobs; it detects your skill gaps, suggests roadmaps, protects you from scams, and uses blazing-fast AI to refine your professional brand.

All of this is wrapped in our **Space-Dark Design System v2**—an ultra-premium obsidian dark-first user interface with electric violet primaries, electric cyan secondaries, and glowing neon glassmorphism layout modules.

> [!IMPORTANT]
> **Space-Dark Design System v2 Highlights:**
> * **Color Tokens**: Electric Violet (`#7c3aed`) for tech accents, Electric Cyan (`#06b6d4`) for neon cues, and Deep Obsidian neutrals for pristine dark rendering.
> * **Visual Architecture**: Translucent glass backgrounds (`.glass`), neon text glows, and hardware-accelerated spring animations.
> * **Typeface**: Powered by `'Plus Jakarta Sans'` + `'Inter'` for executive-tier readability.

---

## ✨ Integrated Feature Ecosystem

### 🧠 AI-Powered Core
* **AI Career Chatbot**: A 24/7 intelligent career assistant using LLMs (Groq/Gemini) to provide interview tips, career advice, and resume feedback.
* **Resume ATS Analyzer**: High-precision parsing of resume text to calculate ATS compatibility scores and provide actionable optimization tips.
* **Smart Job Matching**: Automated skill extraction that matches your profile against live job boards with ranked scoring.

### 🛡️ Security & Integrity
* **Fake Job Detection**: A sophisticated ML module that analyzes company metadata, URL patterns, and job descriptions to flag potential scams and phishing attempts. Includes graceful ML fallback and strict unreachable-URL checks.

### 📈 Career Development
* **Adaptive Roadmaps**: Dynamic learning paths that evolve based on your chosen role and detected skill gaps.
* **Comprehensive Assessment Suite**: Includes Technical Skill Tests, Aptitude Evaluation, Communication Assessments, and HR Mock Rounds.
* **Role-Based Resume Builder**: A specialized tool to craft resumes tailored to specific industry roles (SDE, Data Science, Product Management, etc.).

### 🌍 Accessibility & Government Integration
* **Opportunity Accessibility**: Advanced filtering tailored for **Tamil Nadu** (38 districts) and integrated **Government Schemes** tracking for student subsidies and grants.

---

## 🗺️ System Architecture

The following diagram illustrates the intelligent flow of data from User Input to Career Success:

```mermaid
graph TD
    A[User Profile & Resume] --> B{AI Hub}

    subgraph "AI & Processing"
    B --> C[Resume ATS Analyzer]
    B --> D[Skill Extraction Engine]
    B --> E[Career Assistant Chatbot]
    end

    subgraph "Validation & Security"
    D --> F[Fake Job Scrutiny]
    F -- "Safe" --> G[Live Job Matching Scan]
    F -- "Flagged" --> H[Scam Warning Dashboard]
    end

    subgraph "Automation Backend"
    G --> I[n8n Workflow Engine]
    I --> J[External Job APIs]
    J --> K[Relevance Scoring & Ranking]
    end

    subgraph "User Growth Loop"
    K --> L[Personalized Job Feed]
    D --> M[Skill Gap Analysis]
    M --> N[Adaptive Learning Roadmap]
    N --> O[Training & Certifications]
    O --> A
    end

    E <--> L
    E <--> N

    style B fill:#7c3aed,stroke:#06b6d4,stroke-width:4px,color:#fff
    style I fill:#ff6d5a,stroke:#333,stroke-width:2px,color:#fff
    style K fill:#06b6d4,stroke:#333,stroke-width:2px,color:#fff
    style F fill:#f43f5e,stroke:#fff,stroke-width:2px,color:#fff
```

---

## 🛠 The A to Z Tech Stack & Tools

### 🅰️ Frontend & Styling
* **Framer Motion**: Powering smooth, high-fidelity animations and transitions.
* **Lucide React**: Providing a consistent and modern set of vector icons.
* **React 19**: Utilizing the latest concurrent rendering features for a snappier UI.
* **React Router Dom**: Managing sophisticated client-side navigation.
* **Recharts**: Crafting interactive and responsive data visualizations for career growth.
* **Tailwind CSS**: A utility-first CSS framework for rapid and maintainable styling.
* **TypeScript**: Ensuring enterprise-grade type safety and developer productivity.
* **Vite 6**: The next-generation frontend tool for lightning-fast hmr and builds.

### 🅱️ AI & Processing Hub
* **Groq Cloud**: Providing the world's fastest inference for our AI Career Chatbot.
* **Google Gemini (GenAI)**: Leveraging advanced LLMs for deep resume analysis and roadmap generation.
* **jsPDF**: Enabling on-the-fly PDF generation for the Role-Based Resume Builder.
* **pdfjs-dist**: High-performance PDF parsing to extract text from user-uploaded resumes.

### 🅲️ Backend, ML & Automation
* **Arbeitnow API**: Real-time integration for global job market data.
* **Docker**: Containerization for consistent deployment of n8n engine.
* **FastAPI**: A high-performance Python framework for our Machine Learning microservices.
* **n8n**: The low-code heart of our automation, connecting user data to live job streams.
* **Pandas & Scikit-learn**: The backbone of our Fake Job Detection and data analysis models.
* **Uvicorn**: An ASGI web server implementation for Python.

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18+)
* n8n (Local or Cloud)
* Python 3.9+ (For ML modules)

### 2. Installation & Setup

#### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Chandramouliv935/AI_Student_Training.git
cd AI_Student_Training

# Install frontend dependencies
npm install
```

#### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the project root:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/job-match
```

### 4. Running the Application

You need to run both the frontend and backend servers.

* **Terminal 1 (Backend - FastAPI):**
  ```bash
  cd backend
  python app.py
  ```
  *Backend will start on `http://localhost:8000`*

* **Terminal 2 (Frontend - React/Vite):**
  ```bash
  npm run dev
  ```
  *Frontend will start on `http://localhost:3000`*

---

## 🛡️ How Fake Job Detection Works

Our system uses a multi-layered approach:
1. **URL Analysis**: Checks TLDs, keyword spoofing, and domain age.
2. **Metadata Check**: Verifies company reputations and email domains.
3. **Pattern Matching**: Detects "Too-Good-To-Be-True" salary offers and suspicious requirements.

---

## 📸 Platform Preview

<img width="1919" height="902" alt="Screenshot 2026-06-02 163921" src="https://github.com/user-attachments/assets/3b8f2961-57a4-4962-a852-6ac0ec6d545e" />


<img width="1919" height="903" alt="Screenshot 2026-06-02 163944" src="https://github.com/user-attachments/assets/0c052a08-cca3-42f9-aeac-d75187c0d8c4" />


## 👨‍💻 Author & Contributions

**Maintained by Chandramouli**
*Full-stack Developer | AI Automation Specialist*

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
