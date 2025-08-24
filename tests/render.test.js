import { describe, it, expect, vi } from 'vitest';

vi.mock('https://cdn.jsdelivr.net/npm/dompurify@3.0.2/dist/purify.es.js', () => ({
  default: { sanitize: vi.fn((html) => `sanitized:${html}`) }
}), { virtual: true });

import { render } from '../shared/scripts/utils/render.js';

describe('render', () => {
  it('sets text content for string input', () => {
    const target = document.createElement('div');
    render(target, 'hello');
    expect(target.textContent).toBe('hello');
  });

  it('sanitizes HTML when sanitize option is true', () => {
    const target = document.createElement('div');
    render(target, '<img>', { sanitize: true });
    expect(target.innerHTML).toBe('sanitized:<img>');
  });

  it('appends node content', () => {
    const target = document.createElement('div');
    const node = document.createElement('span');
    node.textContent = 'child';
    render(target, node);
    expect(target.firstChild).toBe(node);
  });

  it('returns early when target is null', () => {
    expect(() => render(null, 'noop')).not.toThrow();
  });
});
