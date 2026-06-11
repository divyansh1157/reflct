# SpecKit — Reflct

## Project Overview

**Project Name:** Reflct  
**Tagline:** Journal your day, hear it back.  
**Team Size:** 1  
**Hackathon Theme:** Open  

Reflct is a minimal mood journal where you log how you're feeling and write a short note about your day — and an AI responds with a warm, personalized reflection to help you process your emotions.

---

## Problem Statement

Most people don't journal because staring at a blank page feels intimidating. There's no feedback, no acknowledgment — it just feels like shouting into a void. This makes it hard to build a consistent self-reflection habit.

---

## Solution

Reflct lowers the barrier to journaling by:
1. Letting you pick your mood with a single click (no blank page anxiety)
2. Accepting a short free-text note about your day
3. Using AI to respond with a thoughtful, empathetic reflection — making you feel heard

---

## Features

- Mood selector (Happy, Neutral, Anxious, Sad, Excited)
- Free-text journal entry input
- AI-generated reflection
- Context-aware AI reflections — recognizes emotional patterns across past entries
- Multilingual UI — English, हिंदी, తెలుగు (i18n support)
- AI replies in the user's selected language automatically
- Option to journal without AI — no setup required for basic use
- Past entries saved locally in the browser (localStorage)
- Scrollable history of previous moods and reflections

---

## AI Support

Reflct supports multiple AI providers — users can choose based on their preference:

| Provider | Type | Key Required? |
|----------|------|--------------|
| 🦙 Ollama | Local (offline) | No |
| ✨ Gemini | Online | Yes (free tier available) |
| 🤖 OpenAI | Online | Yes |
| ⚡ Groq | Online | Yes (free tier available) |

**Local AI (Ollama) is the default** — no internet or API key needed. The app runs entirely on the user's machine.

**BYOK (Bring Your Own Key)** — for online providers, users enter their own API key in the Settings panel. Keys are stored only in the browser's localStorage and never sent anywhere except directly to the chosen provider.

---

## i18n — Multilingual Support

The app supports 3 languages:
- **English**
- **हिंदी** (Hindi)
- **తెలుగు** (Telugu)

Switching languages updates all UI text instantly. The AI automatically replies in the selected language — no extra input needed from the user. Each past entry permanently remembers the language it was written in.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Local AI | Ollama (llama3.2) |
| Online AI | Gemini / OpenAI / Groq (BYOK) |
| Storage | localStorage (no backend needed) |
| Hosting | Vercel |

---

## How to Try It

### Option 1 — Online (no setup needed)
1. Visit the live link below
2. Click ⚙️ Settings
3. Select **Gemini** or **Groq** (both have free tiers)
4. Paste your API key and click Save
5. Pick a mood, write a note, hit **Save & Reflect**

### Option 2 — Local AI (no API key needed)
1. Install Ollama from [ollama.com](https://ollama.com)
2. Run in terminal:
   ```
   ollama pull llama3.2
   set OLLAMA_ORIGINS=*
   ollama serve
   ```
3. Visit the live link, click ⚙️ Settings, select **Ollama**, save
4. Pick a mood, write a note, hit **Save & Reflect**

---

## What's Next

- Mood trend chart (visualize emotions over time)
- Daily journaling streak tracker
- Export entries as text file
- Mobile PWA version

---

## Demo

> Live link: https://reflct-coral.vercel.app/  
> Repo: https://github.com/divyansh1157/reflct

---

*Built solo at Hackathon 2*
