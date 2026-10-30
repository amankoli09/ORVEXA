# ORVEXA — Conversational AI Study & Revision Gap Assistant

<div align="center">
  <img src="public/logo.png" alt="ORVEXA Logo" width="120" style="border-radius: 20px; margin-bottom: 12px;" />
  <p><strong>Diagnose knowledge gaps · Optimize exam revision · Master your syllabus</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-orange?style=for-the-badge&logo=google" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel" />
  </div>
</div>

---

## 📖 Overview

**ORVEXA** is a conversational AI study companion engineered to help students identify what they *don’t* know before exam day. By analyzing study notes, lecture summaries, and syllabus outlines, ORVEXA audits conceptual retention, flags high-yield blind spots, and produces personalized spaced-revision roadmaps.

Built with a modern, distraction-free **pure white aesthetic**, smooth motion micro-interactions, and direct Google Gemini API integration.

---

## ✨ Key Features

### 1. 🔍 Gap Audit Mode
* Deep-dives into uploaded study notes or topic outlines.
* Detects missing foundational definitions, edge cases, formula conditions, and prerequisite holes.
* Ranks conceptual gaps by exam importance with actionable repair strategies.

### 2. ⚡ Quick Summary Mode
* Condenses heavy academic material into clean, high-yield bulleted summaries.
* Pinpoints must-know formulas, definitions, and frequent exam pitfalls without fluff.

### 3. 📅 Revision Planner Mode
* Constructs structured, day-by-day revision timetables tailored to your target exam date.
* Incorporates active recall, Feynman techniques, and spaced-repetition intervals to maximize retention.

### 4. 🎨 Premium Chat Experience
* **Minimalist White Theme**: Polished typography, subtle borders, and balanced spacing.
* **Smart Input Composer**: Multi-line auto-resizing text area with mode toggle and file attachment drawer.
* **File & Notes Ingestion**: Supports `.txt`, `.md`, and plain text file uploads directly in the browser.
* **Stop / Cancel Control**: Interrupt in-flight generation anytime with immediate abort handling.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16 (App Router & Turbopack)](https://nextjs.org)
* **Library:** [React 19](https://react.dev)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [tw-animate-css](https://github.com)
* **UI & Primitives:** `@beui/chat-app`, `@base-ui/react`, Lucide Icons
* **Animations:** [Motion](https://motion.dev) (formerly Framer Motion)
* **AI Model:** [Google Gemini API](https://ai.google.dev) (`gemini-3.5-flash-lite`)
* **Deployment:** [Vercel](https://vercel.com)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/amankoli09/ORVEXA.git
cd ORVEXA
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Google AI Studio Gemini API key:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
NEXT_PUBLIC_GEMINI_MODEL=gemini-3.5-flash-lite
```

> 🔑 Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google AI Studio API key | *(Required)* |
| `NEXT_PUBLIC_GEMINI_MODEL` | Gemini Model identifier | `gemini-3.5-flash-lite` |

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   * `NEXT_PUBLIC_GEMINI_API_KEY` = *your_api_key*
   * `NEXT_PUBLIC_GEMINI_MODEL` = `gemini-3.5-flash-lite`
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License.
