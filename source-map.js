(() => {
  const map = document.querySelector('[data-flow-map]');
  if (!map) return;
  const fields = [
    ['Anagrafica', 'Assistenza sistemi', 'Il servizio fornito è associato alla scheda aziendale.'],
    ['Risposta ricevuta', 'Gestione degli accessi', 'La risposta al questionario resta collegata al fornitore.'],
    ['Evidenza da verificare', 'Procedura accessi.pdf', 'Il responsabile può confrontare il documento con la risposta.']
  ];
  const buttons = [...map.querySelectorAll('[data-source]')];
  const record = map.querySelector('.source-record');
  const outputs = ['field', 'value', 'text'].map(key => record.querySelector('[data-output-' + key + ']'));
  for (const line of map.querySelectorAll('path[data-line]')) {
    const packet = line.cloneNode(false);
    packet.classList.add('packet');
    line.after(packet);
  }
  function trace(index) {
    const packets = map.querySelectorAll('.packet');
    packets.forEach(packet => packet.classList.remove('is-moving'));
    record.classList.remove('source-updated');
    void map.offsetWidth;
    packets.forEach(packet => {
      if (packet.dataset.line === String(index) || packet.dataset.line === 'out') packet.classList.add('is-moving');
    });
    record.classList.add('source-updated');
  }
  buttons.forEach((button, index) => {
    button.style.setProperty('--source-order', index);
    button.addEventListener('click', () => {
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      outputs.forEach((output, column) => { output.textContent = fields[index][column]; });
      trace(index);
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      map.classList.add('flow-enter');
      trace(buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true'));
      observer.disconnect();
    }, { threshold:.22 });
    observer.observe(map);
  }
})();
