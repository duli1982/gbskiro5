# GBS Prompt Library

This directory contains a simple browser for reusable prompts used during GBS AI training.

## File Structure
- `index.html` – interface for exploring prompts
- `prompts.json` – JSON collection of prompt examples
- Shared assets:
  - `../shared/scripts/` – JavaScript helpers for rendering
  - `../shared/ai-sme-colors.css` – shared color palette

## Building and Testing
The prompt library is a static page. Start a local server and open `index.html` to preview:

```bash
python3 -m http.server
```

There are currently no automated tests. Running `npm test` in the repository root will show that no test script is defined.

## Contribution Guidelines
1. Append new prompt entries to `prompts.json` using the existing structure.
2. Leverage assets under `../shared/` rather than duplicating code.
3. Verify the page renders correctly and run available checks like `npm test` before submitting changes.

