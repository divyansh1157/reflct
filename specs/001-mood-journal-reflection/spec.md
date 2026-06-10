# Feature Specification: AI-Powered Mood Journal (Reflct)

**Feature Branch**: `001-mood-journal-reflection`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Reflct is a mood journal web app. Users pick a mood (Happy, Neutral, Anxious, Sad, Excited) and write a short note about their day. The app sends the mood and note to the Claude API and displays a warm empathetic AI-generated reflection. Past entries are saved in localStorage and shown in a scrollable history."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log Daily Mood and Note (Priority: P1)

As a user, I want to select my current mood and write a brief note about my day so that I can track my emotional state.

**Why this priority**: This is the core data entry point for the application. Without logging, there is no journal.

**Independent Test**: Can be tested by selecting a mood, typing a note, and clicking "Save" to ensure the data is captured.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** I select "Happy" and write "Great day at work", **Then** the entry should be ready for reflection and saving.
2. **Given** no mood is selected, **When** I try to save, **Then** the system should prompt me to select a mood.

---

### User Story 2 - Get AI Reflection (Priority: P2)

As a user, I want to receive a warm, empathetic reflection based on my mood and note so that I feel heard and supported.

**Why this priority**: This is the unique value proposition of "Reflct" (AI-driven empathy).

**Independent Test**: Can be tested by submitting a mood/note and verifying that an AI-generated text block appears.

**Acceptance Scenarios**:

1. **Given** I have submitted a "Sad" mood with a note "Feeling lonely", **When** the AI responds, **Then** I should see a warm, empathetic message on the screen.
2. **Given** a network error occurs, **When** I submit, **Then** the system should provide a graceful fallback message or retry option.

---

### User Story 3 - View Journal History (Priority: P3)

As a user, I want to see a scrollable list of my past entries so that I can reflect on my emotional journey over time.

**Why this priority**: Essential for the "Journal" aspect of the app, allowing long-term value.

**Independent Test**: Can be tested by saving multiple entries and verifying they appear in a scrollable list in reverse-chronological order.

**Acceptance Scenarios**:

1. **Given** I have 5 past entries, **When** I open the history section, **Then** I should see all 5 entries with their moods, notes, reflections, and timestamps.
2. **Given** the app is reopened after being closed, **When** I check history, **Then** the data should persist from previous sessions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a UI for selecting one of five moods: Happy, Neutral, Anxious, Sad, Excited.
- **FR-002**: The system MUST provide a text input area for a "short note" about the day.
- **FR-003**: The system MUST integrate with an AI service (Claude API) to generate a "warm empathetic reflection" based on the user's input.
- **FR-004**: The system MUST display a clear loading indicator (e.g., a spinner or "Reflecting..." message) while waiting for the AI response.
- **FR-005**: The system MUST save every entry (mood, note, reflection, timestamp) to local persistent storage (localStorage).
- **FR-006**: The system MUST display a scrollable history of all past entries.
- **FR-007**: The UI MUST be mobile-friendly and responsive, adhering to the project constitution.
- **FR-008**: The system MUST NOT use any external JavaScript frameworks, adhering to the "Vanilla Web Standards" principle.

### Key Entities *(include if feature involves data)*

- **Journal Entry**: Represents a single mood log.
    - `mood`: The selected mood string.
    - `note`: The user's text description.
    - `reflection`: The AI-generated response.
    - `timestamp`: The date and time of the entry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete a mood entry (mood + note) in under 45 seconds.
- **SC-002**: History list renders and scrolls smoothly even with 100+ entries.
- **SC-003**: AI reflections are displayed to the user within 5 seconds of submission (assuming standard API latency).
- **SC-004**: Data persists 100% of the time across browser restarts via localStorage.

## Edge Cases

- **EC-001**: System provides a loading indicator and disables the "Save" button while the API request is in progress to prevent duplicate entries.
- **EC-002**: System handles API timeouts or errors with a user-friendly message and an option to retry.

## Assumptions

- **Vanilla JS**: Implementation will strictly use browser APIs (Fetch, DOM API, localStorage) without React/Vue/etc.
- **API Key**: The user will provide a way to securely use the Claude API (e.g., via a proxy or local config).
- **Single Device**: History is local to the device/browser used (due to localStorage).
- **Mobile-First**: The design will prioritize narrow screens first.
