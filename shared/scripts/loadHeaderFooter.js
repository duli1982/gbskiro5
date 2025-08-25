export async function initHeaderFooter() {
  const elements = document.querySelectorAll('[data-include]');
  await Promise.all(
    Array.from(elements).map(async (el) => {
      const name = el.getAttribute('data-include');
      try {
        const res = await fetch(`/shared/partials/${name}.html`);
        if (!res.ok) throw new Error(res.statusText);
        el.innerHTML = await res.text();
      } catch (err) {
        console.error(`Failed to load ${name} partial:`, err);
      }
    }),
  );
}

initHeaderFooter();
