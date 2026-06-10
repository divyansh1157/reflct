/**
 * app.js - Main application logic for Reflct.
 * 
 * This application allows users to log their daily mood and notes,
 * generating an AI-powered reflection using the Google Gemini API.
 * Data is persisted locally using browser localStorage.
 */

(function() {
    'use strict';

    // Constants for storage keys
    const STORAGE_KEY_ENTRIES = 'reflct_entries';
    const STORAGE_KEY_API_KEY = 'reflct_api_key';

    function createJournalEntry(mood, note, reflection) {
        return {
            id: Date.now().toString(),
            mood: mood,
            note: note,
            reflection: reflection,
            timestamp: Date.now()
        };
    }

    const Storage = {
        getEntries: function() {
            const data = localStorage.getItem(STORAGE_KEY_ENTRIES);
            return data ? JSON.parse(data) : [];
        },
        saveEntry: function(entry) {
            const entries = this.getEntries();
            entries.unshift(entry);
            localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
        },
        deleteEntry: function(id) {
            const entries = this.getEntries().filter(e => e.id !== id);
            localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
        },
        getApiKey: function() {
            return localStorage.getItem(STORAGE_KEY_API_KEY);
        },
        setApiKey: function(key) {
            localStorage.setItem(STORAGE_KEY_API_KEY, key);
        }
    };

    const UI = {
        showError: function(message) {
            alert('Error: ' + message);
        },
        notify: function(message) {
            console.log('Notification: ' + message);
        },
        toggleLoading: function(show) {
            const indicator = document.getElementById('loading-indicator');
            if (indicator) {
                indicator.style.display = show ? 'block' : 'none';
            }
        },
        showReflection: function(text) {
            const display = document.getElementById('reflection-display');
            const textElement = document.getElementById('reflection-text');
            if (display && textElement) {
                textElement.textContent = text;
                display.classList.add('active');
            }
        },
        hideReflection: function() {
            const display = document.getElementById('reflection-display');
            if (display) {
                display.classList.remove('active');
            }
        },
        renderHistory: function(entries) {
            const list = document.getElementById('history-list');
            if (!list) return;

            if (entries.length === 0) {
                list.innerHTML = '<p style="text-align: center; opacity: 0.6;">No entries yet. Start by logging your mood!</p>';
                return;
            }

            list.innerHTML = entries.map(entry => `
                <article class="history-card" data-id="${entry.id}">
                    <button class="delete-btn" aria-label="Delete entry" title="Delete entry">&times;</button>
                    <div class="card-header">
                        <div class="card-mood">${getMoodEmoji(entry.mood)} ${entry.mood}</div>
                        <time class="card-date" datetime="${new Date(entry.timestamp).toISOString()}">
                            ${new Date(entry.timestamp).toLocaleString()}
                        </time>
                    </div>
                    <p class="card-note">"${entry.note}"</p>
                    <div class="card-reflection">
                        <strong>Reflection:</strong> ${entry.reflection}
                    </div>
                </article>
            `).join('');

            list.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('.history-card').getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this entry?')) {
                        Storage.deleteEntry(id);
                        this.renderHistory(Storage.getEntries());
                    }
                });
            });
        }
    };

    function getMoodEmoji(mood) {
        const emojis = {
            'Happy': '😊',
            'Neutral': '😐',
            'Anxious': '😰',
            'Sad': '😢',
            'Excited': '🤩'
        };
        return emojis[mood] || '🤔';
    }

    const ClaudeAPI = {
        generateReflection: async function(mood, note) {
            const apiKey = Storage.getApiKey();
            if (!apiKey) throw new Error('API Key missing');

            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Mood: ${mood}\nNote: ${note}\n\nPlease provide a warm, empathetic reflection in 2-3 sentences.`
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        }
    };

    function ensureApiKey() {
        const hardcodedKey = 'AQ.Ab8RN6IcN4hMtLjti7azAMEVdVS00klfWg7jnZlqGECps0Qlww';
        Storage.setApiKey(hardcodedKey);
        return hardcodedKey;
    }

    function init() {
        console.log('Reflct initialized');
        ensureApiKey();
        renderApp();
        UI.renderHistory(Storage.getEntries());
    }

    let selectedMood = null;

    function renderApp() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <section id="mood-entry" aria-labelledby="entry-heading">
                <h2 id="entry-heading">How are you feeling?</h2>
                <div id="mood-options" role="group" aria-label="Mood selection">
                    <button class="mood-btn" data-mood="Happy" aria-label="Feeling Happy">😊<span>Happy</span></button>
                    <button class="mood-btn" data-mood="Neutral" aria-label="Feeling Neutral">😐<span>Neutral</span></button>
                    <button class="mood-btn" data-mood="Anxious" aria-label="Feeling Anxious">😰<span>Anxious</span></button>
                    <button class="mood-btn" data-mood="Sad" aria-label="Feeling Sad">😢<span>Sad</span></button>
                    <button class="mood-btn" data-mood="Excited" aria-label="Feeling Excited">🤩<span>Excited</span></button>
                </div>
                <textarea id="note-input" aria-label="Journal note" placeholder="Write a short note about your day..."></textarea>
                <button id="save-btn" aria-live="polite">Save & Reflect</button>
                
                <div id="loading-indicator" aria-hidden="true">
                    <div class="spinner"></div>
                    <p>Reflecting...</p>
                </div>
                
                <div id="reflection-display" aria-live="assertive">
                    <strong>Reflection:</strong>
                    <p id="reflection-text"></p>
                </div>
            </section>
            <hr>
            <section id="history" aria-labelledby="history-heading">
                <h2 id="history-heading">History</h2>
                <div id="history-list"></div>
            </section>
        `;

        setupEventListeners();
    }

    function setupEventListeners() {
        const moodButtons = document.querySelectorAll('.mood-btn');
        const saveBtn = document.getElementById('save-btn');
        const noteInput = document.getElementById('note-input');

        moodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                moodButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedMood = btn.getAttribute('data-mood');
                UI.hideReflection();
            });
        });

        saveBtn.addEventListener('click', async () => {
            const note = noteInput.value.trim();

            if (!selectedMood) {
                UI.showError('Please select a mood.');
                return;
            }

            if (!note) {
                UI.showError('Please write a short note.');
                return;
            }

            handleSubmission(selectedMood, note);
        });
    }

    async function handleSubmission(mood, note) {
        const saveBtn = document.getElementById('save-btn');
        saveBtn.disabled = true;
        UI.toggleLoading(true);
        UI.hideReflection();

        try {
            const reflection = await ClaudeAPI.generateReflection(mood, note);
            
            const entry = createJournalEntry(mood, note, reflection);
            Storage.saveEntry(entry);
            
            UI.showReflection(reflection);
            UI.renderHistory(Storage.getEntries());
            UI.notify('Entry saved!');
            
            document.getElementById('note-input').value = '';
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            selectedMood = null; 
            
        } catch (error) {
            UI.showError('Failed to get reflection: ' + error.message);
        } finally {
            UI.toggleLoading(false);
            saveBtn.disabled = false;
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();