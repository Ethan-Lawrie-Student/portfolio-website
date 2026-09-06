# Portfolio redesign brief

## Scope and mode

- Scope: homepage plus the shared visual and motion system used by all three case studies and the 404 page.
- Visitor mode: Experience. The engineering work leads; interface chrome remains quiet.
- Audience: recruiters and engineering hiring managers making a fast interview decision.
- Primary action: inspect the Microsoft case study, then open the public résumé or contact Ethan.

## Direction

- Chosen direction: **Operational Field**.
- Approved comp: `.impeccable/mocks/operational-field.png`.
- Memorable moment: an authored Azure workflow path occupies the first viewport beside Ethan's name, using only public-safe concepts and connecting directly into selected work.
- The generated comp is compositional authority only. Its invented command text, handler names, metrics, Azure Monitor references, and rollout language are explicitly rejected.

## Visual system inventory

| Ingredient | Record | Medium |
|---|---|---|
| Page ground | Existing Word Lawrie paper `#FDEFD4`; comp samples near `#FCECD4` | CSS token |
| Raised ground | `#FFF8E9` | CSS token |
| Ink | `#242322` | CSS token |
| Operational field | Existing deep teal `#1C3D46`; comp samples near `#153C46` | CSS token |
| Primary action | Salmon `#FC967D`; square corners, 1px ink border | Semantic link/button |
| Secondary signal | Pale blue `#91C3CE` | CSS token |
| Display type | IBM Plex Sans Condensed Bold, capped at 6rem | Existing self-hosted font |
| Body type | IBM Plex Sans, 65–75ch measure | Existing self-hosted font |
| Data type | IBM Plex Mono only for roles, stacks, statuses, and system labels | Existing self-hosted font |
| Header | 3.75rem sticky ruled strip, four primary anchors plus résumé/LinkedIn utilities | Semantic HTML/CSS |
| Hero composition | 7/5 asymmetric grid: name and thesis left; public-safe Azure workflow right | Semantic HTML/CSS |
| Azure workflow | Command → handlers → trace → signals/dashboard → review/CI/UAT, no internal names or values | Ordered list + CSS lines |
| Selected work | Full-width editorial rows; Microsoft teal, CMV raised paper, Word real-image field | Semantic articles/CSS grid |
| Microsoft evidence | Released to UAT; pull request + CI; multiple AI tool handlers | Definition list |
| CMV evidence | Architecture prepared; planned 2,000+ reach; dealerships + workshops | Definition list |
| Word evidence | 4.2/5 from 800+ votes; four-person team; licensed release | Definition list + existing raster |
| Word imagery | Existing product artwork and app menu image | Existing raster with origin provenance |
| Contact | Teal closing field with bottom-rule inputs and designed inline status | Semantic form/CSS |

## Responsive and motion contract

- Desktop/laptop: hero remains a true asymmetric two-column composition and selected work enters the first viewport.
- Tablet: hero becomes one dominant name block followed by a compact horizontal workflow; no overlap between display and proof.
- Mobile: the workflow becomes a five-step vertical index below the thesis, with the primary action visible before the fold when height allows.
- Motion uses vendored Motion 13.1.0 with visible-by-default progressive enhancement.
- Authored moments: quick header/name/workflow entrance; workflow line draw; grouped first-entry reveals; restrained section transitions; precise mobile-menu choreography.
- No parallax, scroll hijacking, looping animation, pulsing status, cursor effects, card scaling, or repeated paragraph-by-paragraph fades.
- Reduced motion disables transforms, clipping, and scroll-linked behavior without disabling navigation, focus, or form logic.

## Constraints

- Preserve all factual claims, routes, SEO, accessibility hooks, form field names/action, and the case-study navigation cycle.
- Microsoft and CMV visuals are conceptual public-safe diagrams, never represented as screenshots or internal telemetry.
- CMV scope remains explicitly planned.
- Games remain supporting evidence rather than the primary identity.
