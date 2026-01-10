# Ambient Pomodoro — Requirements

---

## 1. Scope
This document defines functional and non-functional requirements for Ambient Pomodoro — a low-distraction focus timer.

The product prioritizes:
- minimal interruption
- user control over time
- predictable behavior
- zero pressure to “act correctly”

> [!NOTE]
> The system suggests, but never forces.

---

## 2. Core Concepts

### 2.1 Modes (States)
The timer operates in the following modes:
- **idle**: timer is not running
- **focus**: active work period
- **break**: short rest period
- **long-break**: extended rest period after multiple focus cycles
- **paused**: frozen state of any active mode

Only one mode can be active at a time.

---

### 2.2 Focus Cycle Logic
A focus cycle consists of:
- **focus → break**
- After 4 completed focus sessions, the next break must be a **long-break**.
- After completing a long-break, the cycle counter resets.

**Defaults**:
- **focus**: 25 minutes
- **break**: 5 minutes
- **long-break**: 15 minutes
- **cycles before long-break**: 4

> [!IMPORTANT]
> The system does **not** automatically switch modes. It only notifies the user that a mode can be changed.

---

## 3. Timer Behavior

### 3.1 Timer Execution
- The timer must continue counting time even after reaching zero.
- When a timer reaches zero:
    - a sound is played
    - a notification is shown
- If the user does nothing:
    - the timer continues running
    - repeated signals are emitted at the same interval

*Example: Focus ends → sound + notification → after another focus interval → sound + notification again.*

---

### 3.2 Pause Behavior
- User can pause the timer at any moment.
- While paused:
    - elapsed and remaining time are frozen
    - no signals are emitted
- After resume:
    - timer continues from the same point

---

### 3.3 Stop / Reset
- User can stop the timer at any moment.
- **Stop** action:
    - resets time
    - resets cycle counter
    - switches mode to **idle**

---

## 4. User Controls

### 4.1 Available Actions (Always)
From both the main screen and notification actions, the user can:
- start timer
- pause / resume
- stop (reset)
- manually switch to: **focus**, **break**, **long-break**

**No action is blocked by system logic.**

---

### 4.2 Notifications & Priority
**Signal priority**:
1. sound
2. notification
3. actions

**Notification properties**:
- minimal
- no vibration
- low-volume sound
- distinct text per mode:
    - “Time to focus”
    - “Time to rest”
    - “Long break”

---

## 5. UI Requirements (V0)

### 5.1 Main Screen
Must display:
- current mode
- elapsed time
- remaining time
- cycle progress (implicit or numeric)

**Controls**:
- start
- pause / resume
- next mode
- stop (reset)

---

### 5.2 Screen Behavior
- App may request keep screen on while visible.
- If screen turns off:
    - timer continues
    - notifications remain active
- User must always retain control via notifications.

---

## 6. Background & Lifecycle

### 6.1 Background Execution
- **Preferred**: timer runs while app is in background.
- If OS restricts background execution:
    - timer stops
    - state resets to idle
    - user is not misled

*This is acceptable for V0.*

---

### 6.2 App Termination
- Closing the app:
    - stops the timer
    - resets state
- No attempt to “recover” sessions in V0.

---

## 7. Data & Persistence
- All data is stored locally on device.
- No cloud sync, no accounts.
- **Minimal state persistence**:
    - last active mode
    - timer state (if app still alive)

---

## 8. Configuration

### 8.1 V0 Configuration
- No editable durations in V0. Fixed defaults only.

### 8.2 Future Configuration (Planned)
User-configurable:
- focus duration
- break duration
- long break duration
- number of focus sessions before long break
- sound selection

---

## 9. Logging & Diagnostics
- Internal logging system with levels: **debug**, **info**, **warning**, **error**.
- Log output targets: **console**, **local file** (readable from app).
- Logs must not distract during normal usage.

---

## 10. Quality Attributes
The product must:
- not create urgency
- not enforce behavior
- not punish inactivity
- preserve user sense of control
- remain calm and predictable

---

## 11. Explicit Non-Goals
The system must **NOT**:
- auto-switch modes
- gamify focus
- track streaks
- collect productivity metrics
- encourage “discipline” or “performance”

---

## 12. Acceptance Criteria (V0)
The product is acceptable if:
- a user can run focus cycles indefinitely
- signals are predictable and calm
- the user never feels forced to act
- the timer is understandable at a glance
- stopping or ignoring the timer is always safe
