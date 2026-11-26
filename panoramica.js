(() => {
  const section=document.querySelector('#panoramica');
  const grid=section.querySelector('.locks');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const toggle=section.querySelector('.overview-motion');
  grid.innerHTML='<span><svg viewBox="0 0 12 14"><use href="#lock"/></svg></span>'.repeat(24);
  const cells=Array.from(grid.children);
  [3,9,13,20].forEach(i=>cells[i].classList.add('on'));
  cells[16].classList.add('warn');
  let visible=false, timer;
  function refresh(){
    clearInterval(timer);
    if(!visible || document.hidden || reduced.matches || section.hasAttribute('data-paused')) return;
    timer=setInterval(()=>{
      const cell=cells[Math.floor(Math.random()*cells.length)];
      if(cell.className) cell.className='';
      else cell.className=Math.random()<.2?'warn':'on';
    },900);
  }
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;refresh()}).observe(section);
  reduced.addEventListener('change',refresh);
  document.addEventListener('visibilitychange',refresh);
  toggle.addEventListener('click',()=>{
    const paused=section.toggleAttribute('data-paused');
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.textContent=paused?'Riprendi animazioni':'Pausa animazioni';
    refresh();
  });
  // Three visible faces give each object a consistent light source and solid edge.
  function slab(x, y, width, depth, height, lift, delay, symbol) {
    const a = width / 2, b = depth / 2;
    return `<g transform="translate(${x} ${y})"><g class="solid-part" style="--lift:${lift}px;--lag:${delay}ms">
      <path class="face-left" d="M${-a} 0 0 ${b}v${height}l${-a} ${-b}z"/>
      <path class="face-right" d="M0 ${b} ${a} 0v${height}L0 ${b+height}z"/>
      <path class="face-top" d="M${-a} 0 0 ${-b} ${a} 0 0 ${b}z"/>
      <g class="face-mark" transform="matrix(.85 .38 -.85 .38 0 0)">${symbol}</g>
    </g></g>`;
  }
  const lines='<path d="M-10 -5H10M-10 0H7M-10 5H3"/>';
  const check='<path d="m-8 0 5 5L9 -6"/>';
  const alert='<path d="M0 -8v10m0 4v1"/>';
  const scenes=[
    () => [0,1,2].map((n)=>slab(77+48*n,68+7*n,48,26,5+n*5,-8-n*12,n*85,[lines,check,alert][n])).join(''),
    () => slab(120,72,96,44,6,0,0,lines)+slab(120,68,84,40,5,-12,75,lines)+slab(120,64,72,34,5,-27,150,check),
    () => [0,1,2].map(n=>slab(110+9*n,74-4*n,96,43,4,-15*n,n*90,lines)).join(''),
    () => [0,1,2,3,4,5,6,7,8].map(n=>{
      const col=n%3, row=Math.floor(n/3), active=n===2||n===4||n===7;
      return slab(120+(col-row)*23,48+(col+row)*10,42,20,5,active?-17:0,n*32,active?alert:check);
    }).join('')
  ];
  section.querySelectorAll('.card').forEach((card,index)=>{
    const illustration=card.querySelector('.stars,.viz');
    const stage=document.createElement('div');
    stage.className='object-stage';
    illustration.before(stage);
    stage.append(illustration);
    stage.insertAdjacentHTML('beforeend',`<svg class="solid-scene" viewBox="0 0 240 110" aria-hidden="true" focusable="false">${scenes[index]()}</svg>`);

    const detail = card.querySelector('details');
    const trigger = detail.querySelector('summary');
    const title = card.querySelector('h3').textContent;
    function labelExample() {
      const label = detail.open ? 'Chiudi esempio' : 'Vedi esempio';
      trigger.textContent = label;
      trigger.setAttribute('aria-label', label + ': ' + title);
    }
    labelExample();
    detail.addEventListener('toggle', labelExample);
    card.addEventListener('click', event => {
      if (event.target.closest('details,a,button') || window.getSelection()?.toString()) return;
      detail.open = !detail.open;
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Escape' && detail.open) {
        detail.open = false;
        trigger.focus({preventScroll:true});
      }
    });
    card.addEventListener('pointermove',event=>{
      if(!fine.matches || reduced.matches || section.hasAttribute('data-paused')) return;
      const box=card.getBoundingClientRect();
      card.style.setProperty('--ay',((event.clientX-box.left)/box.width*16-8)+'deg');
      card.style.setProperty('--ax',(8-(event.clientY-box.top)/box.height*16)+'deg');
    });
    card.addEventListener('pointerleave',()=>{card.style.removeProperty('--ax');card.style.removeProperty('--ay')});
  });
})();
