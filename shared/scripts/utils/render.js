import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.2/dist/purify.es.js';

/**
 * Safely render content into a target element.
 * - If `content` is a string, it will be inserted using `textContent` by default.
 * - To insert HTML, pass `{ sanitize: true }` which sanitizes the string with DOMPurify.
 * - If `content` is a Node, it will be appended directly after clearing the target.
 *
 * @param {Element} target - Element to receive the content.
 * @param {string|Node|null} content - Content to render.
 * @param {Object} [options]
 * @param {boolean} [options.sanitize=false] - When true, treat string content as HTML and sanitize it.
 */
export function render(target, content, { sanitize = false } = {}) {
  if (!target) return;
  target.replaceChildren();
  if (content == null) return;

  if (typeof content === 'string') {
    if (sanitize) {
      target.innerHTML = DOMPurify.sanitize(content);
    } else {
      target.textContent = content;
    }
  } else if (content instanceof Node) {
    target.appendChild(content);
  }
}
