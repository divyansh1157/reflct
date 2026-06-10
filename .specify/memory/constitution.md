<!--
Sync Impact Report:
- Version change: N/A → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → I. Vanilla Web Standards
  - [PRINCIPLE_2_NAME] → II. Clean & Readable Code
  - [PRINCIPLE_3_NAME] → III. Comprehensive Documentation
  - [PRINCIPLE_4_NAME] → IV. Mobile-First Responsive Design
  - [PRINCIPLE_5_NAME] → V. Performance & Accessibility
- Added sections: Technology Stack, Quality Assurance
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/tasks-template.md (✅ updated)
  - .specify/templates/plan-template.md (✅ updated)
- Follow-up TODOs: None
-->

# reflct Constitution

## Core Principles

### I. Vanilla Web Standards
The project MUST use standard HTML5, CSS3, and Vanilla JavaScript (ES6+). No external frameworks 
(React, Vue, Angular) or libraries that abstract core DOM interactions are allowed. This ensures 
long-term maintainability and performance without dependency bloat.

### II. Clean & Readable Code
Code MUST be written for humans first. Use descriptive variable and function names. Maintain 
consistent indentation and logical grouping of related functionality. Complexity must be 
refactored into simple, well-named functions.

### III. Comprehensive Documentation
EVERY function MUST include a comment block describing its purpose, parameters, and return 
values. Complex logic blocks within functions should also be explained. This is non-negotiable 
to ensure the codebase remains accessible to all contributors.

### IV. Mobile-First Responsive Design
The UI MUST be mobile-friendly by default. Use responsive CSS techniques (Flexbox, Grid, Media 
Queries) to ensure seamless operation across all screen sizes. Designs must be tested on small 
screens before being finalized for desktop.

### V. Performance & Accessibility
Prioritize fast load times by minimizing asset sizes and avoiding unnecessary DOM manipulations. 
Ensure semantic HTML is used to maintain accessibility (A11y) for screen readers and other 
assistive technologies.

## Technology Stack

- **HTML**: Semantic HTML5 markup only.
- **CSS**: Modern CSS3 using Flexbox and Grid. No CSS-in-JS or heavy preprocessors unless 
  explicitly justified.
- **JavaScript**: Modern ES6+ Vanilla JS. Browser APIs should be used directly.

## Quality Assurance

- All code must pass manual cross-browser testing (Chrome, Safari, Firefox).
- Functional verification must be performed on both desktop and mobile viewports.
- Code reviews must strictly enforce the "Comprehensive Documentation" principle.

## Governance

All contributions must adhere to these core principles. The constitution is the ultimate authority 
for architectural decisions. Amendments require a version bump and project-wide consensus. PRs 
that introduce frameworks or undocumented functions will be rejected.

**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-10
