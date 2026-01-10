# Task Plan 001: Project Initialization & Environment Setup

---

## Metadata
- **ID**: task-001
- **Status**: COMPLETED
- **Priority**: HIGH
- **Assignee**: System Architect / Implementation Developer
- **Target Version**: V0.1

---

## Description
Initialize the React Native project and ensure it runs on an Android device/emulator.

### Goals
- [x] Initialize React Native project with TypeScript.
- [x] Configure basic development environment.
- [x] Establish the core folder structure.
- [x] Ensure the project builds and runs successfully on Android.

---

## 1. Pre-requisites & Environment Setup
*This section is mandatory as `adb` and Android Studio were not detected.*

### 1.1 Install Android Studio
- [x] Download and install [Android Studio](https://developer.android.com/studio).
- [x] During setup, ensure **Android SDK**, **Android SDK Platform**, and **Android Virtual Device** are selected.

### 1.2 Environment Variables (macOS)
- [x] Add the following to your `~/.zshrc` or `~/.bash_profile`:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```
- [x] Run `source ~/.zshrc`.
- [x] Verify with `adb version`.

### 1.3 Create Android Emulator
- [x] Open Android Studio -> Device Manager.
- [x] Create a Virtual Device (e.g., Pixel 6, API 33+).
- [x] **Launch the emulator** and ensure it's fully booted.

---

## 2. Project Initialization

### 2.1 Initialization Command
- [x] Run initialization in the project root:
  ```bash
  npx @react-native-community/cli init AmbientPomodoro --directory . --skip-install
  ```
  *Note: We use --skip-install to manually manage dependencies if needed, or just let it run if you prefer.*

### 2.2 Install Dependencies
- [x] `npm install`

---

## 3. First Launch (Bolvanka)

### 3.1 Start Metro Bundler
- [x] In one terminal, run: `npm start`

### 3.2 Run on Android
- [x] In another terminal, run: `npm run android`
- [x] **Validation**: The default React Native "Welcome" screen must appear on the emulator.

---

## 4. Boilerplate Cleanup & Structure

### 4.1 Cleanup
- [x] Delete `App.tsx` (or simplify it to a "Hello Ambient" shell).
- [x] Remove unused assets/test files created by the template.

### 4.2 Establish Structure
- [x] Create directories:
  - `src/core`
  - `src/ui`
  - `src/api`
  - `src/assets`

---

## 5. Validation Checklist
- [x] `adb devices` lists the running emulator.
- [x] `npm run android` succeeds without build errors.
- [x] App is visible and responsive on the emulator.
- [x] Folder structure matches the requirements.

---

## Outcome
A clean, running React Native "base" project, ready for Core Timer Engine implementation.
