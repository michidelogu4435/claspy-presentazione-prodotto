(() => {
  const notes = [...document.querySelectorAll('.field-note')];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const played = new WeakSet();

  function play(note) {
    if (preference.matches || note.classList.contains('is-playing')) return;
    played.add(note);
    note.classList.add('is-playing');
    Promise.allSettled(note.getAnimations({subtree:true}).map(a => a.finished))
      .then(() => note.classList.remove('is-playing'));
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      play(entry.target);
      observer.unobserve(entry.target);
    }
  }, {threshold: .5}) : null;

  function applyPreference() {
    for (const note of notes) {
      const icon = note.querySelector('svg');
      const button = note.querySelector('.field-icon-replay');
      if (preference.matches) {
        observer?.unobserve(note);
        note.classList.remove('is-playing');
        if (button) button.replaceWith(icon);
      } else if (!button) {
        const replay = document.createElement('button');
        replay.type = 'button';
        replay.className = 'field-icon-replay';
        replay.setAttribute('aria-label', 'Rivedi animazione: ' + note.querySelector('h3').textContent);
        const label = document.createElement('span');
        label.textContent = 'Rivedi';
        icon.replaceWith(replay);
        replay.append(icon, label);
        replay.addEventListener('click', () => play(note));
        replay.addEventListener('focus', () => play(note));
        replay.addEventListener('pointerenter', event => {
          if (event.pointerType === 'mouse') play(note);
        });
        if (!played.has(note)) observer?.observe(note);
      }
    }
  }
  applyPreference();
  preference.addEventListener('change', applyPreference);
})();
