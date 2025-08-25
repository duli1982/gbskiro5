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

Eleventy builds pages from `src` while Vite bundles client-side assets.
Running `npm run dev` in the project root launches both so every page is served for development.

Available scripts:

| Command          | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `npm run dev`    | Serve all pages with Eleventy and Vite for local development |
| `npm run build`  | Generate pages with Eleventy then bundle assets with Vite    |
| `npm run lint`   | Run ESLint on the codebase                                   |
| `npm run format` | Format files using Prettier                                  |

Pre-commit hooks are managed by [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged); staged files are automatically linted and formatted before each commit.

Automated tests are not yet configured. Running `npm test` will indicate the absence of a test script.

## Feedback and Analytics

Every page now provides a simple **Was this page helpful?** widget that links to a shared feedback form.

Google Analytics is included to track page views and user paths. Review analytics at the start of each month to help prioritize future content updates.

## Contribution Guidelines

1. Fork the repository and create pull requests for changes.
2. Reuse files under `shared/` instead of duplicating scripts or styles.
3. Verify changes in a browser and run available checks such as `npm test`.
4. Use clear commit messages and keep the directory structure tidy.
