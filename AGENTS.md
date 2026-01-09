# Agents Guide

This repository contains product, UX, and behavior specifications for
**Ambient Pomodoro — a low-distraction focus timer**.

## Core Rule
AI agents **MUST** treat the documents in `/docs` as the source of truth.
No assumptions, feature additions, or UX changes are allowed unless
explicitly stated in these documents.

If something is not specified — it is intentionally out of scope.

---

## Product Philosophy
Ambient Pomodoro is:
- a background, signal-based focus timer
- non-intrusive
- non-coercive
- non-judgmental

It is **NOT**:
- a productivity tracker
- a habit builder
- a motivational tool
- a strict Pomodoro enforcer

> [!NOTE]
> The app informs. It never forces.

---

## Attention Hierarchy (must be respected)
1. **Sound** (primary signal)
2. **Notification text** (secondary)
3. **User actions** (explicit intent only)

AI must **not** introduce:
- modal dialogs
- blocking flows
- forced confirmations
- attention-grabbing UI patterns

---

## Agent Roles Overview

### 0. [Orchestrator](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/agents/orchestrator.md)
**Goal**: Route tasks to the right agent and manage handoffs between them.
- **Owns**: Task routing, agent sequencing, consistency checkpoints.
- **Authority**: Can block work if prerequisites are missing, defines input/output expectations.

### 1. [Product Analyst](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/agents/product-analyst.md)
**Goal**: Turn ideas and discussions into clear, testable requirements.
- **Owns**: `00-vision.md`, `02-requirements.md`, `05-out-of-scope.md`.
- **Responsibilities**: Capture requirements, resolve ambiguities, maintain scope boundaries.

### 2. [UX / Product Designer](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/agents/ux-designer.md)
**Goal**: Ensure low-distraction, calm, ambient user experience.
- **Owns**: `01-principles.md`, `04-scenarios.md`.
- **Responsibilities**: Define interaction principles, validate "ambient" constraints, describe user flows.

### 3. [System Architect](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/agents/system-architect.md)
**Goal**: Define system behavior and internal structure clearly enough for AI implementation.
- **Owns**: `03-state-machine.md`, `06-decisions.md`.
- **Responsibilities**: Define state transitions, identify technical constraints, make architectural trade-offs explicit.

### 4. [Implementation Developer](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/agents/implementation-developer.md)
**Goal**: Implement the application strictly based on documented decisions.
- **Reads**: All `/docs`.
- **Responsibilities**: Translate requirements into code, follow architectural constraints, avoid scope creep.

### 5. [QA / Tester](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/agents/qa.md)
**Goal**: Ensure the product behaves exactly as specified.
- **Reads**: `02-requirements.md`, `03-state-machine.md`, `04-scenarios.md`.
- **Responsibilities**: Identify missing scenarios, validate state transitions, detect inconsistencies.

### 6. [Technical Writer](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/agents/tech-writer.md)
**Goal**: Make the project understandable for humans.
- **Owns**: `README.md`.
- **Responsibilities**: Explain what the app is/is not, describe usage clearly, align language with positioning.

---

## Agent Interaction Model
All work flows through the **Orchestrator**.

### Example Flow
1. **Request**: Idea / change request appears.
2. **Orchestrator**: Identifies affected documents and assigns Analyst / UX / Architect.
3. **Execution**: Each agent updates its owned docs.
4. **Validation**: QA validates consistency across all updated documents.
5. **Implementation**: Developer implements confirmed changes.
6. **Documentation**: Tech Writer updates `README.md` if needed.

---

## Process Rules
- **Ownership**: No agent edits documents outside its ownership.
- **Order**: Orchestrator enforces order: *Vision → Principles → Requirements → State Machine → Scenarios*.
- **Integrity**: Any undocumented behavior = invalid.
- **Boundaries**: Out-of-scope is as important as in-scope.

---

## Implementation Constraints
- There is exactly **ONE** active timer.
- Timer logic is independent from UI.
- Notifications and UI are controllers, not owners of state.
- **Pause** freezes time completely.
- No automatic mode switching.

---

## Error Handling
Errors must:
- be logged
- be visible on the main screen
- not interrupt focus
- not block timer functionality

---

## When in Doubt
If any ambiguity arises:
- prefer **minimal behavior**
- prefer **silence** over interruption
- prefer **informing** over acting
- prefer **user control** over automation

> [!WARNING]
> Never "improve" the product by adding features. Stability and predictability are more important than completeness.
