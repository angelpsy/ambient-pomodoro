# Ambient Pomodoro — Out of Scope

---

## Purpose

This document explicitly defines what is **out of scope** for the current version of Ambient Pomodoro.

The goal is to:
- prevent scope creep
- protect the core “low-distraction” idea
- simplify implementation and decision-making

Anything listed here must **not** be implemented in V0, even if technically easy.

---

## 1. Behavior & Automation

The application **must not**:

- Automatically switch between modes
- Force the user to start or stop breaks
- Enforce Pomodoro discipline
- Block work after focus time
- Escalate reminders if the user ignores them
- Change behavior based on productivity assumptions

Rationale:  
The app informs, not controls.

---

## 2. Personalization & Customization

Out of scope for V0:

- Custom focus / break durations
- Custom long-break rules
- User-defined cycle counts
- Multiple sounds or sound selection
- Volume control per mode
- Vibration settings
- Visual themes or appearance settings

Rationale:  
Defaults first, preferences later.

---

## 3. Statistics & Tracking

The application will **not** provide:

- Productivity metrics
- Focus streaks
- Daily or weekly reports
- Charts or analytics
- History of sessions
- Achievements or gamification

Rationale:  
Metrics increase cognitive load and pressure.

---

## 4. Accounts & Sync

Explicitly excluded:

- User accounts
- Authentication
- Cloud sync
- Cross-device continuity
- Backups or restores

Rationale:  
Local, private, and simple by design.

---

## 5. Notifications & Feedback

Out of scope:

- Persistent notifications
- Notification escalation
- Repeating notifications with increasing intensity
- Rich notification layouts
- Haptic feedback
- Full-screen interruptions

Rationale:  
Signals should remain ambient and calm.

---

## 6. Background Guarantees

The application does **not** guarantee:

- Reliable background execution on all devices
- Recovery after OS termination
- Exact timing precision under all conditions
- Survival under aggressive battery optimizations

Rationale:  
OS constraints are accepted, not worked around aggressively.

---

## 7. Multi-Timer & Advanced Modes

Not included in V0:

- Multiple concurrent timers
- Timer presets or profiles
- Task-based timers
- Context-aware modes
- Calendar integration

Rationale:  
One timer, one purpose.

---

## 8. Accessibility (Advanced)

Out of scope for initial version:

- Screen reader optimization
- Accessibility-specific modes
- Custom contrast or font scaling logic

Note:  
Basic platform accessibility support is expected by default.

---

## 9. Platforms & Ecosystem

Excluded for V0:

- iOS version
- Web version
- Desktop version
- Wearables
- External integrations

Rationale:  
Android-only focus for V0.

---

## 10. Non-Goals (Philosophical)

The app is **not intended** to:

- Maximize productivity
- Compete with full-featured Pomodoro apps
- Replace task managers
- Act as a habit builder
- Pressure the user into rest or work

---

## 11. Exit Criteria

If a feature:
- adds urgency
- adds pressure
- adds obligation
- adds cognitive overhead

…it is out of scope unless explicitly approved.

---

## Summary

Ambient Pomodoro V0 is intentionally minimal.

Anything that:
- pulls attention
- demands interaction
- evaluates behavior

is outside the boundaries of this product version.
