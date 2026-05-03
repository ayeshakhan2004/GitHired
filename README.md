# Githired — AI Career Execution Agent

> Diagnostic software for tech students. Analyze your GitHub, LinkedIn, and resume against a target job role — get a scored audit and prioritized action plan in under 60 seconds.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![Stack](https://img.shields.io/badge/Tailwind-3-cyan) ![Stack](https://img.shields.io/badge/Claude-claude--opus--4-purple)

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Open `.env.local` and add your keys (see section below).

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### Required
| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Claude API key from [console.anthropic.com](https://console.anthropic.com) |

### Recommended
| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | GitHub personal access token — raises rate limit from 60 to 5000 req/hr. Create at github.com/settings/tokens (no scopes needed) |

### Optional (LinkedIn)
| Variable | Description |
|---|---|
| `RAPIDAPI_KEY` | Your RapidAPI key |
| `RAPIDAPI_LINKEDIN_HOST` | The host of your chosen LinkedIn scraper endpoint |

**How to set up LinkedIn scraping:**
1. Go to [rapidapi.com](https://rapidapi.com) and search "LinkedIn Profile Data"
2. Subscribe to any LinkedIn scraper (popular options: "Fresh LinkedIn Profile Data", "LinkedIn Data API", "Linkedin Profiles")
3. Copy the `X-RapidAPI-Host` value shown in the endpoint docs
4. Set `RAPIDAPI_KEY` and `RAPIDAPI_LINKEDIN_HOST` in `.env.local`

**If LinkedIn keys are not set:** The app still works — it will analyze GitHub and resume only, and note that LinkedIn data was unavailable.

---

## Project Structure

```
githired/
├── app/
│   ├── layout.tsx              # Root layout, Google Fonts
│   ├── page.tsx                # Entry — routes input → loading → dashboard
│   ├── globals.css             # Design system CSS variables + utilities
│   └── api/diagnose/route.ts  # POST endpoint: ingest + Claude diagnostic
├── components/
│   ├── onboarding/
│   │   ├── InputForm.tsx       # 4-field onboarding form with validation
│   │   └── LoadingSequence.tsx # Multi-step animated loading screen
│   └── dashboard/
│       ├── Dashboard.tsx       # Shell: sidebar nav + section layout
│       ├── ExecutiveSummary.tsx# Animated circular gauge + gap analysis bar
│       ├── LinkedInVisualizer.tsx # LinkedIn profile replica + warning badges
│       ├── GitHubAudit.tsx     # GitHub profile replica + flagged repos + projects
│       ├── ATSChecker.tsx      # Pass/fail ATS checklist + keyword match
│       └── ExecutionRoadmap.tsx# 3-phase vertical stepper with checkboxes
├── lib/
│   ├── github.ts               # GitHub REST API client
│   ├── linkedin.ts             # RapidAPI LinkedIn client (pluggable)
│   └── claudeClient.ts         # Google Gemini API + tool_use schema
├── types/
│   └── diagnostic.ts           # All TypeScript interfaces
└── .env.example
```

---

## Dashboard Sections

| Section | What it does |
|---|---|
| **A — Executive Summary** | Animated 0–100 readiness score gauge + gap-to-hireable progress bar |
| **B — LinkedIn Teardown** | Visual LinkedIn profile replica with clickable warning badges + exact rewrites |
| **C — GitHub Audit** | Flags tutorial clones, suggests 2 role-specific projects to build |
| **D — ATS Resume Check** | Pass/fail checklist + keyword match % + found/missing keywords |
| **E — Execution Roadmap** | 3-phase action plan (immediate / projects / networking) with checkboxes |

---

## Deployment (Vercel)

```bash
npx vercel
```

Set environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

Set `maxDuration = 120` is already configured in the API route for Vercel's extended timeout.

---

## Customizing the LinkedIn Scraper

The LinkedIn client is in `lib/linkedin.ts`. The `normalizeLinkedInResponse()` function maps raw API fields to the app's internal schema. Different RapidAPI endpoints return different field names — edit the mappings in that function to match your chosen endpoint.

Common field variations:
- Name: `fullName`, `firstName + lastName`, `name`
- Headline: `headline`, `title`, `jobTitle`
- About: `summary`, `about`, `description`
- Photo: `profilePicture`, `photoUrl`, `avatar`

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3 + custom CSS variables
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **AI**: Google Gemini (claude-opus-4-5) via tool_use for structured JSON
- **Data**: GitHub REST API v3 + RapidAPI LinkedIn Scraper
