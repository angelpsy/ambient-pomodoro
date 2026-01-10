# Ambient Pomodoro — Notes & Reflections

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
