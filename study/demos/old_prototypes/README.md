# Screen Reader UI Prototypes

Small static HTML prototypes exploring usable screen-reader patterns with dummy data. The pages include plain accessible names first, then optional playful speech variants using syllable stretching such as `f'r'e's'h` and Eloquence-style inline command examples such as `‵vs55` and `‵vb65`.

Important: ECI commands are synthesizer-specific. In non-Eloquence screen readers they may be spoken literally, so these prototypes keep experimental phrasing opt-in and preserve normal visible text and plain labels.

## Files

- `index.html` - Directory page linking to all prototypes.
- `menu-order.html` - A cafe-style menu with category links, item cards, add/remove actions, and cart announcements.
- `menu.html` - A compact menu variation with category filter buttons and selectable announcement styles.
- `checkout-store.html` - A fake Amazon-style checkout with step review, delivery choices, order summary, and dummy order placement.
- `checkout-compare.html` - A dense comparison variation with a table-like product selector and summarized totals.
- `checkout.html` - A marketplace checkout variation with product cards, cart summary, delivery options, payment form, and live order announcements.
- `forum-thread.html` - A Reddit-style thread view with voting, sorted comments, nested replies, and live updates.
- `forum-compose.html` - A forum post composer variation with validation, preview, flair, and accessible warnings.
- `forum.html` - A forum feed variation with voting, sorting, posting, comments, and announcement tone options.
- `status-panel.html` - A compact status and notification prototype focused on live regions, severity levels, and speech variation controls.
- `styles.css` - Shared visual styling for all prototypes.
- `speech.js` - Shared helper for toggling plain, syllable-stretched, and ECI-style labels in the multi-file prototypes.

## What Each Prototype Explores

### Menu Order

Explores scannable food categories, semantic headings, list structure, filter state, and cart actions. It includes optional speech variants for item freshness, spice level, and limited availability while keeping ordinary button text visible.

### Menu Filter Variation

Explores fast category filtering, item-level status badges, and live cart messages with plain, syllable-stretched, and ECI-style announcement options.

### Checkout Flow

Explores product selection, cart quantity controls, checkout landmarks, form labeling, grouped delivery choices, and order confirmation. The page lets you switch between plain announcements and more expressive screen-reader announcements.

### Checkout Compare

Explores a more information-dense buying surface where users compare dummy products, adjust quantities, and review totals.

### Checkout Form Variation

Explores product cards, cart totals, delivery radio groups, and a realistic but fake payment form.

### Forum Thread

Explores a feed and selected discussion thread with voting, comment sorting, nested replies, and expressive label toggles.

### Forum Compose

Explores accessible validation, preview text, flair selection, and warnings for a post creation workflow.

### Forum Feed Variation

Explores a forum feed with posts, voting, sort controls, comment summaries, badges, and a compose form. Experimental speech variants emphasize post status, moderation state, and reply depth without replacing semantic structure.

### Status Panel

Explores short operational announcements, queue updates, error recovery, and progress messages. It demonstrates when expressive speech can help distinguish urgency from ordinary updates.

## Usage Notes

Open `index.html` directly in a browser. No build step or server is required.

The prototypes are intentionally simple and use static dummy content. Their interactive controls are small vanilla JavaScript examples meant to demonstrate accessible state changes, not production application architecture.
