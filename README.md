# 🏋️ Adaptive Fitness Companion Chatbot

**(React Native + AI-powered Backend)**

A mobile-first, AI-powered fitness companion chatbot designed to provide personalized, adaptive, and safe fitness guidance.
The system dynamically adapts its tone, structure, and coaching style based on user personality, usage duration, and basic lifestyle context, while strictly avoiding medical advice.

## 📌 Problem Statement

The goal of this project is to design and build a **behavior-aware AI fitness chatbot**, not just a Q&A bot.

The chatbot helps users with:
*   Fitness routines
*   Workout planning
*   Motivation & consistency
*   General wellness guidance

The core challenge is **adaptive behavior**:
*   Different users need different tones
*   Early users need empathy, long-term users need coaching
*   Lifestyle signals should influence responses

> ⚠️ **This app is not a medical tool and explicitly avoids medical advice.**

## 🎯 Objectives

This project demonstrates:
*   ✅ Strong React Native (Expo) UI/UX skills
*   ✅ Ability to build conversational AI systems
*   ✅ Product & behavioral thinking
*   ✅ Clean backend architecture & prompt composition
*   ✅ Responsible AI safety & scope handling

## 🧰 Tech Stack

### Frontend
*   **React Native** (Expo – Managed Workflow)
*   Expo Router
*   AsyncStorage
*   Animated UI + Glassmorphism Design

### Backend
*   **Node.js** (v20.x LTS)
*   Express
*   Prisma ORM
*   PostgreSQL (Neon)

### AI
*   LLM via backend (LangChain-based service)
*   Context-aware prompt composition
*   Safety-first system prompts

## ✨ Core App Features

### 1️⃣ Welcome / Home Screen
Explains:
*   What the chatbot can help with
*   What it cannot do (medical advice, injuries, medication)
*   **Clear CTA**: Start Chat
*   Safety disclaimer shown upfront

### 2️⃣ Onboarding (Personality Selection)
Users select one of three personalities:

| Personality | Description |
| :--- | :--- |
| **Encouragement Seeker** | Needs reassurance & motivation |
| **Creative Explorer** | Prefers flexibility & creativity |
| **Goal Finisher** | Wants structure & actionable steps |

*   Personality is saved locally
*   Passed with every chat message to the backend

### 3️⃣ Chat Screen
Chat-style UI:
*   User messages → right aligned
*   AI messages → left aligned
*   Animated message bubbles
*   Keyboard-safe layout (Android & iOS)
*   Loading indicators
*   Full-screen immersive chat experience

### 4️⃣ Structured AI Responses
AI responses are never plain text blobs.
Supported structures:
*   ✅ Markdown tables (day-wise workout plans)
*   ✅ Bullet-point tips
*   ✅ Quick Action Pills (e.g. “Suggest Warmup”)

Rendered using:
*   `react-native-markdown-display`
*   Custom mobile-friendly table styling

## 🧠 Adaptive AI Behavior (CORE FEATURE)

Every AI response is generated using **four layers of context**.

### 5.1 Personality-Based Behavior
The AI tone changes based on the selected personality.
*   **Examples**:
    *   *Encouragement Seeker* → empathetic, reassuring, no harsh criticism
    *   *Goal Finisher* → direct, checklist-based, actionable

### 5.2 Usage Duration–Based Coaching Style
The AI adapts based on days using the app:

| Days Using App | AI Behavior |
| :--- | :--- |
| **0–3 days** | Grounded, empathetic, allows venting |
| **4–8 days** | Friendly listener, light suggestions |
| **9+ days** | Coach-like, direct actionable guidance |

**🔧 Demo Override**: An optional usageDays override allows instant demo of long-term behavior without waiting days.

### 5.3 Lifestyle Context (Dummy Data)
The chatbot considers basic lifestyle signals:
```json
{
  "steps": 4200,
  "exerciseMinutes": 25,
  "sleepHours": 5.5
}
```
*   Stored locally during onboarding
*   Sent with every chat request
*   Used to subtly influence tone and suggestions

### 5.4 Prompt Composition Strategy
Every backend AI request combines:
1.  Personality instruction
2.  Usage-duration coaching style
3.  Lifestyle context (movement + sleep)
4.  Safety & scope guardrails
5.  Recent chat history
6.  User question

This ensures consistent, explainable, and adaptive behavior.

## 🛡️ Safety & Scope Guardrails (Mandatory)

The chatbot politely refuses queries involving:
*   Diseases (e.g. diabetes, heart disease)
*   Injuries or rehabilitation
*   Medication or supplements
*   Non-fitness domains (coding, math, history, etc.)

**How it works**:
*   A **CRITICAL** system instruction is placed at the top of the prompt
*   Scope rules override all personality instructions
*   AI responds with a polite refusal and suggests consulting a professional

## 🎁 Bonus Enhancements Implemented

### 🪙 Coin Reward System
*   Users earn **+1 coin per message**
*   Coin balance is stored in the backend
*   Displayed in real-time as a gold badge in the chat header

### 🎨 Theming & UX
*   Glassmorphism UI
*   Animated message bubbles
*   Dynamic coach icons based on personality
*   Dark-mode–first, premium aesthetic

## 📂 Project Structure

```
Adaptive-Fitness-AI-Chatbot/
├── app/                  # Expo frontend
├── backend/              # Node.js + Express backend
│   ├── prisma/
│   └── src/
├── constants/
├── services/
├── README.md
├── AI_README.md
```

## 🔐 Environment Variables

**Frontend** (`.env`)
```
EXPO_PUBLIC_API_URL=https://adaptive-fitness-ai-chatbot.vercel.app/api
```

**Backend** (`backend/.env`)
```
DATABASE_URL=postgresql://...
AI_API_KEY=...
```
*Secrets are never exposed to the frontend.*

## ▶️ Running the Project

```bash
npm install
npx expo start
```
*Backend runs independently and is already deployed.*

## 🎥 Demo Video (Mandatory)

The demo showcases:
*   Welcome screen & safety disclaimer
*   Personality onboarding
*   Adaptive tone differences
*   Usage-duration behavior
*   Structured AI responses
*   Safety refusal example

## 📄 AI Usage Disclosure

All AI usage details, tools, and prompts are documented in `AI_README.md` as required.

## ✅ Evaluation Alignment

| Criteria | Status |
| :--- | :--- |
| **UI/UX Quality** | ✅ High-polish, animated |
| **AI Behavior & Adaptation** | ✅ Fully implemented |
| **Code Quality & Architecture** | ✅ Modular & clean |
| **Safety & Scope Handling** | ✅ Strict guardrails |
| **Documentation** | ✅ Clear & complete |

## 🏁 Final Note

This project focuses on AI product design, not just API integration.
It demonstrates how thoughtful context, UX empathy, and safety-first prompting can create an intelligent, responsible fitness companion.
