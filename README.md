# ⬛ 🟩 🟩 🟩 ⬛ GitHired ⬛ 🟩 🟩 🟩 ⬛


**Turning GitHub profiles into hirable assets using the power of Google Gemini.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge)](https://githired-195375835899.europe-west1.run.app)
[![Tech Stack](https://img.shields.io/badge/Built_with-Next.js_%7C_Gemini_API-black?style=for-the-badge&logo=next.js)](#)
[![Vibe Coding](https://img.shields.io/badge/IDE-Google_Antigravity-purple?style=for-the-badge)](#)

## 💡 What is GitHired?
GitHired is an AI-powered tool designed to bridge the gap between developers and recruiters. By simply entering a GitHub username, GitHired fetches a developer's public repositories, commit history, and language statistics, and uses AI to instantly generate a comprehensive, hirable summary of their technical strengths and project scopes.

This project was developed exclusively for the **GDG AI Seekho Vibe Coding Competition**. 

## 🌊 The "Vibe Coding" Journey
This project wasn't just built *with* AI; it was built *by* orchestrating AI. Embracing the core philosophy of the Vibe Coding competition, the development process relied on three distinct pillars of Google's AI ecosystem:

### 1. Google Antigravity (The Builder)
The entire application was "vibe coded" using **Google Antigravity** as the primary agentic IDE. Instead of manually writing every line of Next.js code, I utilized Antigravity's agent manager and Gemini reasoning models to collaboratively architect the app, generate React components, handle state management, and troubleshoot deployment errors in real-time. 

### 2. Google AI Studio (The Sandbox)
Before writing a single line of integration code, the core AI logic was rigorously tested and refined inside **Google AI Studio**. This served as the prompting sandbox where I engineered the exact system instructions and context windows needed to ensure the AI accurately interpreted raw GitHub JSON data without hallucinating skills.

### 3. Gemini API (The Engine)
While Antigravity built the app, the **Gemini API** powers the live production environment. The application dynamically passes the fetched GitHub data to the Gemini API, which processes the information on the fly to return the tailored, formatted developer insights displayed to the user.

---

## ✨ Key Features
* **Instant GitHub Analysis:** Fetch real-time data from any public GitHub profile via the GitHub REST API.
* **AI-Powered Insights:** Leverages the Gemini API to summarize coding patterns, primary languages, and technical expertise.
* **Seamless User Experience:** Built with Next.js for a responsive, lightning-fast web interface.
* **Cloud Deployed:** Fully containerized via Buildpacks and deployed securely on Google Cloud Run.

## 🛠️ Tech Stack
* **Frontend/Backend Framework:** Next.js (React, Node.js)
* **Agentic IDE:** Google Antigravity
* **AI Integration:** Google Gemini API & Google AI Studio
* **Deployment & Hosting:** Google Cloud Run, Google Cloud Build
* **Version Control:** Git & GitHub

---

## 💻 How to Run Locally

If you'd like to test GitHired on your local machine, follow these steps:

**1. Clone the repository**
```bash
git clone [https://github.com/ayeshakhan2004/GitHired.git](https://github.com/ayeshakhan2004/GitHired.git)
cd GitHired
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**
Create a new file named .env.local in the root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**4. Start the development server**

```bash
npm run dev
```

*Open http://localhost:3000 with your browser to see the app in action!*

## 🤝 Creator
Ayesha Khan 
