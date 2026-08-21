# Ethan Lawrie — Portfolio

A framework-free editorial engineering portfolio built with semantic HTML, CSS, and a small progressive-enhancement script. The design uses self-hosted IBM Plex typography, hard registration rules, evidence-led project layouts, and restrained motion.

## Structure

The homepage follows a recruiter-first sequence: cover, experience, selected work, profile, competition record, and contact. Run `python scripts/generate_public_resume.py` to rebuild the sanitised public résumé after content changes; it intentionally omits private phone and email details.

- `index.html` — recruiter-first homepage and contact form
- `work/` — three detailed project case studies
- `style.css` — shared design system and responsive layout
- `main.js` — accessible mobile navigation, active navigation, reveal/progress enhancement, current year, and contact-form feedback
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

The contact form posts to the existing Google Apps Script endpoint. Use a clearly labelled test message when validating production submissions.
