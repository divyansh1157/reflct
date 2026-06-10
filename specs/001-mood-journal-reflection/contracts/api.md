# API Contract: Anthropic Claude (Messages API)

The app interacts with the Claude Messages API endpoint.

## Request Format
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Headers**:
  - `x-api-key`: [User provided key]
  - `anthropic-version`: `2023-06-01`
  - `content-type`: `application/json`
- **Body**:
```json
{
  "model": "claude-3-haiku-20240307",
  "max_tokens": 300,
  "messages": [
    {
      "role": "user",
      "content": "Mood: [Mood]\nNote: [User Note]\n\nPlease provide a warm, empathetic reflection in 2-3 sentences."
    }
  ]
}
```

## UI Contract
- **Input Component**: A radio-button or button group for mood selection + `<textarea>` for the note.
- **History Component**: A scrollable `<div>` or `<ul>` containing cards for each entry.
- **Loading Component**: A overlay or inline message shown during the `fetch` lifecycle.
