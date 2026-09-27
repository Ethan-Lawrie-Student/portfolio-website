# Ethan Lawrie — Portfolio

A framework-free editorial engineering portfolio built with semantic HTML, CSS, and a small progressive-enhancement script. The design carries Word Lawrie’s cream, teal, salmon and pale blue palette throughout, with self-hosted IBM Plex typography, strong section rules, bold project layouts, and a consistent motion system: a kinetic hero, native page continuity, interruptible navigation, and controlled image and link feedback. Reduced-motion and JavaScript-free access remain supported. Word Lawrie includes an optional, keyboard-accessible word-ladder example; case navigation previews and résumé format labels make destinations clearer.

## Structure

The homepage follows an evidence-first sequence: cover, selected work, experience, profile, competition record, and contact. Run `python scripts/generate_public_resume.py` to rebuild the sanitised public résumé after content changes; it intentionally omits private phone and email details.

- `index.html` — evidence-first homepage and compact contact links
- `work/` — three detailed project case studies
- `style.css` — shared design system and responsive layout
- `main.js` — accessible mobile navigation, active navigation, current year and accessible progressive enhancement
- `assets/fonts/` — self-hosted IBM Plex webfonts and license
- `assets/resume/ethan-lawrie-resume.pdf` — public résumé with private contact details removed
- `404.html`, `robots.txt`, and `sitemap.xml` — static-hosting and search-discovery files
- `scripts/generate_social_preview.py` — rebuilds the 1200×630 social card

## Local preview

Run any static server from the repository root, for example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173/`.

Run `python scripts/build_site.py` to create the static Worker build used for hosted previews.

Run `python scripts/validate_site.py` to check route metadata, heading structure, local links, fragments, protected external links, and JSON-LD.

Contact links to LinkedIn; no contact form or submission service is used. Public copy and the résumé omit internal employer details. Current UAT milestones are recorded in PRODUCT.md.

Impeccable is installed in `.agents/skills/impeccable`; project hooks use its local launcher. Reload the Codex session to discover `$impeccable`, then use `critique`, `audit`, `typeset`, `layout`, `adapt`, or `polish`. The bundled detector runs with `.agents\skills\impeccable\scripts\impeccable.cmd detect --json index.html work 404.html`. No Impeccable code is included in the website build.

The September redesign is a local review preview until public publication is approved.
