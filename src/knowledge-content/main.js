// Initialize shared components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const { initBackToTop } = await import('../shared/scripts/backToTop.js');
  initBackToTop();
});
