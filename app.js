/**
 * app.js - Main application logic for Reflct.
 * Supports: Ollama (local), Gemini, OpenAI, Groq (BYOK)
 * i18n: English, Hindi, Telugu
 */

(function () {
    'use strict';

    // ── Storage Keys ──────────────────────────────────────────
    const KEYS = {
        ENTRIES:  'reflct_entries',
        API_KEY:  'reflct_api_key',
        PROVIDER: 'reflct_provider',
        MODEL:    'reflct_ollama_model',
        LANG:     'reflct_lang'
    };

    // ── Translations ──────────────────────────────────────────
    // All UI text lives here. To add a new language, add a new block.
    const T = {
        en: {
            tagline:     'A warm space for your thoughts.',
            heading:     'How are you feeling?',
            placeholder: 'Write a short note about your day...',
            saveBtn:     'Save & Reflect',
            reflecting:  'Reflecting...',
            history:     'Past Entries',
            noEntries:   'No entries yet. Start by logging your mood!',
            deleteConfirm: 'Are you sure you want to delete this entry?',
            errMood:     'Please select a mood.',
            errNote:     'Please write a short note.',
            errFail:     'Failed to get reflection: ',
            reflectionLabel: 'Reflection',
            settingsSaved: 'Settings saved!',
            langPrompt:  'Reply in English.',
            skipBtn:     'Skip AI & Just Save'
        },
        hi: {
            tagline:     'आपके विचारों के लिए एक गर्म जगह।',
            heading:     'आप कैसा महसूस कर रहे हैं?',
            placeholder: 'अपने दिन के बारे में कुछ लिखें...',
            saveBtn:     'सहेजें और सोचें',
            reflecting:  'सोच रहे हैं...',
            history:     'पिछली प्रविष्टियाँ',
            noEntries:   'अभी तक कोई प्रविष्टि नहीं। अपना मूड लॉग करें!',
            deleteConfirm: 'क्या आप इस प्रविष्टि को हटाना चाहते हैं?',
            errMood:     'कृपया एक मूड चुनें।',
            errNote:     'कृपया एक छोटी नोट लिखें।',
            errFail:     'रिफ्लेक्शन प्राप्त करने में विफल: ',
            reflectionLabel: 'विचार',
            settingsSaved: 'सेटिंग्स सहेजी गईं!',
            langPrompt:  'हिंदी में उत्तर दें।',
            skipBtn:     'AI छोड़ें और सहेजें'
        },
        te: {
            tagline:     'మీ ఆలోచనలకు ఒక వెచ్చని స్థలం.',
            heading:     'మీరు ఎలా అనుకుంటున్నారు?',
            placeholder: 'మీ రోజు గురించి కొంచెం రాయండి...',
            saveBtn:     'సేవ్ చేయి & రిఫ్లెక్ట్',
            reflecting:  'రిఫ్లెక్ట్ అవుతోంది...',
            history:     'గత నమోదులు',
            noEntries:   'ఇంకా ఎంట్రీలు లేవు. మీ మూడ్ లాగ్ చేయండి!',
            deleteConfirm: 'మీరు ఈ ఎంట్రీని తొలగించాలనుకుంటున్నారా?',
            errMood:     'దయచేసి ఒక మూడ్ ఎంచుకోండి.',
            errNote:     'దయచేసి ఒక చిన్న నోట్ రాయండి.',
            errFail:     'రిఫ్లెక్షన్ పొందడంలో విఫలమైంది: ',
            reflectionLabel: 'రిఫ్లెక్షన్',
            settingsSaved: 'సెట్టింగులు సేవ్ అయ్యాయి!',
            langPrompt:  'తెలుగులో సమాధానం ఇవ్వండి.',
            skipBtn:     'AI వదిలి సేవ్ చేయి'
        }
    };

    // ── App State ─────────────────────────────────────────────
    let selectedMood = null;
    let currentLang  = localStorage.getItem(KEYS.LANG) || 'en';

    function t(key) { return T[currentLang][key] || T['en'][key]; }

    // ── Storage ───────────────────────────────────────────────
    const Storage = {
        getEntries:  () => JSON.parse(localStorage.getItem(KEYS.ENTRIES) || '[]'),
        saveEntry(entry) {
            const entries = this.getEntries();
            entries.unshift(entry);
            localStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries));
        },
        deleteEntry(id) {
            const entries = this.getEntries().filter(e => e.id !== id);
            localStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries));
        },
        getApiKey:  () => localStorage.getItem(KEYS.API_KEY),
        setApiKey:  (k) => localStorage.setItem(KEYS.API_KEY, k),
        getProvider:() => localStorage.getItem(KEYS.PROVIDER) || 'ollama',
        setProvider:(p) => localStorage.setItem(KEYS.PROVIDER, p),
        getModel:   () => localStorage.getItem(KEYS.MODEL) || 'llama3.2',
        setModel:   (m) => localStorage.setItem(KEYS.MODEL, m)
    };

    // ── Journal Entry Factory ─────────────────────────────────
    function createEntry(mood, note, reflection) {
        return { id: Date.now().toString(), mood, note, reflection, timestamp: Date.now(), lang: currentLang };
    }

    // ── Mood Emoji Map ────────────────────────────────────────
    function getMoodEmoji(mood) {
        return { Happy:'😊', Neutral:'😐', Anxious:'😰', Sad:'😢', Excited:'🤩' }[mood] || '🤔';
    }

    // ── AI API Calls ──────────────────────────────────────────
    // Each provider has its own fetch logic.
    // They all receive the same prompt and return a string.

    async function callOllama(prompt) {
        const model = Storage.getModel();
        let res;
        try {
            res = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model, prompt, stream: false })
            });
        } catch (e) {
            throw new Error('Could not connect to Ollama. Make sure Ollama is running with CORS enabled.\n\nOpen CMD and run:\n  set OLLAMA_ORIGINS=*\n  ollama serve');
        }
        if (!res.ok) throw new Error('Ollama responded with an error. Is your model name correct? Check the model name in Settings.');
        const data = await res.json();
        return data.response;
    }

    async function callGemini(prompt, apiKey) {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
        );
        if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'Gemini request failed'); }
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    }

    async function callOpenAI(prompt, apiKey) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'gpt-3.5-turbo', max_tokens: 300, messages: [{ role: 'user', content: prompt }] })
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'OpenAI request failed'); }
        const data = await res.json();
        return data.choices[0].message.content;
    }

    async function callGroq(prompt, apiKey) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'llama-3.1-8b-instant', max_tokens: 300, messages: [{ role: 'user', content: prompt }] })
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || 'Groq request failed'); }
        const data = await res.json();
        return data.choices[0].message.content;
    }

    async function generateReflection(mood, note) {
        const provider = Storage.getProvider();
        const apiKey   = Storage.getApiKey();
        const langPrompt = t('langPrompt');
        const prompt = `Mood: ${mood}\nNote: ${note}\n\nPlease provide a warm, empathetic reflection in 2-3 sentences. ${langPrompt}`;

        if (provider !== 'ollama' && !apiKey) {
            throw new Error('No API key found. Please open Settings and enter your key.');
        }

        if (provider === 'ollama')  return callOllama(prompt);
        if (provider === 'gemini')  return callGemini(prompt, apiKey);
        if (provider === 'openai')  return callOpenAI(prompt, apiKey);
        if (provider === 'groq')    return callGroq(prompt, apiKey);
        throw new Error('Unknown provider selected.');
    }

    // ── UI Helpers ────────────────────────────────────────────
    const UI = {
        showError(msg) { alert('Error: ' + msg); },
        toggleLoading(show) {
            const el = document.getElementById('loading-indicator');
            if (el) el.style.display = show ? 'block' : 'none';
        },
        showReflection(text) {
            const display = document.getElementById('reflection-display');
            const textEl  = document.getElementById('reflection-text');
            if (display && textEl) { textEl.textContent = text; display.classList.add('active'); }
        },
        hideReflection() {
            const display = document.getElementById('reflection-display');
            if (display) display.classList.remove('active');
        },
        renderHistory(entries) {
            const list = document.getElementById('history-list');
            if (!list) return;
            if (entries.length === 0) {
                list.innerHTML = `<p style="text-align:center;opacity:0.6;">${t('noEntries')}</p>`;
                return;
            }
            list.innerHTML = entries.map(entry => `
                <article class="history-card" data-id="${entry.id}">
                    <button class="delete-btn" aria-label="Delete entry" title="Delete entry">&times;</button>
                    <div class="card-header">
                        <div class="card-mood">${getMoodEmoji(entry.mood)} ${entry.mood}</div>
                        <time class="card-date">${new Date(entry.timestamp).toLocaleString()}</time>
                    </div>
                    <p class="card-note">"${entry.note}"</p>
                    <div class="card-reflection">
                        <strong>${T[entry.lang] ? T[entry.lang]['reflectionLabel'] : T['en']['reflectionLabel']}:</strong> ${entry.reflection}
                    </div>
                </article>
            `).join('');

            list.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', e => {
                    const id = e.target.closest('.history-card').getAttribute('data-id');
                    if (confirm(t('deleteConfirm'))) {
                        Storage.deleteEntry(id);
                        this.renderHistory(Storage.getEntries());
                    }
                });
            });
        }
    };

    // ── Language Switcher ─────────────────────────────────────
    // Updates all translatable text on the page when language changes
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem(KEYS.LANG, lang);

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update static text
        const tagline = document.getElementById('tagline');
        if (tagline) tagline.textContent = t('tagline');

        // Re-render app content with new language
        renderApp();
        UI.renderHistory(Storage.getEntries());
    }

    // ── Settings Modal ────────────────────────────────────────
    function setupSettingsModal() {
        const modal      = document.getElementById('settings-modal');
        const openBtn    = document.getElementById('settings-btn');
        const closeBtn   = document.getElementById('close-settings');
        const saveBtn    = document.getElementById('save-settings-btn');
        const providerEl = document.getElementById('ai-provider');
        const keyEl      = document.getElementById('api-key-input');
        const toggleKey  = document.getElementById('toggle-key');
        const keySection = document.getElementById('key-section');
        const ollamaInfo = document.getElementById('ollama-info');
        const modelEl    = document.getElementById('ollama-model');

        // Pre-fill with saved values
        providerEl.value = Storage.getProvider();
        keyEl.value      = Storage.getApiKey() || '';
        modelEl.value    = Storage.getModel();
        toggleProviderUI(providerEl.value);

        // Show/hide key field based on provider
        function toggleProviderUI(provider) {
            const isOllama = provider === 'ollama';
            keySection.style.display  = isOllama ? 'none' : 'block';
            ollamaInfo.style.display  = isOllama ? 'block' : 'none';
        }

        providerEl.addEventListener('change', () => toggleProviderUI(providerEl.value));

        // Show/hide API key visibility
        toggleKey.addEventListener('click', () => {
            keyEl.type = keyEl.type === 'password' ? 'text' : 'password';
        });

        openBtn.addEventListener('click', () => modal.classList.add('open'));
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
        modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

        saveBtn.addEventListener('click', () => {
            Storage.setProvider(providerEl.value);
            if (keyEl.value.trim()) Storage.setApiKey(keyEl.value.trim());
            if (modelEl.value.trim()) Storage.setModel(modelEl.value.trim());
            modal.classList.remove('open');
            alert(t('settingsSaved'));
        });
    }

    // ── Render Main App ───────────────────────────────────────
    function renderApp() {
        const main = document.getElementById('main-content');
        if (!main) return;

        main.innerHTML = `
            <section id="mood-entry" aria-labelledby="entry-heading">
                <h2 id="entry-heading">${t('heading')}</h2>
                <div id="mood-options" role="group" aria-label="Mood selection">
                    <button class="mood-btn" data-mood="Happy">😊<span>Happy</span></button>
                    <button class="mood-btn" data-mood="Neutral">😐<span>Neutral</span></button>
                    <button class="mood-btn" data-mood="Anxious">😰<span>Anxious</span></button>
                    <button class="mood-btn" data-mood="Sad">😢<span>Sad</span></button>
                    <button class="mood-btn" data-mood="Excited">🤩<span>Excited</span></button>
                </div>
                <textarea id="note-input" placeholder="${t('placeholder')}"></textarea>
                <button id="save-btn">${t('saveBtn')}</button>
                <button id="skip-btn">${t('skipBtn')}</button>
                <div id="loading-indicator">
                    <div class="spinner"></div>
                    <p>${t('reflecting')}</p>
                </div>
                <div id="reflection-display">
                    <strong>${t('reflectionLabel')}:</strong>
                    <p id="reflection-text"></p>
                </div>
            </section>
            <hr>
            <section id="history" aria-labelledby="history-heading">
                <h2 id="history-heading">${t('history')}</h2>
                <div id="history-list"></div>
            </section>
        `;

        setupEntryListeners();
    }

    // ── Entry Form Listeners ──────────────────────────────────
    function setupEntryListeners() {
        selectedMood = null;

        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedMood = btn.getAttribute('data-mood');
                UI.hideReflection();
            });
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            const note = document.getElementById('note-input').value.trim();
            if (!selectedMood) { UI.showError(t('errMood')); return; }
            if (!note)         { UI.showError(t('errNote')); return; }
            handleSubmission(selectedMood, note);
        });

        document.getElementById('skip-btn').addEventListener('click', () => {
            const note = document.getElementById('note-input').value.trim();
            if (!selectedMood) { UI.showError(t('errMood')); return; }
            if (!note)         { UI.showError(t('errNote')); return; }
            handleSkip(selectedMood, note);
        });
    }

    // ── Submission Flow ───────────────────────────────────────
    async function handleSubmission(mood, note) {
        const saveBtn = document.getElementById('save-btn');
        saveBtn.disabled = true;
        UI.toggleLoading(true);
        UI.hideReflection();

        try {
            const reflection = await generateReflection(mood, note);
            const entry = createEntry(mood, note, reflection);
            Storage.saveEntry(entry);
            UI.showReflection(reflection);
            UI.renderHistory(Storage.getEntries());
            document.getElementById('note-input').value = '';
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            selectedMood = null;
        } catch (err) {
            UI.showError(t('errFail') + err.message);
        } finally {
            UI.toggleLoading(false);
            saveBtn.disabled = false;
        }
    }

    // ── Skip AI Flow ──────────────────────────────────────────
    function handleSkip(mood, note) {
        const entry = createEntry(mood, note, '—');
        Storage.saveEntry(entry);
        UI.renderHistory(Storage.getEntries());
        document.getElementById('note-input').value = '';
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        selectedMood = null;
    }

    // ── Init ──────────────────────────────────────────────────
    function init() {
        // Apply saved language
        applyLanguage(currentLang);

        // Language switcher buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
        });

        // Settings modal
        setupSettingsModal();

        // Render history
        UI.renderHistory(Storage.getEntries());
    }

    document.addEventListener('DOMContentLoaded', init);
})();
