# Ambient Pomodoro — State Machine

---

## 1. Purpose

This document defines the finite state machine (FSM) for Ambient Pomodoro.

The FSM describes:
- timer states
- transitions between states
- side effects (signals)
- focus cycle counting logic

The FSM never enforces user behavior.
It only reflects system state.

---

## 2. States

### 2.1 Primary States

| State | Description |
|------|-------------|
| idle | Timer is stopped and inactive |
| focus | Active focus session |
| break | Short rest session |
| long-break | Extended rest after multiple focus sessions |
| paused | Frozen state of an active session |

---

| Property | Value |
|--------|-------|
| Type | Meta-state |
| Wraps | focus, break, long-break |
| Resume behavior | Returns to wrapped state |
| Time behavior | Preserves elapsed and remaining time |
| Display focus | Elapsed time since mode start |

---

## 3. State Context (Extended State)

| Field | Description |
|------|-------------|
| currentMode | Active mode |
| previousMode | Mode before pause |
| elapsedTime | Time already passed |
| remainingTime | Time left until signal |
| cycleCount | Completed focus sessions since last long break |

---

## 4. Events

### 4.1 User Events

| Event | Description |
|------|-------------|
| START | Start timer |
| PAUSE | Pause timer |
| RESUME | Resume paused timer |
| STOP | Stop and reset |
| NEXT_MODE | Switch to next suggested mode |
| SWITCH_TO_FOCUS | Manual switch to focus |
| SWITCH_TO_BREAK | Manual switch to break |
| SWITCH_TO_LONG_BREAK | Manual switch to long break |

---

### 4.2 System Events

| Event | Description |
|------|-------------|
| TICK | Timer tick |
| TIME_ELAPSED | Remaining time reached zero |
| APP_BACKGROUND | App moved to background |
| APP_TERMINATED | App killed |

---

## 5. Transitions

### 5.1 From `idle`

| Event | Target State | Notes |
|------|--------------|-------|
| START | focus | Initialize timer |
| SWITCH_TO_FOCUS | focus | Reset timer |
| SWITCH_TO_BREAK | break | Reset timer |
| SWITCH_TO_LONG_BREAK | long-break | Reset timer |

---

| Event | Target State | Notes |
|------|--------------|-------|
| TICK | focus | Update time |
| TIME_ELAPSED | focus | Emit signal (sound/notification) |
| PAUSE | paused | Save previousMode |
| STOP | idle | Reset all |
| NEXT_MODE | break | If cycleCount % 4 ≠ 0 |
| NEXT_MODE | long-break | If cycleCount % 4 = 0 |
| SWITCH_TO_* | target | Manual override |

---

### 5.3 From `break`

| Event | Target State | Notes |
|------|--------------|-------|
| TICK | break | Update time |
| TIME_ELAPSED | break | Emit signal |
| PAUSE | paused | Save previousMode |
| STOP | idle | Reset all |
| NEXT_MODE | focus | Reset timer |
| SWITCH_TO_* | target | Manual override |

---

### 5.4 From `long-break`

| Event | Target State | Notes |
|------|--------------|-------|
| TICK | long-break | Update time |
| TIME_ELAPSED | long-break | Emit signal |
| PAUSE | paused | Save previousMode |
| STOP | idle | Reset all |
| NEXT_MODE | focus | Reset timer and cycleCount |
| SWITCH_TO_* | target | Manual override |

---

### 5.5 From `paused`

| Event | Target State | Notes |
|------|--------------|-------|
| RESUME | previousMode | Restore time |
| STOP | idle | Reset all |
| SWITCH_TO_* | target | Discard paused state |

---

## 6. Signals (Side Effects)

| Trigger | Effect |
|-------|--------|
| TIME_ELAPSED | Play sound and show notification |

Signal rules:
- Signals do not change state
- Signals do not auto-switch modes
- Signals may repeat at fixed intervals

---

| Rule | Description |
|-----|-------------|
| Increment | When transitioning OUT of `focus` mode via user action (`NEXT_MODE`, etc.) |
| Reset | After long-break completion |
| Reset | On STOP |
| Auto-increment | NOT SUPPORTED. All cycle progress depends on user decision. |

---

## 8. Background & Termination

### 8.1 Background

| Condition | Behavior |
|----------|----------|
| Background allowed | FSM continues |
| Background blocked | Timer stops, state resets to idle |

---

### 8.2 Termination

| Event | Result |
|------|--------|
| APP_TERMINATED | Transition to idle, discard context |

---

## 9. Invariants

| Invariant |
|----------|
| Exactly one active state |
| Time updates only on TICK |
| Signals never trigger transitions |
| User actions always override system logic |

---

## 10. Design Rationale

| Principle | Explanation |
|----------|-------------|
| Explicit state | Predictable behavior |
| No automation | User remains in control |
| Signals as hints | No pressure to act |
