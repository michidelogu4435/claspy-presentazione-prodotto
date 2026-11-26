(() => {
  const menuButton = document.querySelector('#burger');
  const menu = document.querySelector('#mmenu');
  const bubble = document.querySelector('#bubble');
  const launcher = document.querySelector('.fab');
  const updateMenu = () => menuButton.setAttribute('aria-label', menu.hidden ? 'Apri il menu' : 'Chiudi il menu');
  new MutationObserver(updateMenu).observe(menu, {attributes:true,attributeFilter:['hidden']});
  function setHelp(open) {
    bubble.hidden = !open;
    launcher.setAttribute('aria-expanded',String(open));
    if (open) bubble.querySelector('a').focus();
    else launcher.focus();
  }
  launcher.addEventListener('click', () => setHelp(bubble.hidden));
  bubble.querySelector('button').addEventListener('click',() => setHelp(false));
  document.addEventListener('keydown',e => {
    if (e.key !== 'Escape') return;
    if (!menu.hidden) {
      menu.hidden = true;
      menuButton.setAttribute('aria-expanded','false');
      menuButton.focus();
    } else if (!bubble.hidden) setHelp(false);
  });
})();

(() => {
  const screen = document.querySelector('.supply-console');
  if (!screen) return;
  const suppliers = [...screen.querySelectorAll('.supply-companies button')];
  const tabs = [...screen.querySelectorAll('.dashboard-guide button')];
  const fields = Object.fromEntries([...screen.querySelectorAll('[data-field]')].map(node => [node.dataset.field,node]));
  const progress = screen.querySelector('progress');
  const select = document.createElement('select');
  select.setAttribute('aria-label','Seleziona un fornitore');
  suppliers.forEach((button,index) => select.add(new Option(button.firstElementChild.textContent,String(index))));
  screen.querySelector('.supply-directory').append(select);
  let company = 0;
  let stage = 0;
  let manual = false;
  function render() {
    const button = suppliers[company];
    const {service,risk,answers,due} = button.dataset;
    const [received,total] = answers.includes('/') ? answers.split('/').map(Number) : [0,0];
    const date = due.replace(' dic',' dicembre');
    const remaining = total - received;
    const profile = total ? 'Il profilo ' + risk.toLowerCase() + ' prevede ' + total + ' domande.' : 'Per questo profilo non è previsto un questionario.';
    const outstanding = remaining ? 'Restano ' + remaining + ' risposte da ricevere.' : total ? 'Tutte le risposte sono state ricevute.' : 'Nessuna risposta richiesta.';
    const views = [
      ['Profilo di rischio',risk,profile],
      ['Questionario',total ? received + ' / ' + total : 'Non richiesto',outstanding],
      ['Scadenza',remaining ? date : total ? 'Completato' : 'Nessuna',remaining ? outstanding : 'Nessuna scadenza in sospeso.']
    ];
    fields.name.textContent = button.firstElementChild.textContent;
    fields.service.textContent = service;
    [fields.label.textContent,fields.value.textContent,fields.description.textContent] = views[stage];
    fields.status.textContent = total ? received + ' di ' + total + ' risposte' : 'Nessun questionario previsto';
    progress.hidden = !total;
    progress.max = total || 1;
    progress.value = received;
    suppliers.forEach((item,i) => item.setAttribute('aria-pressed',String(i === company)));
    tabs.forEach((item,i) => item.setAttribute('aria-pressed',String(i === stage)));
    select.value = String(company);
  }
  function selectSupplier(index) { manual = true; company = index; render(); }
  suppliers.forEach((item,i) => item.addEventListener('click',() => selectSupplier(i)));
  select.addEventListener('change',() => selectSupplier(Number(select.value)));
  tabs.forEach((item,i) => item.addEventListener('click',() => {manual=true;stage=i;render();}));
  screen.addEventListener('tour-phase',event => {
    if (!manual && stage !== event.detail) {stage=event.detail;render();}
  });
  render();
  window.dispatchEvent(new Event('resize'));
})();

