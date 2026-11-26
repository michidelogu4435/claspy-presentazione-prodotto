(() => {
  const group = document.querySelector('.field-notes');
  if (!group || !window.IntersectionObserver || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(({ target }, index) => {
      target.style.setProperty('--note-delay', `${index * 230}ms`);
      target.dataset.visible = '';
      observer.unobserve(target);
    });
  }, { threshold: 0.16 });
  group.dataset.observed = '';
  group.querySelectorAll('.field-note').forEach(note => observer.observe(note));
})();
