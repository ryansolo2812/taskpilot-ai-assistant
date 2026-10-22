# TaskPilot AI – Workplace Productivity Assistant

**Live app:** https://thoughtful-workday-pilot.lovable.app
**Repository:** https://github.com/ryansolo2812/taskpilot-ai-assistant

TaskPilot AI is an AI-powered workplace productivity assistant built for the CAPACITI AI Skills Accelerator Programme. It brings five AI tools together in one dashboard to cut down the time professionals spend on repetitive admin: writing emails, summarising meetings, planning their day, researching topics and answering quick workplace questions.

---

## Problem Statement

Professionals across industries lose hours every week to repetitive tasks such as drafting emails, turning long meeting notes into action points, planning schedules and digging through articles for key information. TaskPilot AI automates these tasks so users can spend less time on admin and more time on real work.

---

## Features Implemented

| Feature | What it does |
|---|---|
| **Smart Email Generator** | Writes a subject line and email body from the purpose and key points. Supports Formal, Friendly and Persuasive tones and adapts to the audience (Client, Manager or Team). |
| **Meeting Notes Summarizer** | Turns pasted meeting notes into a concise summary, key points, decisions and an action-item table with owners and deadlines. |
| **AI Task Planner** | Prioritises a task list by urgency and importance, builds a time-blocked daily or weekly schedule, and suggests time-saving tips. |
| **AI Research Assistant** | Summarises a topic or pasted article text into a short summary, key insights and recommendations in simple language. |
| **AI Chat** | A multi-turn workplace assistant that remembers the conversation and offers starter prompts. |

**Across every tool:**
- Input form, **Generate** button and loading state
- AI responses stream in word by word
- Editable output with **Copy** and **Regenerate**
- Dashboard layout with sidebar navigation
- Responsive design – the sidebar folds into a menu on mobile
- Dark theme with a blue accent and a Light/Dark toggle

---

## Prompt Engineering

Each tool sends the AI a structured prompt rather than the user's raw text. The prompts are designed to:

- **Give the AI a clear role** – for example, a professional email writer or a meeting assistant.
- **Pass in the user's context** – tone, audience, task list, available hours and so on.
- **Set strict constraints** – the AI may only use the information the user provides and must not invent facts, names or dates.
- **Handle missing information safely** – missing owners or deadlines are marked **"Not specified"**, and unknown names use placeholders such as **[Recipient Name]**.
- **Fix the output format** – each tool returns the same clearly labelled sections every time, such as Summary, Key Points, Decisions and Action Items.

---

## Responsible AI

- A warning banner on every page states that AI-generated content may be inaccurate and must be reviewed before use.
- Users are warned not to enter confidential, personal or sensitive company data.
- **No data is stored** – there is no login and no database, and all content clears when the page is refreshed.
- The AI connection runs through a small server function, so the API key is never exposed in the browser.
- An **About & Responsible AI** page explains the app's limitations and how data is handled.

---

## Known Limitations

- The Research Assistant cannot open web links. Paste the article text for an accurate summary.
- AI output can still contain mistakes and should always be checked by a person.
- Generations run on a limited monthly AI usage allowance. If it runs out, the app shows a message instead of a result.

---

## Technologies and Tools Used

- **Lovable** – AI app builder used to design and build the application
- **ChatGPT** – used to structure and refine the build prompt
- **Lovable AI** – powers the AI features through a server function
- **React** with **TanStack Start** and **TypeScript**
- **Vite** – build tool
- **Bun** – package manager
- **GitHub** – version control and project storage

---

## Setup Instructions

**Use the live app:** open https://thoughtful-workday-pilot.lovable.app – no sign-up needed.

**Run locally:**

```bash
# 1. Clone the repository
git clone https://github.com/ryansolo2812/taskpilot-ai-assistant.git
cd taskpilot-ai-assistant

# 2. Install dependencies
bun install

# 3. Start the development server
bun run dev
```

Then open the local address shown in the terminal. The AI features rely on Lovable's AI service, so they work fully in the live app.

---

## How to Use

1. Open the app and pick a tool from the sidebar or the dashboard.
2. Fill in the form, for example the email's purpose, tone and audience.
3. Click **Generate** and wait for the response.
4. Edit the output if needed, then **Copy** it or click **Regenerate** for a new version.
5. Always review AI output before using it.

---

## Team Members

- **Ryan Solomon** – CAPACITI AI Skills Accelerator Programme
