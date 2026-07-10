# ClassPure

ClassPure is a **High-Performance, Privacy-Conscious Learning Management System (LMS)** designed to bridge the gap between educational content and student engagement. Built with a focus on automation and data sovereignty, it replaces traditional LLM-dependency with a high-precision, **custom rule-based NLP and algorithmic engine**.

## 🚀 Key Highlights

- **Privacy-First Architecture**: Implements **AES-256 encryption** for all assessment data (questions, options, and results) at rest, ensuring academic integrity and data privacy.
- **Custom NLP Engine**: Leverages the `natural` language processing library for high-speed, local MCQ generation and content summarization, eliminating the need for external AI API calls.
- **Real-time Engagement**: Powered by **Socket.io** for live leaderboards, instant classroom notifications, and synchronous discussion forums.

---

## 🛠️ Core Technology Stack

### Backend (Node.js & Express)
- **Database**: MongoDB (Mongoose ODM) with encrypted fields.
- **NLP & Logic**: `Natural` NLP, custom regex-based parsing, and algorithmic quiz generation.
- **Security**: AES-256 encryption (`aes256`), JWT authentication, and Bcrypt password hashing.
- **Real-time**: Socket.io namespaces for segmented event handling (Leaderboard, Assignments, Discussions).
- **Transcription**: Deepgram SDK v5 for high-accuracy speech-to-text.
- **Parsing**: `Mammoth` (.docx), `pdf-parse`, and `XLSX` for multi-format document digitization.

### Frontend (React & Vite)
- **UI/UX**: Tailwind CSS (v4) with a modern, high-contrast design system.
- **Animations**: Framer Motion for smooth micro-animations and transitions.
- **State Management**: React Hooks & Context API.
- **Visualization**: Recharts for performance analytics and student progress tracking.

---

## 🎭 Role-Based Feature Set

### 🛡️ Administrator
- **Advanced User Control**: Manage student/teacher lifecycle and permissions.
- **Audit Logs**: Monitor platform-wide resource allocation and security status.
- **Analytics**: High-level institutional performance oversight.

### 🎓 Teacher
- **Automated MCQ Engine**: Convert uploaded documents (.docx, .pdf, .pptx) or YouTube URLs into structured quizzes instantly.
- **Smart Classrooms**: Create dedicated virtual spaces with integrated Jitsi video meetings.
- **Live Polling**: Real-time interactive sessions with instant result visualization.
- **Resource Management**: Distribute materials with granular access controls.

### 📝 Student
- **Interactive Dashboard**: Track points, ranking, and topic-specific performance.
- **Smart Video Learning**: Synchronized YouTube playback with auto-scrolling transcripts and search.
- **Global Leaderboard**: Gamified competitive ranking based on academic achievements.
- **Unified Discussions**: Collaborate on topics with real-time reply notifications.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local instance
- Deepgram API Key (for transcription)
- SerpApi Key (for video search)

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Sheldon-Patel/ClassPure.git
    cd ClassPure
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Create a .env file with:
    # MONGODB_URI, JWT_SECRET, ENCRYPT_KEY, DEEPGRAM_API_KEY, SERP_API_KEY, N8N_WEBHOOK_URL
    npm run dev
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    # Create a .env file with:
    # VITE_API_BASE_URL=http://localhost:8080
    npm run dev
    ```

---

## 🛠️ Setup & Deployment Checklist

To get the entire **ClassPure** system running on your local machine or fully deployed, here is what has been configured and what is left to do:

### ✅ Completed Steps
1. **Rebranding**: Rebranded all references from *IntelliClass* / *ClassPlus* to **ClassPure**.
2. **Branding Assets**: Designed a premium, high-visibility gradient logo (`favicon.png` / `favicon.svg`) with the shield, cap, and star emblem (no text overlaps) optimized for both light and dark headers.
3. **Database Configurations**: Updated the default MongoDB database connections to link to `classpure`.

### ⏳ Remaining Setup Steps
Follow these steps to complete your setup:

#### 1. Backend Environment Variables
Create a `.env` file in the `backend/` folder and populate it with the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
ENCRYPT_KEY=your_aes_256_encryption_key
DEEPGRAM_API_KEY=your_deepgram_speech_to_text_key
SERP_API_KEY=your_serpapi_video_search_key
N8N_WEBHOOK_URL=your_optional_n8n_automation_url
PORT=8080
DB_NAME=classpure
```

#### 2. Seed the Database
Run the seed script from the `backend/` folder to create initial test users, quizzes, strengths, weaknesses, and calendar heatmaps:
```bash
cd backend
npm run seed
```

#### 3. Frontend Environment Variables
Create a `.env` file in the `frontend/` folder to link the frontend with your running backend API:
```env
VITE_API_BASE_URL=http://localhost:8080
```

#### 4. Build for Vercel/Production
To deploy the frontend to Vercel, the production bundler will compile the TSX/JSX assets:
```bash
cd frontend
npm run build
```

---

## 🔒 Security & Compliance
ClassPure is built for environments where data sensitivity is paramount. By utilizing local NLP processing and military-grade encryption, we ensure that educational data never leaves your controlled environment for training third-party models.

---