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

It's like having a non-judgmental friend who always responds.

---

## Features

- Mood selector (Happy, Neutral, Anxious, Sad, Excited)
- Free-text journal entry input
- AI-generated reflection using the Claude API
- Past entries saved locally in the browser (localStorage)
- Scrollable history of previous moods and reflections

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| AI | Claude API (claude-sonnet-4-20250514) |
| Storage | localStorage (no backend needed) |
| Hosting | GitLab Pages |

---

## How It Works

1. User selects a mood and types a short note about their day
2. On submit, the app sends the mood + note to the Claude API with a prompt asking for an empathetic reflection
3. The AI response is displayed on screen
4. The entry (mood, note, AI reply, timestamp) is saved to localStorage
5. Users can scroll through all past entries on the same page

---

## Challenges Faced

- Crafting a prompt that consistently returns warm, concise reflections without being generic
- Handling API loading states gracefully in vanilla JS
- Keeping the UI clean and calming without a CSS framework

---

## What's Next

- Mood trend chart (visualize emotions over time)
- Daily journaling streak tracker
- Option to export all entries as a text file
- Mobile-friendly PWA version

---

## Demo

> Live link: *(add GitLab Pages URL here)*  
> Repo: *(add GitLab repo URL here)*

---

*Built solo at Hackathon 2*
