<!--
Sync Impact Report:
- Version change: [NONE] → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → I. Spec-Driven Development (SDD)
  - [PRINCIPLE_2_NAME] → II. Formal Implementation Planning
  - [PRINCIPLE_3_NAME] → III. Task-Based Incremental Delivery
  - [PRINCIPLE_4_NAME] → IV. Verification & Quality Gates
  - [PRINCIPLE_5_NAME] → V. Document Traceability
- Added sections: Development Workflow, Complexity Management
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs: None
-->

# Reflct Constitution

## Core Principles

### I. Spec-Driven Development (SDD)
Every feature MUST start with a formal specification (`spec.md`) that defines user scenarios, functional requirements, and success criteria. No implementation or technical planning may begin until the specification is established and reviewed. This ensures alignment on "WHAT" is being built before deciding "HOW".

### II. Formal Implementation Planning
A technical implementation plan (`plan.md`) MUST be created for every feature. The plan bridges the gap between requirements and code by defining the architecture, project structure, and technical strategy. It serves as the blueprint for task generation and implementation.

### III. Task-Based Incremental Delivery
Features MUST be decomposed into discrete, dependency-ordered tasks (`tasks.md`) organized by user story. Each user story MUST deliver independent value and be testable as a standalone increment (MVP-first approach). This minimizes risk and enables faster feedback loops.

### IV. Verification & Quality Gates
All requirements and success criteria defined in the specification MUST be verified. A feature is only considered complete when its corresponding success criteria are met and all tasks are verified. Quality is a non-negotiable gate at every stage of the lifecycle.

### V. Document Traceability
The entire development lifecycle MUST be fully traceable through standardized artifacts: Spec → Plan → Tasks → Implementation. This traceability ensures that every line of code can be linked back to a user requirement and a technical decision.

## Development Workflow
The Reflct project adheres to a structured, command-driven workflow to ensure consistency and quality:
1. **Specification**: Use `/speckit.specify` to define requirements.
2. **Planning**: Use `/speckit.plan` to design the implementation.
3. **Execution**: Use `/speckit.tasks` to generate actionable work items.
4. **Implementation**: Execute tasks and verify completion.

## Complexity Management
Architectural complexity MUST be justified against the core principles. We prioritize simplicity and "You Aren't Gonna Need It" (YAGNI) unless a more complex solution is required to meet the functional requirements or maintainability goals. Every architectural decision should be documented in the feature's `plan.md` or `research.md`.

## Governance
This constitution supersedes all other informal practices within the Reflct project.
- **Amendments**: Changes to these principles require an update to this document, a version bump, and a consistency review of all dependent templates.
- **Compliance**: All feature specifications, plans, and tasks must be reviewed for compliance with these principles.
- **Versioning**: Follows semantic versioning (MAJOR for principle removals/redefinitions, MINOR for additions, PATCH for clarifications).

**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-10
