# Ambient Pomodoro — Visual Design

---

## 1. Core Visual Principles

### 1.1 Calm
- **Low Contrast by Default**: Avoid pure black/white extremes.
- **No Sharp Accents**: Transitions should be soft.
- **Slow Visual Changes**: No rapid layout shifts.
- **Minimalism**: Only essential elements on screen.

### 1.2 Ambient
- **Low Attention Demand**: Interface should not distract from work.
- **Peripheral Readability**: State should be recognizable without direct focus.
- **No Forced CTA**: No "Call to Action" buttons pulling the eye.
- **Non-Intrusive Feedback**: UI remains quiet even after signal emission.

### 1.3 Premium
- **Aesthetic Shift**: Move away from "productivity tool" looks.
- **Context Inspiration**: Meditation apps, high-end audio players, system utilities.

---

## 2. Visual Invariants (Strict)

### 2.1 Contrast & Color Rules
- **Text**: WCAG AA compliant but avoid maximum contrast (e.g., use off-white instead of pure white).
- **Accents**: Use sparingly.
- **Forbidden**:
    - Red color for timers/time digits.
    - Blinking or pulsing elements.
    - High-intensity attention grabbers.

**Verification Check**: *Can the screen stay on for 30 minutes without causing eye strain or mental fatigue?*

### 2.2 Information Hierarchy
1. **Mode State** (Focus / Break / Long break)
2. **Time** (Elapsed / Remaining)
3. **Actions** (Secondary/Tertiary weight)

*Buttons must never dominate the state indicators.*

### 2.3 Animation Guidelines
- **Allowed**: Fade, cross-fade, slow progress filling.
- **Forbidden**: Bounce, spring, elastic, or any "playful" high-energy animations.

---

## 3. Design System (V0)

### 3.1 Color Palette (Orientation)
- **Background**: Very dark grey or warm "almost-black" (Avoid #000000).
- **Surface**: 3–6% lighter than background.
- **Text Primary**: Warm off-white.
- **Text Secondary**: Muted grey.

*Rationale: Warm tones and avoided extremes reduce cognitive load and fatigue.*

### 3.2 Mode Accents (Muted)
| Mode | Accent Idea | Rule |
|------|-------------|------|
| Focus | Muted Blue / Slate | Saturation ≤ 30% |
| Break | Muted Green | Used only in progress/headers |
| Long break | Warm Sand / Amber | Never in primary button fills |

---

## 4. Typography

### 4.1 Fonts
- **Requirement**: Neutral, readable, non-technical.
- **Candidates**: Inter (safe default), SF Pro (native), Manrope (soft).
- **Forbidden**: Display fonts, "rounded/fun" styles, ultra-narrow fonts.

### 4.2 Numeric Display (Crucial)
- **Tabular Numbers**: Mandatory for time display.
- **Monospaced Digits**: Essential to prevent layout jumping as time changes.
- **Static Digits**: No scaling or movement animations for numbers.

---

## 5. Main Screen Layout

### 5.1 Elements
- **Mode Header**: Small, high up.
- **Time Display**: Large, central (Elapsed & Remaining).
- **Progress Bar**: Very subtle, non-intrusive.
- **Actions Row**: 3 equal-weight buttons (Pause/Resume, Next, Stop).

### 5.2 Visual Priorities
- Buttons must have equal visual weight.
- No "Primary Action" button style.

---

## 6. Notification & OS UX
- **Consistency**: Same font, tone, and muted palette.
- **Subtlety**: Appear as a system reminder, not an urgent event.
- **No Bold Headlines**: Keep text weights predictable.

---

## 7. UX Designer Guidelines
- **Think "Meditation Timer"**, not "Productivity Tool".
- No gamification or motivational copy.
- No heavy shadows or skeumorphic depth.
- Focus on "Calm" over "Actionable".
