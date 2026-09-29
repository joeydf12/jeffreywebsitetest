(function(){
  var header=document.querySelector('.site-header');
  var hasHero=!!document.querySelector('.hero');
  var mcta=document.querySelector('.m-cta');
  function onScroll(){
    var y=window.scrollY||0;
    if(header){
      if(hasHero && y<60){header.classList.add('on-photo');header.classList.remove('solid');}
      else{header.classList.remove('on-photo');header.classList.add('solid');}
    }
    if(mcta){mcta.classList.toggle('show', y>window.innerHeight*0.6);}
  }
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  // Menu
  var menu=document.querySelector('.menu');
  document.querySelectorAll('[data-menu]').forEach(function(b){
    b.addEventListener('click',function(){
      var open=!menu.classList.contains('open');
      menu.classList.toggle('open',open);
      document.body.style.overflow=open?'hidden':'';
      document.querySelectorAll('.menu-btn').forEach(function(m){m.setAttribute('aria-expanded',open)});
    });
  });
  if(menu){menu.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');document.body.style.overflow='';});});}

  // Soft reveal only for items that start below the fold
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.rv').forEach(function(el){
      if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('pre');io.observe(el);}
    });
  }

  // Horizontal strip controls
  document.querySelectorAll('[data-strip]').forEach(function(ctrl){
    var strip=document.getElementById(ctrl.getAttribute('data-strip'));
    ctrl.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click',function(){strip.scrollBy({left:(b.dataset.dir==='prev'?-1:1)*strip.clientWidth*0.7,behavior:reduce?'auto':'smooth'});});
    });
  });

  // Lightbox
  var figs=[].slice.call(document.querySelectorAll('[data-lb] figure img'));
  if(figs.length){
    var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Foto vergroot');
    lb.innerHTML='<img alt=""><button class="x" type="button">Sluiten ✕</button><button class="pv" type="button" aria-label="Vorige">←</button><button class="nx" type="button" aria-label="Volgende">→</button>';
    document.body.appendChild(lb);
    var big=lb.querySelector('img'),idx=0,list=figs;
    function vis(){return figs.filter(function(i){return i.offsetParent!==null;});}
    function show(i){idx=(i+list.length)%list.length;var s=list[idx];big.src=s.dataset.full||s.src;big.alt=s.alt;}
    figs.forEach(function(img){img.parentElement.addEventListener('click',function(){list=vis();show(list.indexOf(img));lb.classList.add('open');document.body.style.overflow='hidden';lb.querySelector('.x').focus();});});
    function close(){lb.classList.remove('open');document.body.style.overflow='';}
    lb.querySelector('.x').addEventListener('click',close);
    lb.querySelector('.pv').addEventListener('click',function(e){e.stopPropagation();show(idx-1);});
    lb.querySelector('.nx').addEventListener('click',function(e){e.stopPropagation();show(idx+1);});
    lb.addEventListener('click',function(e){if(e.target===lb)close();});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1);});
  }

  // Portfolio filters
  var fbtns=document.querySelectorAll('.filters button');
  fbtns.forEach(function(b){b.addEventListener('click',function(){
    var f=b.dataset.f;
    fbtns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    document.querySelectorAll('.chapter').forEach(function(c){c.hidden=!(f==='all'||c.dataset.cat===f);});
  });});
  var h=(location.hash||'').slice(1);
  if(h){var fb=document.querySelector('.filters button[data-f="'+h+'"]');if(fb)fb.click();}

  // Contact form (demo: no backend yet)
  document.querySelectorAll('form.kf').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var n=(f.querySelector('#naam')||{}).value||'';
      var d=document.createElement('p');d.className='kf-done';d.setAttribute('role','status');
      d.textContent='Dank je wel'+(n?', '+n.split(' ')[0]:'')+'! Dit is een voorbeeldformulier: in de live-versie komt je bericht direct bij Jeffrey & Lionne binnen en hoor je binnen 24 uur van ons.';
      f.innerHTML='';f.appendChild(d);
    });
  });
})();
