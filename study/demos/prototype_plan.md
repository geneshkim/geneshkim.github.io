# Prototype Plan

This repo now keeps the current Google Docs-style prototype untouched at the root and backed up in `original_google_docs/`.
The three new work areas are:

- `functional_google_docs/`
- `playful_animal_docs/`
- `paper_pencil_docs/`

## Shared Controls

Each prototype should expose the same customization menu so participants compare design languages without losing control over access load.

- Speech on/off
- Earcons on/off
- Spatial panning on/off
- Activity log on/off
- Collaborator density where relevant
- Replay visible cursors in document order

The menu should control sensory load and feature channels, not switch the prototype into a different aesthetic.

## Functional Google Docs

This version should stay close to existing Google Docs screen reader behavior and the Co11ab prior-work feature set.
Collaborators should remain anonymous animals to mirror Google Docs anonymous identities, but their cues should be plain and informational.

Features to implement:

- Announce collaborators entering and leaving.
- Announce when the user is near text another collaborator is editing.
- Provide an active collaborator list.
- Let the user query current collaborator locations.
- Let the user jump to a collaborator's location.
- Let the user follow one collaborator's live edits.
- Provide an overview/skim cue for where collaborators, comments, and suggested edits are distributed.
- Provide proximity warnings for same paragraph, same line, and same cursor location.
- Keep earcons generic, short, and abstract.

Design stance:

- Plain, terse, reliable, low metaphor.
- Functional information first.
- Avoid decorative language.

## Playful Animal Docs

This version extends the current anonymous animal cursor concept.

Features to emphasize:

- Animal-specific earcons.
- Cursor parking lot as an earcon gallery.
- Spatial panning for collaborator position.
- Density control for 3, 6, or 9 animals.
- Playful but clear announcements.
- Optional collaborator motion cues that pan from old to new location.

Design stance:

- Playful, charming, memorable, socially legible.
- The animal identity is the organizing metaphor.

## Paper Pencil Docs

This version should not be quiet/minimal by default. It should make Google Docs feel like a paper-and-pencil workspace.

Features to emphasize:

- Pencil ticks, graphite scratches, eraser swipes, paper taps, page-edge cues.
- Collaborators as anonymous animals represented through paper-material gestures rather than animal-like sounds.
- Comments as sticky notes or margin tabs.
- Suggested edits as pencil insertions, strike-through scratches, and eraser/acceptance gestures.
- Section headings with tactile paper structure cues.
- Overview/skim cues that sound like moving across marked paper.

Design stance:

- Tactile, material, crafted, textured, hand-authored.
- Aesthetic richness comes from document materiality, not cuteness or quietness.

## Prior-Work Anchors For Functional Prototype

- Google Docs screen reader support already includes collaborator entry/exit announcements, near-editing notifications, active collaborator lists, jump-to-collaborator behavior, live edits, comment navigation, suggested edit navigation, and toggles for collaborator announcements.
- Co11ab contributes a stronger functional feature set for synchronous collaboration awareness: query location, follow mode, jump-to-location, relative proximity cues, and audio overview/scrollbar cues.
- Das et al. frame the core access problem as knowing who is doing what and where, avoiding concurrent edits, and gaining a high-level overview of collaboration activity.
