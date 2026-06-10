# Research: AI-Powered Mood Journal (Reflct)

## decision: Claude API Integration
- **Decision**: Use the standard `fetch` API to communicate with the Anthropic Claude API.
- **Rationale**: Project constitution forbids frameworks/libraries that abstract core interactions. Native `fetch` is efficient and compliant.
- **Alternatives considered**: Using an SDK like `anthropic-sdk`. Rejected to minimize external dependencies and stick to Vanilla JS.

## decision: API Key Security
- **Decision**: Prompt the user to enter their own API key on first use and store it in `localStorage` (session-only or persistent per user choice).
- **Rationale**: GitLab Pages is static. Storing a hardcoded key is a major security risk. Local input ensures the developer's key isn't leaked and allows individual users to use their own credentials.
- **Alternatives considered**: Proxy server (requires backend, out of scope for GitLab Pages).

## decision: Data Persistence
- **Decision**: Store journal entries as a JSON-serialized array in `localStorage` under the key `reflct_entries`.
- **Rationale**: Simple, zero-latency persistence for a single-device journal app.
- **Alternatives considered**: IndexedDB. Rejected as `localStorage` is sufficient for the expected data volume (short notes) and easier to implement in Vanilla JS.

## decision: UI Layout
- **Decision**: Use CSS Flexbox for the main container and CSS Grid for the mood selection buttons.
- **Rationale**: Ensures a "Mobile-First" responsive design as mandated by the constitution. Flexbox is ideal for the scrollable history list.
