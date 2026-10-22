# TaskPilot AI Assistant

Build a modern, responsive SaaS-style web app called "TaskPilot AI – Workplace Productivity Assistant". Frontend only: no backend, no login/registration, no database. Nothing is stored; data clears on refresh.

Layout: sidebar navigation (Dashboard, Email Generator, Notes Summarizer, Task Planner, Research Assistant, AI Chat), collapsible on mobile. Dashboard with a hero section, quick-start buttons and tool cards. Clean dark theme with light grey text and a blue accent, plus a light/dark toggle.

Features (each with an input form, Generate button, loading state, and an editable output with Copy and Regenerate):

1. Email Generator: purpose, key points, audience (Client/Manager/Team), tone (Formal/Friendly/Persuasive). Outputs subject + body.

2. Notes Summarizer: paste notes. Outputs summary, key points, decisions, action items with owners and deadlines.

3. Task Planner: list tasks + hours available, daily/weekly. Outputs tasks prioritized by urgency and importance, a time-blocked schedule, and time-saving tips.

4. Research Assistant: topic, article text or URL. Outputs summary, key insights, recommendations, in simple language.

5. AI Chat: multi-turn workplace assistant with suggested starter prompts.

All responses must be real AI-generated, not generic placeholders. Use structured prompts that tell the AI not to invent facts, names or dates.

Responsible AI: a banner on every page saying AI content may be inaccurate and should be reviewed, a warning not to enter confidential data, and a short "About & Responsible AI" page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/607c3d27-6a23-4b82-941e-e879b8f5a9a8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
