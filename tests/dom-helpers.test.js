import { describe, it, expect, vi } from 'vitest';
import { qs, qsa, getElement } from '../shared/scripts/utils/dom-helpers.js';

describe('qs', () => {
  it('returns element by selector', () => {
    document.body.innerHTML = '<div id="app"></div>';
    const el = qs('#app');
    expect(el).not.toBeNull();
  });

  it('throws when required and missing', () => {
    document.body.innerHTML = '';
    expect(() => qs('#missing', { required: true })).toThrow();
  });
});

describe('qsa', () => {
  it('finds all matching elements', () => {
    document.body.innerHTML = '<p class="item"></p><p class="item"></p>';
    const nodes = qsa('.item');
    expect(nodes.length).toBe(2);
  });
});

describe('getElement', () => {
  it('logs error when element not found', () => {
    document.body.innerHTML = '';
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const el = getElement('#missing');
    expect(el).toBeNull();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Error: Element with selector "#missing" was not found.'));
    spy.mockRestore();
  });
});
