/**
 * app.js - Main application logic for Reflct.
 * 
 * This application allows users to log their daily mood and notes,
 * generating an AI-powered reflection using the Anthropic Claude API.
 * Data is persisted locally using browser localStorage.
 */

(function() {
    'use strict';

    // Constants for storage keys
    const STORAGE_KEY_ENTRIES = 'reflct_entries';
    const STORAGE_KEY_API_KEY = 'reflct_api_key';

    /**
     * JournalEntry factory to create a new entry object.
     * 
     * @param {string} mood - The user's selected mood (e.g., 'Happy', 'Sad').
     * @param {string} note - The user's written note about their day.
     * @param {string} reflection - The AI-generated empathetic response.
     * @returns {Object} A structured journal entry object.
     */
    function createJournalEntry(mood, note, reflection) {
        return {
            id: Date.now().toString(),
            mood: mood,
            note: note,
            reflection: reflection,
            timestamp: Date.now()
        };
    }

    /**
     * Storage utility for managing entries and API keys in localStorage.
     * Provides a clean interface for data persistence.
     */
    const Storage = {
        /**
         * Retrieves all journal entries from localStorage.
         * 
         * @returns {Array} An array of journal entry objects, sorted newest first.
         */
        getEntries: function() {
            const data = localStorage.getItem(STORAGE_KEY_ENTRIES);
            return data ? JSON.parse(data) : [];
        },

        /**
         * Saves a new journal entry to the beginning of the history list.
         * 
         * @param {Object} entry - The journal entry object to persist.
         */
        saveEntry: function(entry) {
            const entries = this.getEntries();
            entries.unshift(entry);
            localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
        },

        /**
         * Removes a specific journal entry from storage by its ID.
         * 
         * @param {string} id - The unique identifier of the entry to remove.
         */
        deleteEntry: function(id) {
            const entries = this.getEntries().filter(e => e.id !== id);
            localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
        },

        /**
         * Retrieves the user's stored Anthropic API key.
         * 
         * @returns {string|null} The API key string or null if not set.
         */
        getApiKey: function() {
            return localStorage.getItem(STORAGE_KEY_API_KEY);
        },

        /**
         * Persists the user's Anthropic API key to localStorage.
         * 
         * @param {string} key - The API key string to save.
         */
        setApiKey: function(key) {
            localStorage.setItem(STORAGE_KEY_API_KEY, key);
        }
    };

    /**
     * UI Helpers for managing application state, notifications, and rendering.
     * Handles all direct DOM manipulations.
     */
    const UI = {
        /**
         * Displays an error alert to the user.
         * 
         * @param {string} message - The error message to display.
         */
        showError: function(message) {
            alert('Error: ' + message);
        },

        /**
         * Logs a non-critical notification to the console.
         * 
         * @param {string} message - The notification message.
         */
        notify: function(message) {
            console.log('Notification: ' + message);
        },

        /**
         * Shows or hides the API request loading indicator.
         * 
         * @param {boolean} show - True to display the spinner, false to hide it.
         */
        toggleLoading: function(show) {
            const indicator = document.getElementById('loading-indicator');
            if (indicator) {
                indicator.style.display = show ? 'block' : 'none';
            }
        },

        /**
         * Displays the AI-generated reflection in the UI with a fade-in effect.
         * 
         * @param {string} text - The reflection text to show.
         */
        showReflection: function(text) {
            const display = document.getElementById('reflection-display');
            const textElement = document.getElementById('reflection-text');
            if (display && textElement) {
                textElement.textContent = text;
                display.classList.add('active');
            }
        },

        /**
         * Hides the AI reflection display area.
         */
        hideReflection: function() {
            const display = document.getElementById('reflection-display');
            if (display) {
                display.classList.remove('active');
            }
        },

        /**
         * Renders the scrollable list of past journal entries.
         * Includes event listeners for entry deletion.
         * 
         * @param {Array} entries - The list of journal entry objects to render.
         */
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

            // Setup delete event listeners for each card
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

    /**
     * Maps a mood string to its corresponding emoji representation.
     * 
     * @param {string} mood - The mood name (e.g., 'Happy').
     * @returns {string} A single emoji character.
     */
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

    /**
     * Client for interacting with the Anthropic Claude API.
     * Handles the network request and response parsing.
     */
    const ClaudeAPI = {
        /**
         * Sends a request to the Claude API to generate an empathetic reflection.
         * 
         * @param {string} mood - The user's mood.
         * @param {string} note - The user's note.
         * @returns {Promise<string>} The generated reflection text.
         * @throws {Error} If the API key is missing or the request fails.
         */
        generateReflection: async function(mood, note) {
            const apiKey = Storage.getApiKey();
            if (!apiKey) throw new Error('API Key missing');

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 300,
        messages: [
            {
                role: 'user',
                content: `Mood: ${mood}\nNote: ${note}\n\nPlease provide a warm, empathetic reflection in 2-3 sentences.`
            }
        ]
    })
});

if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'API request failed');
}

const data = await response.json();
return data.choices[0].message.content;
        }
    };

    /**
     * Ensures an API key is available by prompting the user if none is stored.
     * 
     * @returns {string|null} The validated API key or null.
     */
    function ensureApiKey() {
        let key = Storage.getApiKey();
        if (!key) {
            key = prompt('Please enter your OpenAI API Key to enable AI reflections:');
            if (key) {
                Storage.setApiKey(key);
            } else {
                UI.showError('API Key is required for reflections. You can refresh to try again.');
            }
        }
        return key;
    }

    /**
     * Initializes the application.
     * Loads the API key, renders the UI, and populates the history.
     */
    function init() {
        console.log('Reflct initialized');
        ensureApiKey();
        renderApp();
        UI.renderHistory(Storage.getEntries());
    }

    // Module-level state for currently selected mood
    let selectedMood = null;

    /**
     * Renders the primary application structure into the main content area.
     */
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

    /**
     * Binds user interaction events to their respective handlers.
     */
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

    /**
     * Orchestrates the journal entry submission flow:
     * 1. Updates UI to loading state.
     * 2. Requests reflection from AI.
     * 3. Persists the completed entry.
     * 4. Updates the UI with the new entry and reflection.
     * 
     * @param {string} mood - The user's selected mood.
     * @param {string} note - The user's written note.
     */
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
            
            // Clear inputs and reset state
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

    // Initialize application when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', init);
})();
