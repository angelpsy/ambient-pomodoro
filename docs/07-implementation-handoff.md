# Ambient Pomodoro — Implementation Handoff

---

## Purpose
This document defines how implementation should be done, not what to build.

Its goals:
- protect product intent during implementation
- constrain technical freedom where it risks UX
- define allowed and forbidden changes
- describe how to work with the existing docs

---

## 1. Mandatory Input Documents
Implementation must be based on these documents, in order:
1. `00-vision.md`
2. `01-principles.md`
3. `02-requirements.md`
4. `03-state-machine.md`
5. `04-scenarios.md`
6. `05-out-of-scope.md`
7. `06-decisions.md`
8. `08-visual-design.md`

**If there is a conflict:**
Vision > Principles > Decisions > Requirements > State Machine > Scenarios

---

## 2. What May Be Changed During Implementation
Allowed changes without approval:

### 2.1 Internal Structure
- Folder structure
- Naming of internal variables
- Choice of libraries
- Internal abstractions

### 2.2 Technical Adaptations
- Workarounds for OS limitations
- Minor timing inaccuracies
- Simplifications due to platform constraints

### 2.3 Logging
- Add debug logs
- Adjust log granularity
- Change log sinks (console / file)

---

## 3. What Must NOT Be Changed
The following are strictly forbidden without explicit decision update:

### 3.1 Behavior
- Automatic mode switching
- Forced breaks
- Escalating notifications
- Blocking user actions
- Auto-stopping timer at zero

### 3.2 UX Semantics
- Strong sounds
- Urgent language
- Visual emphasis after signal
- “Productivity” framing
- Deviating from Visual Invariants (e.g., bright colors, high-contrast, bouncy animations)

### 3.3 State Logic
- Removing paused as a meta-state
- Merging break and long-break
- Changing cycleCount rules
- Making signals trigger transitions

---

## 4. Required Implementation Artifacts
Implementation must produce:

### 4.1 Core Modules
- Pure timer engine (no UI, no RN dependencies)
- State machine implementation
- Signal dispatcher (sound + notification)

### 4.2 Interfaces
- Clear interface between:
    - UI layer
    - Timer engine
    - OS integrations

### 4.3 Tests
- Unit tests for state transitions
- Scenario-based tests mapped to `04-scenarios.md`

---

## 5. Explicit Non-Goals for Implementation
**Do not:**
- Optimize for battery at cost of behavior clarity
- Add “helpful” automation
- Add persistence beyond required local storage
- Add analytics or tracking
- Add recovery logic after termination

---

## 6. Handling Missing or Unclear Cases
If implementation encounters an unclear case:
1. Check `04-scenarios.md`
2. Check `06-decisions.md`
3. If still unclear:
    - default to **less automation**
    - default to **user control**
    - default to **doing nothing**

Then:
- document the assumption
- surface it for review

---

## 7. Validation Rules
Implementation is acceptable only if:
- All scenarios are reproducible
- Ignoring the app never causes negative effects
- User can always stop or switch modes
- Timer behavior is predictable
- No behavior contradicts Vision or Decisions

---

## 8. Handoff to QA
QA should:
- use `04-scenarios.md` as test plan
- treat `05-out-of-scope.md` as negative test reference
- validate that “doing nothing” is safe

---

## 9. Final Principle
> If a change makes the app feel more “productive” it is probably wrong.

Ambient Pomodoro is successful when it stays out of the way.
