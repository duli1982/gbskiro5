export function insertScrollToTopButton() {
  let btn = document.getElementById('scroll-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'scroll-to-top';
    btn.className = 'scroll-to-top';
    btn.title = 'Scroll to top';
    btn.textContent = '\u25B2';
    document.body.appendChild(btn);
  }
  return btn;
}

export function toggleScrollToTopButton(btn) {
  if (window.pageYOffset > 300) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function initScrollToTop() {
  const btn = insertScrollToTopButton();
  window.addEventListener('scroll', () => toggleScrollToTopButton(btn));
  btn.addEventListener('click', scrollToTop);
  toggleScrollToTopButton(btn);
}
