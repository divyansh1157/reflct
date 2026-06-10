# Quickstart Validation: Reflct

## Prerequisites
- A modern web browser (Chrome, Firefox, Safari).
- An Anthropic API key (for AI reflections).

## Validation Scenarios

### 1. Initial Setup
- **Action**: Open `index.html` in the browser.
- **Outcome**: The app displays a prompt for an API key if one is not already saved.

### 2. Log an Entry
- **Action**: Select a mood (e.g., "Excited"), type a note "I finished my project!", and click "Save & Reflect".
- **Outcome**: 
  - A loading indicator appears.
  - The API returns a reflection.
  - The entry appears at the top of the history list.

### 3. Data Persistence
- **Action**: Refresh the page after logging an entry.
- **Outcome**: The history list still contains the previously logged entry.

### 4. Mobile Responsiveness
- **Action**: Open browser DevTools and toggle "Device Toolbar" (Mobile view).
- **Outcome**: The layout adapts gracefully; buttons are touch-friendly and text is readable.
