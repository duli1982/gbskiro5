// Initialize shared components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const { initScrollToTop } = await import('../shared/scripts/scrollToTop.js');
  initScrollToTop();
});
