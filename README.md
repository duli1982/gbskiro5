# GBS AI SME Resources

This repository hosts static web pages and assets used for GBS AI learning resources, including workshop materials and a prompt library.

## Project Structure
- `index.html` – landing page for the site
- `gbs-ai-workshop/` – interactive workshop experience
- `gbs-prompts/` – library of reusable prompts
- `daily-focus/`, `ai-sme/`, `about-us/`, `knowledge-content/`, `rpo-training/` – additional site sections
- `shared/` – common assets
  - `shared/scripts/` – JavaScript components and utilities shared across pages
  - `shared/ai-sme-colors.css` – shared color palette and design tokens

## Building and Testing
No build step is required. To preview the site locally, run a simple web server and open `index.html` in a browser:

```bash
python3 -m http.server
```

Automated tests are not yet configured. Running `npm test` will indicate the absence of a test script.

## Contribution Guidelines
1. Fork the repository and create pull requests for changes.
2. Reuse files under `shared/` instead of duplicating scripts or styles.
3. Verify changes in a browser and run available checks such as `npm test`.
4. Use clear commit messages and keep the directory structure tidy.

