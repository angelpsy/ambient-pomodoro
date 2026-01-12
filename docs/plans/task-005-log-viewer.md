# Task 005 — In-app Log Viewer

## Task Metadata
- **Status**: done
- **Type**: feature
- **Priority**: MEDIUM
- **Risk**: LOW
- **Roadmap Link**: [09-roadmap.md](file:///Users/aalekseev042/Documents/projects/pet/ambient-pomodoro/docs/09-roadmap.md#L57)

## Goal
Implement a dedicated screen/overlay to view application logs in real-time and manage global log levels, allowing for better debugging and log control without a connected terminal.

## Execution Steps
- [x] Step 1: Create a LogStore [x]
    - [x] Implement a simple singleton to collect logs in memory.
    - [x] Limit log history size to prevent memory issues.
- [x] Step 2: Integrate Logger with LogStore [x]
    - [x] Update `LoggerImpl.ts` to push logs to `LogStore`.
- [x] Step 3: Create UI Components [x]
    - [x] Create `LogViewer` screen or modal.
    - [x] Implement log filtering by level (Debug/Info/Error).
    - [x] Integrate global log level selection.
- [x] Step 4: Add Navigation/Trigger [x]
    - [x] Update header to open the viewer.
    - [x] Remove the now redundant `LogSwitcher` component.
- [x] Step 5: Verification [x]
    - [x] Verify logs appear in the viewer.
    - [x] Verify filtering works.
