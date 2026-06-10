# Data Model: Reflct Journal

## Entity: JournalEntry
Represents a single mood log and its AI reflection.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | UUID or timestamp-based unique identifier. |
| `mood` | String | One of: Happy, Neutral, Anxious, Sad, Excited. |
| `note` | String | User's brief text entry. |
| `reflection` | String | AI-generated response from Claude API. |
| `timestamp` | Number | Unix timestamp of when the entry was created. |

## Storage Schema (localStorage)
- **Key**: `reflct_entries`
- **Value**: `Array<JournalEntry>` (JSON stringified)

## Validation Rules
- `mood`: MUST be one of the five pre-defined options.
- `note`: MUST NOT be empty (minimum 1 character).
- `timestamp`: MUST be generated at the moment of submission.
