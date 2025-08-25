# Design Guidelines

## Navigation

Use the shared header and footer partials to provide consistent navigation across all pages.

### Usage

1. Add placeholders where the navigation should appear:
   ```html
   <div data-include="header"></div>
   ...
   <div data-include="footer"></div>
   ```
2. Load the components with the shared script:
   ```html
   <script type="module" src="/shared/scripts/loadHeaderFooter.js"></script>
   ```

This script fetches `/shared/partials/header.html` and `/shared/partials/footer.html` and injects them into the page.

The header provides a standard "Back To Hub" link while the footer lists site-wide resources.
