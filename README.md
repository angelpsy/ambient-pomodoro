# Ambient Pomodoro
**A low-distraction focus timer**

Ambient Pomodoro is a minimal, signal-based Pomodoro timer designed to
support focus without forcing behavior.

It provides gentle time signals instead of strict enforcement.
You stay in control at all times.

---

## Why Ambient Pomodoro
Most Pomodoro timers:
- interrupt your work
- require constant interaction
- force mode switching
- demand attention

Ambient Pomodoro does the opposite.

It works in the background, emits quiet signals,
and lets you decide what to do next.

---

## Core ideas
- One short sound is enough
- No forced breaks
- No pressure, no guilt
- Focus is personal, not enforced

Pomodoro here is a **rhythm**, not a rule.

---

## Key characteristics
- Single active timer
- Focus / Rest / Long Rest modes
- Manual mode switching
- Pause, stop, and next actions
- Full control from the main screen and notifications
- All data stored locally
- No analytics, no tracking

---

## What this app is NOT
- Not a productivity tracker
- Not a habit builder
- Not a motivational coach
- Not a strict Pomodoro implementation

There are no stats, streaks, scores, or recommendations.
This is intentional.

---

## Documentation
All product and behavior decisions are documented in `/docs`:

- Vision and principles
- Functional and non-functional requirements
- Timer state machine
- Real-world usage scenarios
- Explicitly out-of-scope features
- Decision history and trade-offs
- **Implementation Handoff Rules**
- **Visual Design & UX Rules**

These documents are the source of truth for implementation.

---

## Project status
This is a pet project built for daily personal use.
The focus is clarity, predictability, and minimal distraction.

Features are added only when they support this goal.

---

## Tech stack
- React Native
- Android (primary target)
- Native modules where required

Implementation details are secondary to behavior and UX principles.

---

## Development

### Prerequisites
- Node.js >= 20
- Java JDK 11-17
- Android Studio & SDK
- Watchman (recommended)

### Running locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start Metro bundler:
   ```bash
   npm start
   ```
3. Run on Android emulator/device:
   ```bash
   npm run android
   ```

## Production Build

To build a release APK (signed with debug key for side-loading):

```bash
cd android
./gradlew assembleRelease
```
Artifact location: `android/app/build/outputs/apk/release/app-release.apk`

---

## Philosophy in one sentence
Ambient Pomodoro helps you stay aware of time
without telling you how to work.
