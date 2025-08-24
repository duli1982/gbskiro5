import { qs } from '../utils/dom-helpers.js';

/**
 * A reusable dropdown component.
 * It expects a container element with a `data-dropdown` attribute.
 * Inside the container, it looks for a button with `data-dropdown-button`
 * and a menu with `data-dropdown-menu`.
 *
 * @example
 * <!-- HTML structure -->
 * <div data-dropdown>
 *   <button data-dropdown-button>Open</button>
 *   <div data-dropdown-menu class="hidden">
 *     <a href="#">Item 1</a>
 *     <a href="#">Item 2</a>
 *   </div>
 * </div>
 *
 * // JS initialization
 * import { initializeDropdown } from './components/dropdown.js';
 * const dropdowns = document.querySelectorAll('[data-dropdown]');
 * dropdowns.forEach(initializeDropdown);
 */

/**
 * Initializes a single dropdown component, adding event listeners for interaction.
 * @param {Element} dropdownElement The container element for the dropdown.
 */
export function initializeDropdown(dropdownElement) {
  try {
    const button = qs('[data-dropdown-button]', { parent: dropdownElement, required: true });
    const menu = qs('[data-dropdown-menu]', { parent: dropdownElement, required: true });
    const menuItems = menu.querySelectorAll('a, button, [role="menuitem"]');

    // Accessibility attributes
    button.setAttribute('aria-expanded', 'false');
    menu.setAttribute('role', 'menu');
    menuItems.forEach(item => item.setAttribute('role', 'menuitem'));

    /**
     * Toggles the visibility of the dropdown menu with animations.
     */
    const openMenu = () => {
      menu.classList.remove('hidden');
      setTimeout(() => {
        menu.classList.remove('opacity-0', 'scale-95');
        menu.classList.add('opacity-100', 'scale-100');
      }, 10);
      button.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      menu.classList.remove('opacity-100', 'scale-100');
      menu.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 150);
      button.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        openMenu();
      } else {
        closeMenu();
      }
    };

    // Toggle dropdown when the button is clicked
    button.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevents the window click listener from immediately closing the menu
      toggleMenu();
    });

    button.addEventListener('keydown', (e) => {
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        toggleMenu();
        if (!menu.classList.contains('hidden')) {
          menuItems[0]?.focus();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (menu.classList.contains('hidden')) {
          openMenu();
        }
        menuItems[0]?.focus();
      }
    });

    // Close dropdown when clicking anywhere else on the page
    window.addEventListener('click', (event) => {
      if (!dropdownElement.contains(event.target) && !menu.classList.contains('hidden')) {
        closeMenu();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        closeMenu();
        button.focus();
      }
    });

    // Close dropdown when an item inside the menu is clicked
    menu.addEventListener('click', () => {
      if (!menu.classList.contains('hidden')) {
        closeMenu();
      }
    });

    menu.addEventListener('keydown', (e) => {
      const items = Array.from(menuItems);
      const currentIndex = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
      } else if (e.key === 'Escape') {
        closeMenu();
        button.focus();
      }
    });

  } catch (error) {
    console.error(`[Dropdown] Failed to initialize: ${error.message}`);
  }
}
