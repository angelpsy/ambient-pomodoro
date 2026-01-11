# Task 003 — Core Timer Engine Implementation (V0)

## Task Metadata
- **Status**: COMPLETED
- **Type**: feature
- **Priority**: HIGH
- **Risk**: MEDIUM
- **Roadmap Link**: [09-roadmap.md#v0-ambient-pomodoro-initial-release]
- **Created by**: Orchestrator
- **Date**: 2026-01-11

---

## Task Description
Implement the core logic of the timer using a Finite State Machine (FSM). This include time calculations based on timestamps, focus cycle counting (4 focus -> long break), and manual mode transitions. This task also includes a minimal React Native UI to control and observe the timer.

Non-goals:
- Android AlarmManager scheduling (deferred to Task 004).
- Persistent state after app kill.
- Settings screen or customizable durations.

---

## Affected Documents
- /docs/09-roadmap.md
- /src/core/types.ts (if refinements needed)

---

## Execution Plan

### Step 1 — TimerEngine Implementation
- **Agent**: Implementation Developer
- **Input**:
  - `docs/03-state-machine.md`
  - `src/core/types.ts`
  - `src/core/TimerEngine.ts` (Interface)
- **Output**:
  - `src/core/TimerEngineImpl.ts`
- **Validation**:
  - Unit tests covering all transitions (idle -> focus -> pause -> stop).
  - Cycle count verification (4 focus sessions trigger long-break suggestion).

### Step 2 — React Context & Hooks
- **Agent**: Implementation Developer
- **Input**:
  - `src/core/TimerEngineImpl.ts`
- **Output**:
  - `src/ui/TimerContext.tsx`
  - `src/ui/useTimer.ts` (Custom hook)
- **Validation**:
  - `App.tsx` can consume the timer state and reflect updates.

### Step 3 — Minimal UI implementation
- **Agent**: UX Developer
- **Input**:
  - `docs/08-visual-design.md`
  - `src/ui/TimerContext.tsx`
- **Output**:
  - `src/ui/MainScreen.tsx` (Refining current shell)
  - `src/ui/components/Controls.tsx`
- **Validation**:
  - User can start, pause, stop, and switch modes via buttons.
  - Remaining time is displayed with second-precision.

### Step 4 — Basic Logging Integration
- **Agent**: Implementation Developer
- **Input**:
  - `src/core/LoggerImpl.ts`
- **Output**:
  - Log entries for every state transition and user action.
- **Validation**:
  - Console shows formatted logs: `[INFO] Transition: idle -> focus`.

---

## Validation Summary
- All required artifacts produced: no
- All steps accepted: no
- Open issues: none

---

## Final Outcome
A functional Pomodoro application where cycles can be completed manually, with full state visibility and control.

---

## Orchestrator Notes
- This task creates the internal "brain" of the app. 
- Native scheduling (Alarms) will be added in the next task to ensure core logic is decoupled from OS-specific behaviors.
