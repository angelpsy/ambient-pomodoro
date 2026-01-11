# Task Plan 002: Phase 0 — Foundations

---

## Metadata
- **ID**: task-002
- **Status**: COMPLETED
- **Priority**: CRITICAL
- Roadmap Link: [09-roadmap.md#phase-0-foundations-pre-v0]
- **Assignee**: System Architect
- **Target Version**: V0.1 (Phase 0)

---

## Description
Establish the architectural skeleton of the project. This involves defining the core timer interfaces, the state machine boundary, and the Android native infrastructure (Notifications & Alarms) without implementing the full V0 logic yet.

---

## 1. Core Engine Interfaces (TypeScript)
**Goal**: Create the contract for the timer logic.

- [ ] Create `src/core/types.ts`:
    - Define `TimerState` enum (idle, focus, break, long-break, paused).
    - Define `TimerEvent` type.
    - Define `TimerSideEffect` interfaces.
- [ ] Create `src/core/TimerEngine.ts` (Interface/Abstract Class):
    - Define method signatures for `start()`, `pause()`, `resume()`, `stop()`, `next()`.
    - Define the callback/subscription model for state updates.

---

## 2. Android Infrastructure (Native Boundary)
**Goal**: Prepare the OS-level "hooks" for the timer.

- [ ] Define **Notification Channels** (Android):
    - Create a "Focus Signals" channel (Low priority, soft sound).
- [ ] Research/Define **AlarmManager** integration:
    - Create a wrapper for `setExactAndAllowWhileIdle`.
- [ ] Define **Foreground Service** Life-cycle:
    - Specify when the FGS starts (on timer start) and stops (on timer stop/idle).

---

## 3. Logging & Diagnostics Strategy
**Goal**: Ensure we can trace state transitions from Day 1.

- [ ] Create `src/core/Logger.ts`:
    - Interface with `debug`, `info`, `warn`, `error` methods.
    - Implement a simple console sink for now.
    - Prepare structure for a file sink (Phase 1).

---

## 4. Technical Decisions Alignment
- [ ] Confirm **Timestamp-based timing**: The engine must store `targetTimestamp` and calculate remaining time dynamically to avoid Drift.

---

## 5. Validation Checklist
- [ ] Interfaces are strictly typed and match `03-state-machine.md`.
- [ ] Android notification channels can be initialized (empty boilerplate).
- [ ] Logger is usable throughout the `src/core` directory.

---

## Outcome
A set of defined interfaces and native stubs that allow the implementation of the full FSM in the next task.
