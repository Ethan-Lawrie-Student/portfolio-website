# Consistent motion across the portfolio

User requested high-quality, advanced animation across the entire website. The existing kinetic Swiss poster remains the focal moment. All routes, factual copy, images, palette, typography and contact boundaries are preserved. No deployment performed.

## Motion system

- Shared timing tokens and one decelerating curve coordinate the hero, case/404 entrances, controls, menu, images and structural rules.
- Native same-origin view transitions connect project titles and Word Lawrie artwork to their corresponding case pages, with a stable header and a brief page crossfade. Ordinary links and browser history are retained; unsupported browsers use normal navigation. Implementation follows [MDN's cross-document guidance](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using).
- A cancellable menu animation supports interruption. Closing immediately removes menu links from interaction using inert; Escape/focus handling remains intact. The header is measured with ResizeObserver so the menu and anchor offsets accommodate text enlargement and orientation changes.
- Case and 404 introductions use lateral registration and a bounded supporting stagger. Existing rules draw once. Genuine images receive a 10% framing reveal; body paragraphs are never hidden or repeatedly animated on scroll.
- Directional arrows acknowledge internal versus external navigation, with keyboard-equivalent feedback. Color inversion on the project index remains immediate to avoid low-contrast intermediate colors.
- JavaScript effects check reduced-motion and document visibility. Active Web Animations are canceled when motion reduction is requested or the document becomes hidden. No loops, animation dependencies, routing interception, sound or scroll capture.

## Verification

- Structural validator and production build passed; main.js syntax check passed; CSS brace balance and git diff whitespace check passed.
- Forty route/viewport checks: five routes at 320×740, 390×844, 844×390, 768×1024, 1024×768, 1440×900, 704×900 and 895×740. No horizontal overflow or unintended static content outside the viewport. Intentional moving hero layers are clipped within their frame.
- Fifteen source-derived fallback checks: all five routes at 320px with 200% root text, executable scripts removed, or both CSS and JavaScript reduced-motion paths selected. No horizontal overflow. No-script navigation remains visible; reduced-motion title animations are none.
- Mobile menu verified through rapid open/close/open, portrait-to-landscape changes, Shift+Tab to résumé, Escape and desktop breakpoint recovery. Found and fixed the enlarged-header menu bound: at 320×740 with 200% text the menu now ends at y=738 and its focused résumé ends at y=703, within the viewport.
- Native transition fixture reached ready and finished successfully; 12 animation objects were observed during the active transition. A skipped transition during rapid early testing exposed an unhandled ready promise; this is now handled, with cleanup on both finish and failure. Normal project-to-case navigation was verified.
- Visually reviewed the mobile menu, enlarged-text menu, Microsoft case entrance and existing poster composition. Keyboard project states, image framing and stable final layouts remain readable.
- Automated design warnings were checked against existing inner-shell/responsive padding, intentional print colors and the approved oversized display typography. The unlocated tight-leading warning remains unverified rather than treated as a visible defect.

## Limits

Tests used in-app Chromium. No physical-device frame-rate benchmark or Safari/Firefox run. Enlarged-text, no-script and reduced-motion tests used source-derived fixtures rather than changing OS/browser preferences. Cross-document transition support varies by browser; fallback navigation is preserved. No new screen-reader run or public deployment. Local preview remains available for review.
