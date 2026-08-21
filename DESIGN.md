---
name: "Operational Field"
description: "A square, ruled editorial field that makes engineering evidence legible from the first viewport."
colors:
  paper: "#fdefd4"
  paper-raised: "#fff8e9"
  ink: "#242322"
  ink-muted: "#5d574d"
  operational-teal: "#1c3d46"
  operational-teal-raised: "#28505a"
  action-salmon: "#fc967d"
  action-salmon-strong: "#b4473d"
  signal-blue: "#91c3ce"
  signal-blue-ink: "#12363e"
  rule: "rgba(36, 35, 34, 0.31)"
  rule-light: "rgba(253, 239, 212, 0.32)"
typography:
  display:
    fontFamily: "\"IBM Plex Sans Condensed\", \"Arial Narrow\", sans-serif"
    fontSize: "clamp(3.8rem, 16vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.83
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "\"IBM Plex Sans Condensed\", \"Arial Narrow\", sans-serif"
    fontSize: "clamp(2.65rem, 8.5vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  title:
    fontFamily: "\"IBM Plex Sans\", Arial, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.01
    letterSpacing: "-0.035em"
  body-large:
    fontFamily: "\"IBM Plex Sans\", Arial, sans-serif"
    fontSize: "clamp(1.35rem, 3.1vw, 2.15rem)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  body:
    fontFamily: "\"IBM Plex Sans\", Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.56
  label:
    fontFamily: "\"IBM Plex Mono\", Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.05em"
rounded:
  square: "0"
spacing:
  space-1: "0.375rem"
  space-2: "0.75rem"
  space-3: "1rem"
  space-4: "1.5rem"
  space-5: "2rem"
  space-6: "3rem"
  space-7: "4.5rem"
  space-8: "6rem"
  gutter: "clamp(1rem, 4vw, 4rem)"
  section: "clamp(5.5rem, 9vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.action-salmon}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0.75rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
  button-primary-active:
    backgroundColor: "{colors.action-salmon-strong}"
    textColor: "{colors.paper-raised}"
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0.25rem 0"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    height: "3.75rem"
  nav-resume:
    backgroundColor: "{colors.action-salmon}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0 0.75rem"
    height: "2.15rem"
  field-contact:
    backgroundColor: "transparent"
    textColor: "{colors.paper-raised}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0.65rem 0"
  workflow-field:
    backgroundColor: "{colors.operational-teal}"
    textColor: "{colors.paper-raised}"
    rounded: "{rounded.square}"
    padding: "clamp(1.5rem, 4vw, 2.75rem)"
  project-microsoft:
    backgroundColor: "{colors.operational-teal}"
    textColor: "{colors.paper-raised}"
    rounded: "{rounded.square}"
    padding: "clamp(3.5rem, 7vw, 6.75rem) 0"
  project-cmv:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "clamp(3.5rem, 7vw, 6.75rem) 0"
  project-word:
    backgroundColor: "{colors.action-salmon}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "clamp(3.5rem, 7vw, 6.75rem) 0"
---

# Design System: Operational Field

## Overview

**Creative North Star: "Operational Field"**

Operational Field turns Ethan Lawrie's portfolio into a working editorial diagram: warm paper holds the narrative, ruled geometry exposes structure, and deep-teal fields make operational systems tangible without imitating private software. The world is direct, technical, and evidence-led; its originating seed is pinned-operational-field-20260821.

The interface behaves like one continuous field rather than a stack of interchangeable cards. Condensed statements establish hierarchy, system paths connect claims to proof, and restrained salmon and pale-blue signals create orientation without ornamental noise. The engineering work leads while navigation and motion remain quiet.

**Key Characteristics:**

- Warm paper and deep-teal fields divided by one-pixel ink rules.
- Condensed, uppercase statements paired with workhorse body copy and monospace evidence labels.
- Open workflow paths that change orientation instead of collapsing into generic cards.
- Factual project proof, with real imagery only where public-safe assets exist.
- Quiet, once-only motion that never gates content.

## Colors

The palette combines warm paper, charcoal ink, an operational teal field, salmon action signals, and pale-blue system metadata.

### Primary

- **Operational Teal** (#1c3d46, --teal): Full-width operational fields, Microsoft surfaces, the mobile workflow panel, case navigation, and the closing contact field.
- **Raised Operational Teal** (#28505a, --teal-raised): A reserved lighter teal for tonal variation when the base field needs separation.

### Secondary

- **Action Salmon** (#fc967d, --salmon): Primary actions, workflow rails and nodes, the Word Lawrie release field, and selection.
- **Strong Action Salmon** (#b4473d, --salmon-strong): High-contrast focus on paper, active controls, the wordmark point, and small evidence markers.

### Tertiary

- **Signal Blue** (#91c3ce, --blue): System labels and supporting copy on teal.
- **Signal Blue Ink** (#12363e, --blue-ink): Dark text reserved for pale-blue signal surfaces.

### Neutral

- **Warm Paper** (#fdefd4, --paper): Default page ground and the light edge around workflow nodes.
- **Raised Paper** (#fff8e9, --paper-raised): Raised editorial fields, light text on teal, image grounds, and button hover.
- **Charcoal Ink** (#242322, --ink): Primary text, hard borders, and the structural rule.
- **Muted Ink** (#5d574d, --ink-muted): Supporting copy and labels on light grounds.
- **Ink Rule** (rgba(36, 35, 34, 0.31), --rule): Secondary dividers on light grounds.
- **Light Rule** (rgba(253, 239, 212, 0.32), --rule-light): Secondary dividers on teal.

**The Evidence Signal Rule.** Salmon marks action and paths; pale blue marks system labels and supporting information. Neither becomes ambient decoration.

**The Paper and Field Rule.** Warm paper is the default canvas. Deep teal appears where operational proof, navigation closure, or contact intent warrants a field change.

## Typography

**Display Font:** IBM Plex Sans Condensed (with Arial Narrow and sans-serif fallbacks)  
**Body Font:** IBM Plex Sans (with Arial and sans-serif fallbacks)  
**Label/Mono Font:** IBM Plex Mono (with Consolas and monospace fallbacks)

**Character:** The condensed face gives names and major statements poster-like authority; the workhorse sans keeps technical narratives calm and readable. Mono functions as an evidence channel, not a decorative tech effect.

### Hierarchy

- **Display** (700, clamp(3.8rem, 16vw, 6rem), 0.83, -0.04em): Uppercase homepage name. Case-study H1s use the same family and weight at clamp(3rem, 10vw, 6rem) with 0.9 line-height.
- **Headline** (700, clamp(2.65rem, 8.5vw, 4.75rem), 0.94, -0.04em): Uppercase section statements; compact work headings use clamp(2.5rem, 5vw, 3.5rem).
- **Title** (400, clamp(2rem, 5vw, 3.4rem), 1.01, -0.035em): Project titles and major system statements in IBM Plex Sans.
- **Body Large** (400, clamp(1.35rem, 3.1vw, 2.15rem), 1.18, -0.025em): Homepage thesis and short editorial ledes.
- **Body** (400, 1rem, 1.56): Reading text, generally constrained to the 68ch measure; case narrative rises to 1.08rem on wide screens.
- **Label** (400, 0.7rem, 1.5, 0.05em): Uppercase roles, stacks, dates, statuses, evidence labels, captions, and system metadata.

**The Three-Voice Rule.** Condensed type makes major statements, sans type carries reading, and mono type labels evidence.

**The Mono Is Data Rule.** Do not set narrative paragraphs, invented commands, or decorative pseudo-technical copy in IBM Plex Mono.

## Layout

The shared shell is min(100% - 2 × clamp(1rem, 4vw, 4rem), 88rem). A sticky, one-rule header is exactly 3.75rem high. Major sections use clamp(5.5rem, 9vw, 9rem) vertical space, while the reusable spacing scale runs from 0.375rem to 6rem.

The homepage starts with a 12-column cover at desktop: the name and thesis occupy columns 1–7 and the workflow occupies columns 8–12. Selected work follows as full-width editorial rows, then a three-column experience ledger, a split profile field, and a two-column teal contact close. At 64rem and above, project rows use the same 12-column discipline: metadata begins in the first two columns, the narrative begins at column four, and evidence or media occupies the closing columns.

Case studies share one composition: a title/deck/meta hero, a full-width evidence field, three ruled narrative rows, and a two-link next-project cycle. At 64rem and above, the title spans eight columns, the deck spans the final four, the metadata ledger spans nine, and actions close the final three. Azure uses a five-stage trace and signal matrix; CMV uses a four-stage planned architecture and status proof; Word Lawrie uses a real-image release field and public distribution evidence.

Responsive breakpoints are exact: 22rem enables a two-column case metadata grid; 36rem enables paired evidence/form grids and the two-link case footer; 48rem opens two-column editorial intros and tablet project layouts; 56rem replaces the overlay menu with inline navigation; 64rem activates the 12-column cover, project, case-hero, and system grids; 72rem makes the final reading-size adjustment. A short-desktop query at max-height 46rem and min-width 64rem compresses the cover without removing evidence.

The homepage workflow has three authored states. Below 48rem it is a vertical five-step path inside a teal panel. From 48rem through 63.999rem it opens onto paper as a compact horizontal path. At 64rem and above it becomes an open five-row crosshair in the right five columns, with a vertical rail at 35%. Selected work must enter the 1505 × 1045 first viewport, and the primary Microsoft action remains visible before the fold when height allows.

**The First-Viewport Rule.** Lead with engineering evidence, not an oversized empty name field; the workflow and the start of selected work share the opening viewport.

## Elevation & Depth

There are no shadows, glows, gradients, blurs, or ornamental depth effects. Depth comes from tonal field changes, one-pixel borders, two-pixel signal rails, cropping, and real imagery. Hover state changes color or line length without lifting a surface.

**The Flat-by-Construction Rule.** Surfaces remain flat at rest and in interaction; structure comes from rules, fields, and content hierarchy.

## Shapes

The form language is square and infrastructural. Controls, fields, images, panels, metadata cells, workflow nodes, and project surfaces use zero radius. One-pixel rules create the shared skeleton; two-pixel salmon or teal rails carry paths through that skeleton. Workflow nodes are compact squares (0.6rem to 0.62rem) with contrasting field borders and a one-pixel signal outline.

**The Square-and-Ruled Rule.** Use square corners and one-pixel structural borders; never soften this system into rounded cards, floating pills, or detached bubbles.

## Components

### Buttons

- **Shape:** Square, one-pixel current-color border, 2.75rem minimum target height, and 0.75rem × 1rem padding.
- **Primary:** Action Salmon on Charcoal Ink; hover changes to Raised Paper, and active changes to Strong Action Salmon with Raised Paper text.
- **Focus:** A three-pixel Strong Action Salmon outline with a four-pixel offset on light grounds; teal and salmon fields switch to the context-safe accent.
- **Text link:** A 1.5rem leading rule expands to 2.25rem on hover; the link itself keeps a 2.75rem minimum target height.

### Cards / Containers

- **Corner Style:** Square (0).
- **Background:** Editorial rows replace generic cards: Microsoft uses Operational Teal, CMV uses Raised Paper, and Word Lawrie uses Action Salmon.
- **Shadow Strategy:** None; field color and one-pixel rules establish hierarchy.
- **Internal Padding:** Project rows use clamp(3.5rem, 7vw, 6.75rem) vertically; their content aligns to the shared shell.

### Inputs / Fields

- **Style:** Transparent contact fields on Operational Teal with no box and a one-pixel Raised Paper bottom rule; controls are square.
- **Focus:** The bottom rule grows to three pixels and changes to Action Salmon.
- **Error / Disabled:** aria-invalid uses the same three-pixel Action Salmon rule. The submit control preserves native submission, exposes a live status message, and lowers opacity to 0.65 while waiting.

### Navigation

The header is a sticky 3.75rem paper strip with a one-pixel ink rule. Below 56rem, the menu opens as a full-height teal panel beneath the header, traps focus, makes the page inert, closes on Escape, and presents ruled display-type links. At 56rem and above, links become compact IBM Plex Sans items with an animated underline; the résumé utility remains a square salmon control.

### Operational Workflow

The five-stage homepage path and the case-study trace/architecture paths are semantic ordered lists, not fake dashboards or terminal windows. Labels are pale blue or muted mono; plain-language facts carry the visual weight. The homepage path changes from vertical teal panel to horizontal paper path to desktop crosshair at the exact responsive thresholds documented in Layout.

### Case-Study Composition

Every case begins with a large title, concise deck, ruled four-cell metadata ledger, and optional actions. It then moves through one public-safe evidence field, three ruled narrative rows, an explicit confidentiality note where required, and a next-project navigation cycle. Conceptual Microsoft and CMV systems never masquerade as screenshots; Word Lawrie uses the available real release imagery.

### Motion and Accessibility

Motion uses the vendored Motion 13.1.0 runtime as progressive enhancement. Content is visible before JavaScript takes ownership. The enter easing is cubic-bezier(0.22, 1, 0.36, 1). The homepage opens as a single authored trace handoff: the two masked name lines resolve first, copy follows, the workflow rail draws over 0.62 seconds, and five stages register at 115ms intervals as the signal reaches them. The complete composition resolves in roughly 1.1 seconds without any individual movement exceeding 0.64 seconds. Later section and project groups reveal once with 8–14px movement over 0.42–0.52 seconds; items already visible with the opening hero stay still so they do not compete with it. Scroll-linked motion draws rails linearly; mobile navigation enters over 0.18 seconds and exits over 0.12 seconds. Link arrows move by only three pixels and form labels change color to acknowledge intent.

When prefers-reduced-motion is active, spatial, staged-node, in-view project, and scroll-linked motion are removed. The opening composition and major section changes retain gentle 0.28–0.42 second opacity-only transitions, mobile navigation uses a 0.08–0.12 second opacity transition, and rails remain complete. Smooth scrolling and decorative transform feedback are disabled while color, focus, validation, and form feedback remain available. Skip links, semantic landmarks, logical headings, descriptive image alternatives, 2.75rem interactive targets, aria-current, live form status, focus trapping, and visible focus are part of the component contract.

**The Visible-by-Default Rule.** Motion may reveal relationships, but it must never hide content when Motion fails, JavaScript is absent, or reduced motion is requested.

## Do's and Don'ts

### Do:

- Do use the exact warm-paper, teal-field, salmon-action, pale-blue-signal, and charcoal-rule roles.
- Do keep engineering evidence and the Microsoft case primary, with games as supporting proof of range.
- Do use semantic ordered lists and definition lists for workflow and evidence structures.
- Do keep Microsoft and CMV diagrams conceptual and public-safe, without private identifiers or screenshot styling.
- Do label the CMV 2,000+ employee reach as planned and the architecture as prepared rather than deployed.
- Do use real Word Lawrie imagery only where its source and provenance remain available.
- Do preserve skip navigation, visible focus, minimum target sizes, focus trapping, reduced-motion behavior, and live form status.
- Do keep claims factual, role-agnostic, résumé-supported, and understandable without confidential material.

### Don't:

- Don't introduce bento grids, floating pills, rounded cards, gradients, glows, blurs, shadows, card lifts, or ornamental depth.
- Don't add fake terminal chrome, invented commands, internal dashboards, fabricated metrics, deployment data, or confidential identifiers.
- Don't use parallax, scroll hijacking, looping animation, pulses, cursor effects, card scaling, or paragraph-by-paragraph fade sequences.
- Don't let IBM Plex Mono become a decorative technology trope or use it for narrative reading.
- Don't create an oversized empty hero or push selected work out of the opening viewport.
- Don't expose a private phone number or email address in public résumé or portfolio artifacts.
- Don't turn Word Lawrie into the portfolio's primary identity or imply that planned work has shipped.
