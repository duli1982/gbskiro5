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

## Development Workflow

Install dependencies once in the project root:

```bash
npm install
```

Available scripts:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the site for production |
| `npm run lint` | Run ESLint on the codebase |
| `npm run format` | Format files using Prettier |

Pre-commit hooks are managed by [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged); staged files are automatically linted and formatted before each commit.

Automated tests are not yet configured. Running `npm test` will indicate the absence of a test script.

## Contribution Guidelines
1. Fork the repository and create pull requests for changes.
2. Reuse files under `shared/` instead of duplicating scripts or styles.
3. Verify changes in a browser and run available checks such as `npm test`.
4. Use clear commit messages and keep the directory structure tidy.


