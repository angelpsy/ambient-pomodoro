# Technical Roadmap — Ambient Pomodoro

---

## Roadmap Principle
> Each version must feel calmer than the previous one.
> If a feature makes the app feel busier, it does not belong — regardless of how useful it seems.

---

## Phase 0 — Foundations (pre-V0)
**Goal**: Create a sustainable skeleton to avoid future technical debt.

### 1. Core
- [x] Define native timer engine boundary
- [x] Define FSM interfaces (events, state, side effects)
- [x] Decide timestamp-based timing model
- [x] Define logging strategy (levels, sinks)

### 2. Android
- [x] Create notification channels
- [x] Decide alarm strategy (AlarmManager)
- [x] Decide foreground service usage rules

**Risk mitigated**: Architectural drift.

---

## V0 — Ambient Pomodoro (Initial Release)
**Goal**: Reliable, unobtrusive timer with minimal UX.

### 1. Core Timer Engine (Native)
- [x] Implement FSM (per [03-state-machine.md](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/docs/03-state-machine.md))
- [x] Implement cycle counter (focus → break → long-break)
- [x] Timestamp-based elapsed / remaining calculation
- [x] Pause / resume semantics
- [x] Manual mode switching
- [x] Stop & reset logic
- **Artifacts**: Pure Kotlin module, no UI dependencies.

### 2. Scheduling & Background
- [x] AlarmManager scheduling for signals
- [x] Repeat signal logic (if ignored)
- [x] Alarm cancellation on pause / stop
- [x] Predictable degradation if background restricted
- [ ] **Optional (Behind Flag)**: Foreground service when timer active.

### 3. Notifications### 1. Core
- [x] Core FSM (idle/focus/break/cycle logic)
- [x] Hybrid scheduling (JS Engine + Android AlarmManager)
- [x] Notifications logic (JS ↔ Native signals)
- [x] Notifications logic (JS ↔ Native signals)

### 2. UI/UX
- [x] Minimal React Native UI (display mode/time, controls, no settings screen)
- [x] Log levels switcher in UI
- [x] In-app Log Viewer (separate header button)
    - [x] Log Level switcher (centralized in Viewer).
- [ ] Display: Current mode, elapsed / remaining time.
- [ ] Controls: Start, Pause / Resume, Next, Stop.
- [ ] No settings screen.

### 5. Logging & Debug
- [x] Log levels: debug / info / error.
- [x] In-app log viewer (accessible from header).
- [ ] Interactivity: Switch log levels on the fly.

### 6. QA & Validation
- [ ] Scenario-based manual testing ([04-scenarios.md](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/docs/04-scenarios.md)).
- [ ] Kill app / background tests.
- [ ] OEM behavior spot-check (Samsung / Pixel).

---

## V1 — Stability & UX Refinement
**Goal**: Make the product "reliable and polished."

### 1. UX Improvements
- [ ] Refined visual language.
- [ ] Better typography tuning.
- [ ] Subtle progress visualization.
- [ ] Mode-specific accent tuning.

### 2. Timer Configuration
- [ ] Adjustable durations: focus, break, long break.
- [ ] Adjustable cycle count.
- [ ] Defaults preserved.

### 3. Multi-Timer Support (Optional)
- [ ] Timer presets (not concurrent).
- [ ] Last-used timer on main screen.
- [ ] Simple naming.

### 4. Background Behavior Improvements
- [ ] Smarter foreground service usage.
- [ ] User education (why notification exists).
- [ ] Battery optimization hints (non-intrusive).

### 5. Robustness
- [x] Better state persistence (Logs synchronized to file).
- [ ] Restore timer after process death (best effort).
- [ ] Improved error logging.

---

## Future / Exploratory (Not Committed)
*These are ideas, not promises.*

### Ambient Enhancements
- Adaptive signal volume (based on environment).
- Sound design exploration (Custom Alarm Sounds).
- Visual dimming modes.

### UX Experiments
- Minimal always-on display mode.
- Lock-screen awareness.
- “Glanceable” widget.

### Platform Expansion
- iOS version.
- Desktop companion.
- Wearable companion.

### Advanced (Careful)
- Multiple concurrent timers (high risk).
- Context-aware suggestions.
- Calendar awareness.

---

## Explicit Non-Goals (Carry Forward)
- No gamification.
- No productivity metrics.
- No streaks.
- No behavioral pressure.

---

## How to Use This Roadmap
- **Orchestrator**: Task decomposition.
- **Developer**: Sequencing work.
- **Product**: Deciding what not to do.
