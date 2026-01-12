# Task 004 — Native Alarm Scheduling (Android)

## Task Metadata
- **Status**: done
- **Type**: feature
- **Priority**: HIGH
- **Risk**: HIGH (Native background handling)
- **Roadmap Link**: [09-roadmap.md](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/docs/09-roadmap.md)

## Goal
Implement a hybrid scheduling system that ensures the timer results in a persistent signal (notification + sound) even when the app is in the background or killed.

## Execution Steps

- [x] Step 1: Research & Native Bridge Design [x]
- [x] Step 2: Native Android Implementation (Base) [x]
- [x] Step 3: Notification Refinement (Lock Screen & Actions) [x]
    - [x] Update `NotificationHelper.kt` for Lock Screen visibility.
    - [x] Add "NEXT" action button to notification.
    - [x] Handle notification actions in a new `BroadcastReceiver`.
- [x] Step 4: Core Engine Integration (Bridge Events) [x]
    - [x] Update `TimerNativeModule` to emit events to JS.
    - [x] Update `TimerEngineImpl.ts` to respond to the "NEXT" event.
- [x] Step 5: Verification [x]
    - [x] Test background signaling (lock screen/backgrounded).
    - [x] Test notification actions (Pause/Next).

## Verification Plan

### Automated Tests
- Unit tests for bridge call triggers in `TimerEngineImpl`.

### Manual Verification
1. Start Focus -> Background app -> Lock screen -> Wait for alarm.
2. Verify notification appears and sound plays.
3. Test notification actions: "Next" should cycle to Break and start a new alarm.
