# Ambient Pomodoro — User Scenarios

---

## Purpose

This document describes **user-facing scenarios** derived from requirements and the state machine.

Scenarios explain:
- how the system behaves in real situations
- what happens when the user acts or does nothing
- how edge cases are handled

Scenarios do not introduce new behavior.
They only illustrate documented logic.

---

## Scenario 1 — Start Focus Session

**Initial state**
- App is open
- State: `idle`

**User action**
- User presses “Start”

**System behavior**
- State transitions to `focus`
- Timer starts counting
- Focus duration is set to default

**User experience**
- Focus mode is visible
- Remaining and elapsed time are readable
- No sound or notification is played

---

## Scenario 2 — Focus Time Ends, User Does Nothing

**Initial state**
- State: `focus`
- Remaining time reaches zero

**System behavior**
- Sound is played
- Notification is shown
- State remains `focus`
- Timer continues running

**After one full focus interval**
- Sound is played again
- Notification is shown again

**User experience**
- User is informed
- No action is required
- Focus is not interrupted by forced transitions

---

## Scenario 3 — User Manually Switches to Break

**Initial state**
- State: `focus`
- Timer may be before or after zero

**User action**
- User presses “Next mode”

**System behavior**
- State transitions to `break`
- Break timer starts from beginning

**User experience**
- Clear change of mode
- No pressure to act at exact moment

---

## Scenario 4 — Long Break After Multiple Focus Sessions

**Initial state**
- User has completed 4 focus sessions
- State: `focus`
- Remaining time reaches zero

**System behavior**
- Sound and notification are emitted
- System internally marks next suggested mode as `long-break`

**User action**
- User presses “Next mode”

**System behavior**
- State transitions to `long-break`
- Cycle counter is reset

**User experience**
- User is informed about long break
- Transition happens only on user action

---

## Scenario 5 — Pause and Resume

**Initial state**
- State: `focus`
- Elapsed time: 10 minutes

**User action**
- User presses “Pause”

**System behavior**
- State transitions to `paused`
- Elapsed and remaining time are frozen

**After 30 minutes**

**User action**
- User presses “Resume”

**System behavior**
- State returns to `focus`
- Elapsed time remains 10 minutes

**User experience**
- No time is lost
- No unexpected jumps

---

## Scenario 6 — Pause, Then Switch Mode

**Initial state**
- State: `paused`
- Previous mode: `focus`

**User action**
- User presses “Switch to break”

**System behavior**
- State transitions to `break`
- Paused context is discarded
- Break timer starts from beginning

**User experience**
- Manual override always works
- No hidden state remains

---

## Scenario 7 — Stop and Reset

**Initial state**
- Any active state

**User action**
- User presses “Stop”

**System behavior**
- State transitions to `idle`
- Timer is reset
- Cycle counter is reset

**User experience**
- Clear reset
- No background activity

---

## Scenario 8 — App Goes to Background (Supported)

**Initial state**
- State: `focus`
- Background execution is allowed

**System behavior**
- Timer continues running
- Signals are emitted as usual

**User experience**
- App behaves consistently
- Notifications are received

---

## Scenario 9 — App Goes to Background (Not Supported)

**Initial state**
- State: `focus`
- OS restricts background execution

**System behavior**
- Timer stops
- State resets to `idle`

**User experience**
- No misleading signals
- User restarts session manually

---

## Scenario 10 — App Is Terminated

**Initial state**
- Any active state

**System behavior**
- Timer stops
- State resets to `idle`
- No recovery attempt is made

**User experience**
- No false continuity
- Behavior is predictable

---

## Scenario 11 — User Ignores App Completely

**Initial state**
- Timer is running

**User behavior**
- User does not interact with app or notifications

**System behavior**
- Timer continues running
- Signals repeat at fixed intervals
- No state corruption occurs

**User experience**
- App remains ambient
- No pressure or urgency

---

## Scenario 12 — Notification Actions

**Initial state**
- Timer is running or paused

**User action**
- User interacts via notification action:
  - pause
  - resume
  - next mode
  - stop

**System behavior**
- Same transitions as from main screen

**User experience**
- Full control without opening app

---

## Non-Scenarios (Explicit)

The following are intentionally unsupported:

- Automatic mode switching
- Forcing breaks
- Escalating notifications
- Penalizing inactivity
- Recovering sessions after termination

These behaviors are out of scope.

---

## Scenario Validation Checklist

Each scenario must satisfy:
- alignment with state machine
- no forced user action
- predictable outcome
- calm, non-urgent experience

---

## Notes

Scenarios serve as:
- QA reference
- UX validation tool
- sanity check for implementation

If a real situation is not covered here, it must be:
- added explicitly
- or rejected as out of scope
