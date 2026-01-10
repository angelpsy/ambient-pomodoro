# Ambient Pomodoro — Principles

## Purpose
These principles define how Ambient Pomodoro must behave. They are **constraints**, not aspirations.

All requirements, UX decisions, and technical choices must comply with them.

---

## 1. Low Distraction by Default
The app must minimize cognitive interruption.
- No urgent signals
- No escalating notifications
- No visual noise
- No attention-grabbing animations

The default experience should fade into the background.

---

## 2. Information, Not Obligation
The app informs the user about time. It does not require action.
- Signals indicate a possible transition
- No forced breaks
- No penalties for ignoring signals

> [!NOTE]
> Doing nothing must always be a valid choice.

---

## 3. User Control Is Absolute
The user can start the timer, pause it, stop/reset it, and switch modes manually at any time. The system never overrides user intent.

---

## 4. Predictable Behavior
The app must behave the same way every time.
- Same signal → same meaning
- Same action → same result
- No adaptive or “smart” behavior

**Predictability is more important than optimization.**

---

## 5. Calm Communication
All communication must be calm and neutral. Use neutral wording and avoid motivational language or productivity framing. The app should feel **ambient**, not interactive.

---

## 6. Safe to Ignore
Ignoring the app must have no negative consequences.
- Timer continues
- Signals may repeat
- No state corruption
- No loss of data

The app must never “demand attention”.

---

## 7. Minimal Surface Area
Only essential functionality is exposed.
- One timer (V0)
- One main screen
- No secondary flows

Complexity is deferred, not hidden.

---

## 8. Explicit Failure Over Silent Recovery
When something cannot be guaranteed:
- behavior must be explicit
- limitations must be visible
- silent fixes are forbidden

Clarity is preferred over perceived reliability.

---

## 9. Offline-First and Local
The app works without network access, stores all data locally, and does not depend on external services.

---

## 10. Scope Discipline
If a feature increases distraction, reduces predictability, or adds pressure, it is **out of scope**, regardless of its perceived usefulness.

---

## Principle Hierarchy
If principles conflict, priority is:
1. Low Distraction
2. User Control
3. Predictability
4. Information over Obligation
5. Everything else

---

## Enforcement
Any decision violating these principles must be rejected or explicitly documented in `06-decisions.md`.
