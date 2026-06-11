# Reflct

> Journal your day, hear it back.

Reflct is a minimal mood journal where you log how you're feeling, write a short note about your day, and get a warm AI-generated reflection in return.

Supports **3 languages** (English, हिंदी, తెలుగు) and multiple AI providers including fully **offline local AI** via Ollama.

---

## Features

- Mood selector (Happy, Neutral, Anxious, Sad, Excited)
- Free-text daily journal entry
- AI-generated empathetic reflection
- Supports **Ollama (local/offline)**, Gemini, OpenAI, and Groq
- BYOK — Bring Your Own Key for online providers
- i18n support — English, Hindi, Telugu
- Past entries saved in browser (no login needed)
- Clean, distraction-free UI

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Local AI | Ollama (llama3.2) |
| Online AI | Gemini / OpenAI / Groq (BYOK) |
| Storage | localStorage |
| Hosting | Vercel |

---

## How to Run Locally

1. Clone the repo
   ```bash
   git clone <your-repo-url>
   cd reflct
   ```

2. Open `index.html` directly in your browser — no install needed.

3. Open Settings (⚙️) and choose your AI provider.

---

## Using Ollama (Local AI — Free, No Key Needed)

Ollama runs AI entirely on your machine — no internet, no API key, no cost.

**Step 1 — Install Ollama**
Download and install from [ollama.com](https://ollama.com)

**Step 2 — Download a model**
```bash
ollama pull llama3.2
```

**Step 3 — Start Ollama with CORS enabled**

> This step is important! Without it, your browser will block the connection.

On Windows (CMD):
```bash
set OLLAMA_ORIGINS=*
ollama serve
```

On Mac/Linux:
```bash
OLLAMA_ORIGINS=* ollama serve
```

**Step 4 — Open Reflct, click ⚙️ Settings, select Ollama, and save.**

That's it! No key needed.

---

## Using Online AI (BYOK)

1. Click ⚙️ Settings
2. Select your provider (Gemini, OpenAI, or Groq)
3. Paste your API key
4. Click Save

Your key is stored only in your browser's localStorage and is never sent anywhere except directly to your chosen AI provider.

| Provider | Get API Key |
|----------|------------|
| Gemini | [aistudio.google.com](https://aistudio.google.com) — Free tier available |
| OpenAI | [platform.openai.com](https://platform.openai.com) |
| Groq | [console.groq.com](https://console.groq.com) — Free tier available |

---

## Language Support

Click the language buttons at the top of the app to switch between:
- **English**
- **हिंदी** (Hindi)
- **తెలుగు** (Telugu)

The AI will automatically reply in your selected language.

---

## Live Demo

https://reflct-coral.vercel.app/

---

*Built solo at Hackathon 2*
