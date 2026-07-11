# Ethan Lawrie — Portfolio

A framework-free editorial portfolio built with semantic HTML, CSS, and a small progressive-enhancement script.

## Structure

The visual system adapts Word Lawrie's teal, cream, coral, and geometric interface language. Run `python scripts/generate_public_resume.py` to rebuild the sanitised public resume after content changes.

- `index.html` — homepage, selected work, experience, capabilities, about, and contact
- `work/` — three detailed project case studies
- `style.css` — shared design system and responsive layout
- `main.js` — mobile navigation, header state, copyright year, and contact-form feedback
- `assets/resume/ethan-lawrie-resume.pdf` — public résumé with private contact details removed

## Local preview

Run any static server from the repository root, for example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173/`.

The contact form posts to the existing Google Apps Script endpoint. Use a clearly labelled test message when validating production submissions.
