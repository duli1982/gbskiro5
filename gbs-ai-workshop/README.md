# GBS AI Workshop

This folder contains the interactive workshop used to introduce GBS teams to practical AI concepts.

## File Structure
- `index.html` – main workshop page
- `main.js` – client-side logic for demos
- `style.css` – workshop-specific styling
- `vercel.json` – deployment configuration
- Shared assets:
  - `../shared/scripts/` – reusable JavaScript components
  - `../shared/ai-sme-colors.css` – shared color palette

## Building and Testing
No build step is necessary. Launch a local server and open `index.html`:

```bash
python3 -m http.server
```

Automated tests are not defined for this project. Running `npm test` will confirm the absence of tests.

## Contribution Guidelines
1. Keep markup and styles minimal and reuse files from `../shared/`.
2. Preview changes in a browser before committing.
3. Run available checks such as `npm test` and ensure pages load without console errors.

