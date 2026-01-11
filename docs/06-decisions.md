# Ambient Pomodoro — Key Decisions

---

## Purpose

This document records **intentional decisions and trade-offs** made during product definition.

Its goals:
- preserve reasoning over time
- prevent re-litigation of settled questions
- help future contributors understand *why* things are the way they are

This is not a requirements list.
This is a decision log.

---

## 1. No Automatic Mode Switching

**Decision**  
The app never switches modes automatically.

**Alternatives considered**
- Auto-switch focus → break
- Auto-start breaks after signal

**Reasoning**
- Automatic transitions create pressure
- They interrupt deep focus
- They remove user agency

**Outcome**
- Signals inform only
- User explicitly decides when to switch

---

## 2. Signals as Side Effects, Not Transitions

**Decision**  
Sounds and notifications do not cause state changes.

**Alternatives considered**
- Signal triggers mode change
- Signal pauses timer

**Reasoning**
- Side effects should not mutate core state
- Predictability is critical for trust

**Outcome**
- TIME_ELAPSED emits signal only
- State remains unchanged

---

## 3. Timer Continues After Time Elapses

**Decision**  
When remaining time reaches zero, the timer continues running.

**Alternatives considered**
- Stop timer at zero
- Freeze at zero
- Auto-loop modes

**Reasoning**
- Stopping implies obligation
- Freezing creates urgency
- Continuous running supports ambient awareness

**Outcome**
- Elapsed time keeps increasing
- Signals may repeat

---

## 4. Manual Override Always Wins

**Decision**  
User actions always override system suggestions.

**Alternatives considered**
- Disable switching during pause
- Lock modes after signal

**Reasoning**
- Control reduces cognitive load
- Constraints increase friction

**Outcome**
- User can switch modes at any time
- No locked states

---

## 5. Long Break as Rhythm, Not Reward

**Decision**  
Long breaks exist as a rhythm mechanism, not a reward.

**Alternatives considered**
- Gamified long breaks
- Optional long breaks
- No long breaks

**Reasoning**
- Cognitive fatigue accumulates over cycles
- Rhythm helps without motivation mechanics

**Outcome**
- Long break suggested after 4 focus sessions
- No celebratory feedback

---

## 6. Accept OS Background Limitations

**Decision**  
The app does not aggressively fight OS background restrictions.

**Alternatives considered**
- Foreground services
- Battery optimization bypasses
- Wake locks

**Reasoning**
- Aggressive background behavior contradicts “ambient”
- Increases complexity and battery usage

**Outcome**
- If background execution fails, timer resets
- Behavior is explicit and predictable

---

## 7. Local-Only State

**Decision**  
All data is stored locally.

**Alternatives considered**
- Cloud sync
- Accounts
- Cross-device continuity

**Reasoning**
- Privacy
- Simplicity
- Reduced mental overhead

**Outcome**
- No accounts
- No sync
- No recovery guarantees

---

## 8. Single Timer for V0

**Decision**  
Only one timer exists in V0.

**Alternatives considered**
- Multiple timers
- Presets
- Profiles

**Reasoning**
- One timer fits ambient use
- Multiple timers add management burden

**Outcome**
- Single global timer
- Clear mental model

---

## 9. Minimal Feedback Intensity

**Decision**  
Feedback remains weak and predictable.

**Alternatives considered**
- Strong sounds
- Vibration
- Visual emphasis

**Reasoning**
- Strong signals break focus
- Predictability reduces stress

**Outcome**
- One soft sound
- No vibration
- Simple notifications

---

## 10. Logging for Debugging Only

**Decision**  
Logs exist only for debugging, not for user insight.

**Alternatives considered**
- User-facing logs
- Activity history

**Reasoning**
- Logs are implementation detail
- Users should not manage system internals

**Outcome**
- Log levels configurable
- Logs hidden unless needed

---

## 11. Manual Cycle Increments

**Decision**  
Focus cycles increment only when the user manually switches from Focus to another mode.

**Reasoning**  
Aligns with "The user decides" principle. Reaching the time limit triggers a signal, but completing a cycle is a conscious user decision.

**Outcome**  
- System never increments cycles automatically.
- User can "over-focus" and still count it as one cycle.

---

## 12. Elapsed Time Display

**Decision**  
V0 targets Android only.

**Alternatives considered**
- Cross-platform release
- Web version

**Reasoning**
- Reduce scope
- Faster iteration
- Better OS-specific decisions

**Outcome**
- Android-first architecture
- iOS deferred

---

## 12. Calm Over Completeness

**Decision**  
Calm experience is prioritized over feature completeness.

**Alternatives considered**
- Competitive feature parity
- Advanced customization

**Reasoning**
- Feature richness increases cognitive load
- Calm is the product differentiator

**Outcome**
- Fewer features
- Stronger identity

---

## 13. Hybrid Background Strategy (FGS + AlarmManager)

**Decision**  
Use a `Foreground Service` while active and `AlarmManager` for signal delivery.

**Alternatives considered**
- Pure FGS (too noisy/battery heavy)
- Pure AlarmManager (app might be killed too easily, losing UI state)

**Reasoning**
- Fits "Ambient" philosophy: notify when ready, but don't force a heavy process lock.
- `AlarmManager` is the most reliable way to deliver a signal at zero time.
- FGS provides the necessary persistent notification for user control (Pause/Next/Stop).

**Outcome**
- Reliable signals even after process death.
- Respectful battery usage.
- Predictable behavior on aggressive OEM skins.

> [!CAUTION]
> **Implementation Flexibility**: If this hybrid strategy proves to be excessively complex or causes unstable behavior during development, the Implementation Developer and System Architect may propose a simpler alternative (e.g., pure FGS), provided it does not violate the "Ambient" philosophy.

---

## Review Rule

If a future proposal contradicts any decision here:
- it must explicitly reference this document
- it must justify why the decision should be revisited

Otherwise, the decision stands.

---

## Closing Note

This document protects the product from:
- accidental complexity
- well-intentioned overengineering
- productivity theater

Ambient Pomodoro exists to stay out of the way.
