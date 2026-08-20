# Mac VoiceOver Troubleshooting Notes

Context: the study demos work reasonably well on Windows with NVDA and JAWS, but the Mac VoiceOver experience is poor. No implementation changes were made during this investigation.

## Observations

- The current prototypes are in `study/demos/functional_google_docs`, `study/demos/playful_animal_docs`, and `study/demos/paper_pencil_docs`.
- The editor is a `contenteditable` `div` with `role="textbox"` and `aria-multiline="true"`.
- In DOM order, the editor comes after the document header, collaborator presence area, toolbar buttons, settings menu, and other controls.
- NVDA/JAWS users can often press `e` to jump to the editable region. VoiceOver does not reliably provide the same quick path, especially for rich `contenteditable` regions.
- The interaction/event model depends on DOM focus, browser selection, key events, `input`, `mouseup`, and `selectionchange`.
- VoiceOver navigation can move through the accessibility tree without moving the browser caret/selection the way the scripts expect.
- Current shortcuts use `Control+Alt+<key>`. On macOS, Control+Option is the VoiceOver modifier, so these shortcuts can be intercepted by VoiceOver before the page receives them.
- Earcons are quiet on Mac, likely because they are short, low-gain synthesized sounds competing with VoiceOver speech/audio mixing.
- In the paper prototype, spatial pan is calculated and passed into sample playback, but `playSample()` uses `new Audio()` directly, so sample panning is not actually applied through WebAudio.

## Likely Causes

1. Editor discoverability is weak for VoiceOver.
   - The editable surface is buried after many focusable elements.
   - `contenteditable` plus `role="textbox"` is not as predictable as a native editable control in VoiceOver.

2. Shortcuts conflict with VoiceOver.
   - `Control+Alt` maps to the VoiceOver modifier on macOS.
   - `aria-keyshortcuts` only documents shortcuts; it does not make them work if the assistive tech consumes the keystroke.

3. Collaborator events depend on real browser selection.
   - `getCursorLocation()` reads `window.getSelection()`.
   - `selectionchange` only triggers evaluation when `document.activeElement === editor`.
   - VoiceOver review/navigation may not update those browser-level states.

4. The demo starts too late for Mac users.
   - `startDemo()` runs from editor focus/keydown.
   - If users are navigating but never truly focus the editor, collaborator joins/edits may not begin.

5. Earcon audibility is not calibrated for macOS VoiceOver.
   - Functional/playful earcons use short durations and relatively low gain.
   - VoiceOver speech can mask page audio.
   - Paper sample panning is not wired through WebAudio.

## Improvement Options

### Access to the Editor

- Add a first-focus skip link or button such as "Start editing document" that moves focus directly into the editor.
- Consider moving the primary editing surface before the toolbar in DOM order, or providing a bypass link before the toolbar.
- Consider using a native `<textarea>` for the study's editable surface if rich editing is not essential to the research question.
- If staying with `contenteditable`, add stronger focus affordances and descriptive instructions with `aria-describedby`.
- Make the intended entry point visible and keyboard reachable without relying on screen-reader quick navigation.

### Event Model

- Start the demo from a clear activation button or the first trusted page interaction, not only from editor focus.
- Evaluate collaborator proximity on explicit jump commands and document-entry actions, not only on selection changes.
- Avoid requiring `document.activeElement === editor` for all selection-driven event handling.
- Add focusable section or line sentinels if VoiceOver needs more reliable navigation anchors.
- Treat button commands as guaranteed access paths; shortcuts should be accelerators.

### Shortcuts

- Avoid `Control+Option` / `Control+Alt` on Mac because it conflicts with VoiceOver.
- Test Mac-specific alternatives such as `Control+Shift+<key>` or `Command+Shift+<key>` in VoiceOver with Safari and Chrome.
- Keep visible controls for every action, with shortcuts as optional.
- Update `aria-keyshortcuts` only after choosing shortcuts that actually work with VoiceOver.

### Audio

- Add a master gain or Mac-calibrated volume preset.
- Lengthen very short earcons slightly and raise gain where needed.
- Add a "test earcon volume" control before study tasks begin.
- Sequence speech and earcons intentionally so they do not mask each other.
- Route paper sample audio through WebAudio if panning/spatial cues are part of the prototype.

## Overall Read

This is probably not a single bug. The current demos assume Windows screen-reader behavior: quick navigation to edit fields, page-level receipt of `Control+Alt` shortcuts, and browser selection updates while reading/editing. VoiceOver has a different interaction model, so the prototype needs a Mac-specific entry path, shortcut strategy, event trigger strategy, and audio calibration.
