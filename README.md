# Adaptive Fitness AI Chatbot

A mobile-first, AI-powered fitness companion that adapts its coaching style based on your personality, usage duration, and lifestyle data.

## 🚀 Key Features

*   **Adaptive AI Coaching**: The chatbot changes its personality (Encouragement Seeker, Creative Explorer, Goal Finisher) and tone based on how long you've been using the app.
*   **Context-Aware**: Considers your daily steps, sleep, and exercise minutes to provide relevant advice.
*   **Long-Term Memory**: Remembers past conversations to provide continuity (via PostgreSQL & Prisma).
*   **Premium Glassmorphism UI**: A dark-themed, animated interface built with React Native Reanimated and Expo Blur.

## 📱 How to Run

### Prerequisites
*   Node.js v20+
*   PostgreSQL Database url

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# DATABASE_URL="postgresql://..."
# GOOGLE_API_KEY="your_gemini_key"
npx prisma generate
npx prisma db push
npm start
```

### 2. Mobile App Setup
```bash
# In root directory
npm install
npx expo start -c
```

---

## 🧠 Adaptive AI Logic (Prompt Composition)

The core of this chatbot is its ability to dynamically compose prompts based on three layers of context. Every request to the LLM (Gemini) is constructed as follows:

### 1. Personality Layer (Mandatory)
The system injects a specific persona instructions based on user selection:
*   **Encouragement Seeker**: "You are empathetic. Provide constant reassurance and praise small wins."
*   **Creative Explorer**: "You are creative. Suggest fun, unconventional activities. Avoid rigid plans."
*   **Goal Finisher**: "You are structured. Be concise, direct, and metric-focused."

### 2. Usage Duration Layer
The AI tone shifts based on the user's journey (calculated from account creation date):
*   **Days 0-3 (New User)**: "Grounded, empathetic. Allow venting. Do NOT give instant remedies."
*   **Days 4-8 (Settling In)**: "Friendly listener. Provide short remedies only after context."
*   **Days 9+ (Veteran)**: "Coach-like. Jump straight to actionable guidance."

### 3. Lifestyle Context Layer
Real-time (mock) data is injected into every prompt to ground the advice:
```text
User Lifestyle Data:
- Daily Steps: 4200
- Sleep Hours: 5.5
- Exercise Minutes: 25
```

### 4. Safety Guardrails
A strict medical disclaimer is prepended to every system prompt to refuse answering medical questions (injuries, medications, diseases).

---

## 🛠 Tech Stack
*   **Frontend**: React Native (Expo), TypeScript, Reanimated, Expo Blur.
*   **Backend**: Node.js, Express.
*   **Database**: PostgreSQL, Prisma ORM.
*   **AI**: LangChain, Google Gemini Flash Lite.
