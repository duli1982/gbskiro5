/**
 * Initializes back-to-top button functionality.
 * Shows the button after scrolling and scrolls to the top when clicked.
 */
export function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  backToTopBtn.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility();
}
