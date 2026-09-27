# Five critique findings resolved

Implemented the five P2 findings from `2026-09-06T10-33-17Z__index-html.md`, as requested by Ethan. No publication performed.

## Changes

- Microsoft and CMV now give context, contribution and UAT milestone distinct jobs. Removed repeated tools/architecture prose and CMV's redundant reporting chapter. No new employer claims or internal details added; metadata and résumé facts remain consistent.
- Homepage name uses a narrower mobile size and binds its final letter to the decorative dot. At 320px the name occupies two lines, with no isolated punctuation.
- Word Lawrie uses the supplied Normal-mode gameplay image instead of the menu image beside the one-letter mechanic. Its 222px intrinsic width is preserved; alt text and caption explain the visible TOTAL → FEWER task.
- All three case pages end with a compact shared LinkedIn/résumé section, retaining case navigation and the private-contact boundary.
- Navigation current state accounts for the document bottom, explicit anchor selection, scrolling, resizing and restored page state. Removed obsolete contribution-section styles; updated DESIGN.md.

## Verification

- 35 route/viewport checks: all five routes at 320×740, 390×844, 844×390, 768×1024, 1024×768, 1440×900 and 704×900. No document overflow or main-content boxes outside the viewport.
- Visual review: 320px homepage, desktop Microsoft and CMV full pages, desktop Word gameplay section, and 320px case contact ending.
- All five routes at 320px with source-derived 200% root-font fixtures and executable-script-free fixtures: no clipped boxes or horizontal overflow; no-JavaScript navigation remains visible. Enlarged display text wraps as needed.
- Contact click, About click, manual scrolling to bottom and direct #contact arrival select the correct current link. Contact click focuses the section.
- Mobile menu tested open across 390px portrait to 844px landscape: internal scrolling, Shift+Tab to résumé and Escape focus restoration work. Case contact links are keyboard reachable.
- Gameplay displays at 222px; case section gutters and padding verified in browser. No current-tab console warnings/errors.
- Structural validator passed all five routes; JavaScript syntax passed; production build passed; git diff whitespace check passed.
- Final detector findings are reviewed separately from layout evidence: padding warnings refer to inherited/responsive/inner-shell spacing; white is intentional print styling; unlocated tight-leading remains unverifiable and does not override the approved display typography. No automatic ignore added.

## Limits

Browser checks used in-app Chromium, not physical devices or Safari/Firefox. The enlarged-text and no-script checks used source-derived fixtures, not browser configuration switches. No fresh OS reduced-motion or screen-reader test; existing reduced-motion CSS remains in place. No new résumé facts or PDF layout changes were required by these five fixes. Local preview is retained for user review.
