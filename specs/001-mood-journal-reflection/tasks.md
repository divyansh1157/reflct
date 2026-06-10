# Tasks: AI-Powered Mood Journal (Reflct)

**Input**: Design documents from `/specs/001-mood-journal-reflection/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual verification per `quickstart.md`. Automated tests are not requested.

**Organization**: Tasks are grouped by phase and user story to enable incremental delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure: `index.html`, `style.css`, `app.js` at repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project file structure (`index.html`, `style.css`, `app.js`) at repository root
- [x] T002 [P] Create initial `index.html` scaffold with mobile-friendly meta tags and basic layout containers
- [x] T003 [P] Configure basic `style.css` with CSS variables for colors (Happy, Sad, etc.) and reset
- [x] T004 Create `app.js` entry point and connect to `index.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement API key management in `app.js` (prompt for key on first run, save to `localStorage`)
- [x] T006 [P] Implement `Storage` utility class/object in `app.js` for `reflct_entries` management (get, save, delete)
- [x] T007 [P] Define `JournalEntry` constructor/factory in `app.js` per `data-model.md`
- [x] T008 Setup global error handling and UI notification helper in `app.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Log Daily Mood and Note (Priority: P1) 🎯 MVP

**Goal**: Users can select a mood, write a note, and save the data locally.

**Independent Test**: Select mood, type note, click save. Verify data exists in `localStorage`.

### Implementation for User Story 1

- [x] T009 [US1] Create mood selection UI (5 buttons/icons) in `index.html` using CSS Grid in `style.css`
- [x] T010 [US1] Create note input `<textarea>` and "Save" button in `index.html`
- [x] T011 [US1] Implement mood selection logic (toggle active state) in `app.js`
- [x] T012 [US1] Implement form submission handler in `app.js` (validate input, create `JournalEntry`, save to storage)
- [x] T013 [US1] Add basic CSS animations for button interactions in `style.css`

**Checkpoint**: User Story 1 functional (data saved but not reflected yet)

---

## Phase 4: User Story 2 - Get AI Reflection (Priority: P2)

**Goal**: Users receive a warm, empathetic reflection from Claude API.

**Independent Test**: Submit entry and verify that a reflection appears after a loading state.

### Implementation for User Story 2

- [x] T014 [US2] Create loading indicator UI ("Reflecting...") in `index.html` and hide by default
- [x] T015 [US2] Implement `ClaudeAPI` client in `app.js` using `fetch` per `contracts/api.md`
- [x] T016 [US2] Integrate API call into the submission handler in `app.js` (show loading, fetch reflection, save result)
- [x] T017 [US2] Create reflection display component in `index.html` (modal or overlay)
- [x] T018 [US2] Implement "Retry" logic for API failures in `app.js`

**Checkpoint**: AI Reflection functional (End-to-end logging works)

---

## Phase 5: User Story 3 - View Journal History (Priority: P3)

**Goal**: Users can see a scrollable list of past entries.

**Independent Test**: Save 3 entries and verify they all appear in the list in reverse-chronological order.

### Implementation for User Story 3

- [x] T019 [US3] Create scrollable history container UI in `index.html` using Flexbox in `style.css`
- [x] T020 [US3] Implement `HistoryRenderer` in `app.js` to build cards for each `JournalEntry`
- [x] T021 [US3] Add "Delete" button to history cards and implement removal logic in `app.js` (per Clarification 2)
- [x] T022 [US3] Ensure history list updates immediately after a new entry is saved in `app.js`

**Checkpoint**: All user stories functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and constitution compliance

- [x] T023 [P] Final mobile-first responsive check (test narrow viewports <360px) in `style.css`
- [x] T024 [P] Add JSDoc comments to all functions in `app.js` per "Comprehensive Documentation" principle
- [x] T025 [P] Run accessibility audit (ensure ARIA labels for buttons and good color contrast) in `index.html`
- [x] T026 Perform final end-to-end validation using `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (needs mood/note data to reflect on).
- **User Story 3 (Phase 5)**: Depends on Phase 3 completion (needs data to show).
- **Polish (Final Phase)**: Depends on all user stories completion.

### Parallel Opportunities

- T002 and T003 can be worked on simultaneously.
- T006 and T007 (Foundational data structure) can be worked on together.
- Once the basic `app.js` structure is in, UI work in `style.css` (T013, T023) can run in parallel with logic.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundational phases.
2. Implement US1 (Mood logging) and US2 (AI Reflection).
3. **VALIDATE**: Verify a user can log a mood and get a response. This is the "Aha!" moment.

### Incremental Delivery

1. Foundation -> Core logging.
2. AI Enhancement -> "Reflct" value.
3. History -> Retention and long-term value.
4. Polish -> Quality and accessibility.

---

## Notes

- [P] tasks = different files or decoupled logic, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Follow "Vanilla Web Standards" strictly: No libraries, just browser APIs.
- Code must be clean and documented per constitution.
