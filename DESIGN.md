---
name: "Ethan Lawrie — Editorial Portfolio"
description: "Pronounced brutalism with Swiss typography, a warm palette, and clear engineering stories."
colors:
  paper: "#fdefd4"
  raised: "#fdefd4"
  ink: "#1c3d46"
  muted: "#405f63"
  teal: "#1c3d46"
  salmon: "#fc967d"
  blue: "#91c3ce"
typography:
  display:
    fontFamily: "PlexCondensed, sans-serif"
    fontSize: "clamp(5.3rem, 13.4vw, 12.4rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  title:
    fontFamily: "PlexCondensed, sans-serif"
    fontSize: "clamp(3rem, 6.8vw, 7rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Plex, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "PlexMono, monospace"
    fontSize: "0.875rem"
    lineHeight: 1.5
rounded:
  square: "0"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  section: "clamp(3rem, 6vw, 6rem)"
components:
  button-primary:
    backgroundColor: "{colors.salmon}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0.75rem 1rem"
---

# Design System: Ethan Lawrie

## Overview

A bold, flat editorial portfolio with Swiss typographic discipline. Keep the original IBM Plex families and palette; make the name, project titles, and real work carry the identity. This September 2026 direction supersedes the historical Operational Field comps and their workflow-diagram requirements.

## Colors

Use Word Lawrie’s existing cream (#fdefd4), deep teal (#1c3d46), salmon (#fc967d), and pale blue (#91c3ce) consistently across all five routes. Cream is the reading canvas, including About; the raised token aliases that same cream. Ink aliases deep teal for text, rules, icons and focus. Secondary text uses a subdued teal (#405f63), never brown-grey. Teal/cream anchors Microsoft and contact; blue/teal connects CMV’s homepage section, case contribution and hero-index feedback; salmon/teal connects Word Lawrie and primary actions. Primary buttons and the résumé navigation action invert to teal/cream on hover or keyboard focus, with a teal outer focus ring on cream. Filled controls switch their foreground/background instantly to avoid low-contrast intermediate colours; directional arrow motion and contact-link colour feedback retain the shared timing. No alternate dark theme. Print retains dark ink on white for legibility and ink economy.

## Typography

Self-hosted IBM Plex Sans Condensed Bold carries the name, Selected Work, homepage project headlines, case titles, and contact. IBM Plex Sans Regular and Semibold carry quiet editorial headings and reading text. IBM Plex Mono is restricted to compact context and index numbers.

The user explicitly chose oversized, pronounced brutalism: the name may exceed generic 6rem display caps. Tracking stops at -0.04em. Project copy is 1rem or larger; dates and captions may be 0.8125–0.9375rem. Prose generally uses 45–55ch measures. Keep literal whitespace around responsive line breaks so suppressing a break never joins words.

## Layout

The shell is min(100% - 2 × gutter, 88rem). Desktop opens with an asymmetric name/intro layout and three-project directory. Selected work begins immediately below; projects follow Microsoft → CMV → Word Lawrie. Strong 2–3px boundaries distinguish chapters; thin internal rules are reserved for meaningful relationships.

At widths below 64rem, Word Lawrie's image moves below its copy. Below 56rem the enhanced navigation becomes a scrollable disclosure beneath the sticky header. Below 44rem the cover, project layouts, case narratives, and contact stack. Short landscape screens (height below 30rem) use a more compact cover. Avoid fixed section heights. Test the explicit phone/tablet/desktop matrix in the review report, not just breakpoint endpoints.

## Elevation & Depth

Flat fields and genuine imagery only. No gradients, shadow effects, card lifts, ornamental dashboards, or reconstructed employer screenshots.

## Shapes

Square controls and images. No pills or rounded card grids. Project numbers map the opening directory to the ordered work; do not add ornamental numbering to unrelated sections.

## Components

- Navigation retains Work, Experience, About, Contact, LinkedIn, and résumé. Focus is visible. Mobile menu supports Escape, keyboard traversal, orientation changes, and scrolling on short screens. Without JavaScript, navigation is visible in normal document flow.
- Contact is a compact LinkedIn/résumé ending at #contact. No form, email exposure, or submission endpoint.
- Selected Work is the second major typographic peak after the hero: a 6px entrance rule, oversized condensed section title and uppercase condensed project headlines. Keep the existing index numbers small in Plex Mono so the work titles lead. Use a tighter context column, and give Word Lawrie’s real artwork a larger share of its desktop row. At tablet widths its image moves below the copy; phones stack all content. Keep Experience and About quiet.
- Case pages share navigation, title, metadata and next links. Microsoft leads with contribution and a historical milestone; CMV leads with the reporting task and architecture responsibility; Word Lawrie uses real game artwork, interaction, leadership, and distribution.
- Employer case pages use compact context, contribution and milestone sections: state each fact once instead of repeating it in a deck, table and oversized chapter. All three cases end with direct LinkedIn and résumé links alongside the existing case navigation.
- At narrow widths, keep the final letter and punctuation of the name together. Word Lawrie's mechanic is illustrated by the supplied Normal-mode gameplay image, displayed no larger than its 222px native width.
- Current-section navigation follows scrolling and explicit anchor selection, including short sections at the bottom of the document.
- The landing hero is a kinetic Swiss poster: two IBM Plex name lines settle from opposite directions over 760–900ms. A flat band moves through the lettering to reflect project hover or keyboard focus (teal/Microsoft, pale blue/CMV, salmon/Word Lawrie). An aria-hidden duplicate changes text color only inside the band; expose the name once to assistive technology. Keep the default salmon composition useful without JavaScript. Touch does not trigger hover motion.
- Site-wide motion uses one decelerating curve, `cubic-bezier(.16,1,.3,1)`: 180ms feedback, 160ms exits, 300ms menu opening, 480ms route continuity, 560ms rule registration and 680ms image framing. The hero remains the focal sequence. Case/404 titles register over 620ms with a short, bounded stagger for supporting context; body text stays in place.
- Native same-origin page transitions connect project titles and Word Lawrie artwork to their case pages while retaining the header. Normal anchors, history and navigation remain the fallback. Suppress duplicate entrance sequences during native transitions and handle skipped transitions without errors.
- The mobile menu uses cancellable clip-path animation. Closing links become inert immediately, Escape restores focus, and a measured header height bounds the scrollable panel even with enlarged text. The plus/minus icon and directional link arrows use the same feedback timing.
- Existing section rules draw once, and real imagery receives a bounded framing entrance. No repetitive body-text reveals, animation library, continuous render loop or scroll capture. Reduced motion disables spatial effects and native page transitions while leaving instantaneous color/state feedback. Script-free pages remain fully readable and navigable.
- Delight rewards curiosity with useful, project-specific details: next-case descriptions, visible résumé format/page metadata, and warm contextual contact/recovery copy. Keep factual employer narratives unchanged.
- Word Lawrie includes a clearly illustrative COLD → CORD → CARD → WARD → WARM ladder. The complete path is visible without script; an optional native button advances one letter with a salmon highlight, polite status, and a cancellable 300ms/4px movement using the shared easing. Reduced motion retains instant state feedback. No completion spectacle, sound, loops or game embed.
- Images have explicit dimensions and lazy loading below the fold. Retain original assets and provenance.
- Focus rings must contrast with the surrounding surface, not just the control fill. The teal word-example button uses an ink ring on paper, with space above it. Its step/reset labels share a stable minimum width; animate only the glyph inside each letter cell so grid borders remain registered. Back-to-top arrows move upward on interaction.

## Do's and Don'ts

- Keep the employer summaries factual and high-level, applying PRODUCT.md's disclosure policy to HTML, metadata and PDF.
- Keep Microsoft and CMV UAT statements distinct; never infer production deployment.
- Remove repeated explanations rather than filling space with more labels or metadata grids.
- Use descriptive links and outward arrows only for external destinations/PDFs; internal project links use forward arrows.
- Preserve the existing five routes, SEO fields, structured data, résumé links, and palette.
- Test at 320px width, phone/tablet landscape, 200% text enlargement, keyboard-only use, and with script/motion disabled.
