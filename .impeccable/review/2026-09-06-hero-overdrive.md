# Landing hero — kinetic Swiss poster

Ethan chose the kinetic Swiss poster direction from three overdrive proposals. The work is limited to the landing hero and shared stylesheet maintenance; no publication performed.

## Result

- The two name lines enter from opposing directions and settle into alignment over 760–900ms.
- The project index drives a single flat band through the name: teal/Microsoft, pale blue/CMV, salmon/Word Lawrie. The default composition uses salmon.
- A matching aria-hidden text layer supplies paper lettering inside the teal band. The semantic name remains one h1; both layers use identical type, wrapping and motion.
- Pointer hover and keyboard focus share the same accent state; the latest interaction takes precedence. Pointer exit restores focused-project or default state. Touch pointers do not create hover effects.
- No new dependencies, APIs, images, factual copy or scroll capture. JavaScript runs only in response to index events; there is no continuous hero rendering loop.
- Corrected the print-media closing boundary damaged by the preceding cleanup; restored print simplification and the intended top-level context/selection styles.
- Updated DESIGN.md, the sidecar motion guidance and the homepage surface brief.

## Validation

- Structural validator: all five routes pass. JavaScript syntax check and production build pass.
- 40 route/viewport checks: five routes at 320×740, 390×844, 844×390, 768×1024, 1024×768, 1440×900, 704×900 and 895×740. No horizontal document overflow or static content outside the viewport. Moving text layers are intentionally clipped inside the poster during entrance.
- Visually reviewed desktop default, Microsoft and CMV keyboard states, 320px static/reduced-motion composition and 320px enlarged text. Name lines remain two lines at ordinary 320px size. Enlarged text wraps without clipping or layer misalignment.
- Verified all three keyboard-driven band states, matching colors, reset after leaving the directory, one semantic h1, and equal base/overlay dimensions. Entrance transforms settle to identity.
- Source-derived 200% root-font and executable-script-free fixtures at 320px: no overflow; no-script navigation remains visible. Exact reduced-motion CSS branch fixture reports animation:none and transition:0s. CSS braces balanced.
- Contrast: paper/teal 10.23:1, ink/blue 8.14:1, ink/salmon 7.32:1. The text layer switches color with the band background.
- Detector warnings were reviewed against rendered evidence. Responsive/inner-shell padding and intentional white print colors are not visible defects. The unlocated tight-leading warning does not override the approved display type treatment.

## Limits

Testing used in-app Chromium, with source-derived fixtures for enlarged text, script-free access and reduced motion. No physical-device frame-rate benchmark or Safari/Firefox test was available. Pointer-hover wiring was inspected in source; keyboard activation verified the shared state/transition path. No new screen-reader or OS print-dialog test. Local preview retained for user review.
