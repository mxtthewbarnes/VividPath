# VividPath 

**VividPath** is an AI-powered trip planning web app built during an MLH (Major League Hacking) hackathon. Users describe where they want to go and what kind of experience they're looking for, and VividPath generates a personalized travel itinerary using Google's Gemini API.

---

## Features

- Natural language trip input — describe your ideal trip in plain English
- AI-generated day-by-day itineraries via Gemini API
- Clean, responsive UI built with React + TypeScript
- Fast local dev experience powered by Vite

---

## Getting Started

**Prerequisites:** Node.js (v18+)

```bash
# 1. Clone the repo
git clone https://github.com/AMVezz/VividPath.git
cd VividPath

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY=your_key_here

# 4. Run the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Hackathon Context

VividPath was built as part of an **MLH (Major League Hacking)** event. The project was developed under time constraints as a team effort, with the goal of exploring practical AI integration in a full-stack web context. Due to time limitations, some planned features remain incomplete — see `reflection.md` for a full retrospective.

---

## Proof of Participation

See the `/screenshots` folder for development and app screenshots.

---

## Reflection

See [`reflection.md`](./reflection.md) for a full writeup on the activity, technical decisions, contributions, and self-assessment.
