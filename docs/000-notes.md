# Ambient Pomodoro — Notes & Reflections

---

## Brainstorming: Behavioral Changes

### Manual Long-Break Entry
**Current Logic**: Long-break is only suggested after completing 4 focus/break cycles.
**Proposed Change**: Allow the user to manually switch to a long-break from `focus` or `break` states at any time.

**Rationale**:
- Reinforces the "User Control Is Absolute" principle.
- Some users might feel the need for a longer break sooner depending on fatigue or external factors.

**Impact**:
- Need to determine what happens to the cycle counter if a manual long-break is taken.
- Should it reset the counter?
- Does it count as one of the 4 sessions?

---

## Feature Decisions & Simplifications

- **Ambient Sound**: Decided to skip continuous ambient background sound for V0/V2. The app will rely solely on notification sounds for timer expiration.
- **Custom Alarm Sounds**: Future consideration - allow users to restart/choose the sound played when the timer ends (instead of the default notification sound).

## Technical Research: Background Execution (Android)

### 1. Foreground Service (FGS)
**Pros**: Maximum reliability, persistent notification.
**Cons**: Mandatory notification can be "noisy", OS 12+ restrictions.
**Use Case**: Justified when timer is active and user expects signals.

### 2. AlarmManager (Philosophical Choice)
**Pros**: Extreme battery efficiency, survives process death, "Ambient" feel.
**Cons**: No "tick-by-tick" logic, manual pause/resume complexity.
**Use Case**: Ideal for the "signal" event itself.

### 3. Hybrid Strategy (Selected)
- **Active State**: Use FGS for UI persistence and OS priority.
- **Signal Logic**: Use `AlarmManager.setExactAndAllowWhileIdle` for the `TIME_ELAPSED` event.
- **Sync**: Logic uses `SystemClock.elapsedRealtime()` for drift-free calculations.

> [!NOTE]
> This strategy is subject to change. If implementation reveals unforeseen bugs or extreme complexity, a simpler model (e.g., pure FGS or pure AlarmManager) can be reconsidered.

---

## Readiness Report: Pre-Dev Audit

**Current Status**: [READY FOR PLANNING]

We have successfully built the "source of truth" layer. All agents have roles, and the product vision is clear.

### 1. What we have (Core Docs)
- [x] **Vision & Principles**: Direction and constraints are clear.
- [x] **Requirements**: V0 scope is defined.
- [x] **State Machine**: Logic and transitions are documented.
- [x] **Handoff Rules**: Developer constraints are in place.
- [x] **Visual Design**: UX rules and visual invariants defined.

### 2. What is Still Missing (Before Coding)

#### A. Technical Boilerplate
- [ ] **React Native Project Init**: No project structure exists yet.
- [ ] **Tech Decisions**: We haven't finalized the libraries for sound and notifications.
- [ ] **Environment**: `.nvmrc`, `package.json`, `tsconfig.json`.

#### B. Visual Identity (UX Designer Task)
- [ ] **Design Tokens**: Color palette (HSL), typography, and "glassmorphism" components.
- [ ] **UI Mockup**: A high-level layout of the main screen.

#### C. First Implementation Plan
- [ ] **Task Plan 001**: "Project Initialization & Core Timer Engine".
---

## Maintenance Notes

- [ ] **Timer Durations**: Revert default timer durations to 25 minutes (focus) and 5 minutes (break) before production release. Currently set to shorter values for development testing.
