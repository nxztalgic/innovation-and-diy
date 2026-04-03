/* ── CURSOR ── */
var siteLoader=document.getElementById('siteLoader');
var loaderText=document.getElementById('loaderText');
var siteReady=false;
var loaderMinDone=false;
var loaderWords=['Loading','Crafting','Building'];
var loaderWordIdx=0;
var loaderTicker=null;
var rootStyles=getComputedStyle(document.documentElement);
var loaderHold=parseFloat(rootStyles.getPropertyValue('--loader-hold'))||1500;
function finishLoader(){
  if(siteReady&&loaderMinDone&&siteLoader&&!siteLoader.classList.contains('hide')){
    if(loaderTicker)clearInterval(loaderTicker);
    siteLoader.classList.add('hide');
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    window.scrollTo(0,0);
    setTimeout(function(){if(siteLoader)siteLoader.remove();},1050);
  }
}
window.addEventListener('beforeunload',function(){window.scrollTo(0,0);});
if(loaderText){
  loaderTicker=setInterval(function(){
    loaderWordIdx=(loaderWordIdx+1)%loaderWords.length;
    loaderText.innerHTML=loaderWords[loaderWordIdx].slice(0,-3)+'<span class="acc">'+loaderWords[loaderWordIdx].slice(-3)+'</span>';
  },520);
  loaderText.innerHTML=loaderWords[0].slice(0,-3)+'<span class="acc">'+loaderWords[0].slice(-3)+'</span>';
}
setTimeout(function(){loaderMinDone=true;finishLoader();},loaderHold);
window.addEventListener('load',function(){siteReady=true;finishLoader();});

var isTouchDevice=window.matchMedia('(hover: none), (pointer: coarse)').matches||'ontouchstart' in window||navigator.maxTouchPoints>0;
if(isTouchDevice){document.body.classList.add('touch-device');}
var cd=document.getElementById('cd'),cr=document.getElementById('cr'),cl=document.getElementById('cl');
var mx=0,my=0,rx=0,ry=0;
function ch(on){if(!isTouchDevice)document.body.classList.toggle('ch',on);}
function cv(on){if(!isTouchDevice)document.body.classList.toggle('cv',on);}
if(!isTouchDevice&&cd&&cr){
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    cd.style.left=mx+'px';cd.style.top=my+'px';
    if(cl){cl.style.left=mx+'px';cl.style.top=my+'px';}
  });
  (function tick(){
    rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
    cr.style.left=rx+'px';cr.style.top=ry+'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,.ev-row,.feat-card,.fb,.notify-b,.dt,.cfb,.fcb,.faq-q,.faq-tb,.cc,.sli,.uci,.ct,.lc,.ldc,.mc,.vi,.pq,.mt,.vsi,.dc,.tl-s').forEach(function(el){
    el.addEventListener('mouseenter',function(){ch(true);});
    el.addEventListener('mouseleave',function(){ch(false);});
  });
  document.querySelectorAll('.mi').forEach(function(el){
    el.addEventListener('mouseenter',function(){ch(false);cv(true);});
    el.addEventListener('mouseleave',function(){cv(false);});
  });
  document.querySelectorAll('.fi,.ft2,.fsel,.faq-si').forEach(function(el){
    el.addEventListener('mouseenter',function(){ch(true);});
    el.addEventListener('mouseleave',function(){ch(false);});
  });
}

/* ── PROGRESS BAR ── */
var pb=document.getElementById('pb');
window.addEventListener('scroll',function(){
  var pct=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
  pb.style.width=Math.min(pct,100)+'%';
},{passive:true});

/* ── MOBILE NAV ── */
var hbg=document.getElementById('hbg'),nd=document.getElementById('ndrawer');
hbg.addEventListener('click',function(){
  hbg.classList.toggle('open');nd.classList.toggle('open');
  document.body.style.overflow=nd.classList.contains('open')?'hidden':'';
});
nd.querySelectorAll('a').forEach(function(a){
  a.addEventListener('click',function(){
    hbg.classList.remove('open');nd.classList.remove('open');
    document.body.style.overflow='';
  });
});

/* ── SCROLL ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

/* ── ACTIVE NAV ── */
var nls=document.querySelectorAll('.nl a');
var sects=document.querySelectorAll('div[id][style*="scroll-margin"]');
var spy=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      var id=e.target.id;
      nls.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+id);});
    }
  });
},{threshold:0.4,rootMargin:'-80px 0px -40% 0px'});
sects.forEach(function(el){spy.observe(el);});

/* ── REVEAL ── */
var rio=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target);}});
},{threshold:0.08});
document.querySelectorAll('.rv,.rvl,.rvr,.stat-c,.vi,.tli,.mi').forEach(function(el){rio.observe(el);});

/* ── YEAR ── */
var yrEl=document.getElementById('yr');
if(yrEl)yrEl.textContent=new Date().getFullYear();

/* ── HOME COUNTERS ── */
function animCounter(el){
  var tgt=parseInt(el.dataset.target),t0=performance.now(),dur=1200;
  function step(now){var p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(e*tgt);if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
var cio=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){animCounter(e.target);cio.unobserve(e.target);}});
},{threshold:0.5});
document.querySelectorAll('.counter').forEach(function(el){cio.observe(el);});

/* ── EVENTS FILTER ── */
var ftabs=document.querySelectorAll('#ftabs .fb');
var erows=document.querySelectorAll('#evlist .ev-row');
var ecnt=document.getElementById('evcnt');
ftabs.forEach(function(btn){
  btn.addEventListener('click',function(){
    ftabs.forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    var f=btn.dataset.filter,v=0;
    erows.forEach(function(row){
      var m=f==='all'||row.dataset.filter===f;
      if(m){
        row.style.display='grid';row.style.opacity='0';row.style.transform='translateY(12px)';
        setTimeout(function(i){return function(){row.style.transition='opacity 350ms cubic-bezier(0.23,1,0.32,1),transform 350ms cubic-bezier(0.23,1,0.32,1)';row.style.opacity='1';row.style.transform='translateY(0)';};}(v),v*40);
        v++;row.querySelector('.ern').textContent=String(v).padStart(2,'0');
      }else{row.style.display='none';}
    });
    if(ecnt)ecnt.textContent=v+' event'+(v!==1?'s':'');
  });
});

/* ── TIMELINE ── */
var tlio=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');tlio.unobserve(e.target);}});
},{threshold:0.1});
document.querySelectorAll('.tli').forEach(function(el){tlio.observe(el);});
if(window.Swiper){
  new Swiper('#tlSwiper',{
    slidesPerView:1.08,
    spaceBetween:20,
    speed:700,
    grabCursor:true,
    navigation:{nextEl:'.tl-next',prevEl:'.tl-prev'},
    pagination:{el:'#tlPagination',clickable:true},
    breakpoints:{
      640:{slidesPerView:2.15,spaceBetween:24},
      960:{slidesPerView:3.2,spaceBetween:24},
      1280:{slidesPerView:4.15,spaceBetween:24}
    }
  });
}

/* ── DEPT TABS ── */
var dtabs=document.querySelectorAll('#dtabs .dt');
var dpanels=document.querySelectorAll('.dp');
dtabs.forEach(function(tab){
  tab.addEventListener('click',function(){
    dtabs.forEach(function(t){t.classList.remove('active');});tab.classList.add('active');
    dpanels.forEach(function(p){p.classList.remove('active');p.style.opacity='0';p.style.transform='translateY(12px)';});
    var act=document.getElementById('dept-'+tab.dataset.dept);
    if(act){
      act.classList.add('active');act.style.transition='none';act.style.opacity='0';act.style.transform='translateY(12px)';
      requestAnimationFrame(function(){act.style.transition='opacity 350ms cubic-bezier(0.23,1,0.32,1),transform 350ms cubic-bezier(0.23,1,0.32,1)';act.style.opacity='1';act.style.transform='translateY(0)';});
    }
  });
});

/* ── GALLERY FILTER ── */
var cfbs=document.querySelectorAll('#cfs .cfb');
var mitems=document.querySelectorAll('#masg .mi');
function loadGalleryBg(el){
  if(!el||el.dataset.bgLoaded==='true')return;
  var bg=el.dataset.bg;
  if(!bg)return;
  el.style.backgroundImage=bg;
  el.dataset.bgLoaded='true';
  el.classList.add('bg-ready');
}
var galleryBgs=document.querySelectorAll('#masg .pbg[data-bg]');
if('IntersectionObserver' in window){
  var bgio=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        loadGalleryBg(entry.target);
        bgio.unobserve(entry.target);
      }
    });
  },{rootMargin:'250px 0px'});
  galleryBgs.forEach(function(bg){bgio.observe(bg);});
}else{
  galleryBgs.forEach(loadGalleryBg);
}
cfbs.forEach(function(btn){
  btn.addEventListener('click',function(){
    cfbs.forEach(function(b){b.classList.remove('active');});btn.classList.add('active');
    var cat=btn.dataset.cat;
    mitems.forEach(function(item){
      var m=cat==='all'||item.dataset.cat===cat;
      if(m){
        item.classList.remove('fil');item.style.opacity='0';item.style.transform='translateY(16px)';
        setTimeout(function(){item.style.transition='opacity 400ms cubic-bezier(0.23,1,0.32,1),transform 400ms cubic-bezier(0.23,1,0.32,1)';item.style.opacity='1';item.style.transform='translateY(0)';},30);
      }else{
        item.style.transition='opacity 200ms ease,transform 200ms ease';item.style.opacity='0';item.style.transform='scale(0.96)';
        setTimeout(function(){item.classList.add('fil');},220);
      }
    });
  });
});

/* ── LIGHTBOX ── */
var lb=document.getElementById('lb'),lbImg=document.getElementById('lbImg'),lbWrap=document.getElementById('lbWrap'),lbTag=document.getElementById('lbTag'),lbCap=document.getElementById('lbCap'),lbDate=document.getElementById('lbDate');
var lbIdx=0,lbVis=[],lbSwiper=null;
function getVis(){return Array.from(mitems).filter(function(i){return !i.classList.contains('fil');});}
function syncLbMeta(item){
  if(!item)return;
  lbTag.textContent=item.dataset.tag||'';
  lbCap.textContent=item.dataset.cap||'';
  lbDate.textContent=item.dataset.date||'';
}
function renderLbSlides(items){
  if(!lbWrap)return;
  lbWrap.innerHTML='';
  if(!items.length){
    lbWrap.innerHTML='<div class="swiper-slide lb-slide"><span style="font-size:48px;opacity:.15">&#128247;</span></div>';
    return;
  }
  items.forEach(function(item){
    var bg=item.querySelector('.pbg');
    loadGalleryBg(bg);
    var slide=document.createElement('div');
    slide.className='swiper-slide lb-slide';
    slide.style.cssText=(bg?bg.style.cssText:'')+';min-height:300px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;';
    lbWrap.appendChild(slide);
  });
}
function ensureLbSwiper(startIdx){
  if(!window.Swiper||!lbImg)return null;
  if(lbSwiper){
    lbSwiper.update();
    lbSwiper.slideTo(startIdx||0,0,false);
    return lbSwiper;
  }
  lbSwiper=new Swiper('#lbImg',{
    initialSlide:startIdx||0,
    speed:400,
    allowTouchMove:true,
    simulateTouch:true,
    resistanceRatio:0.85,
    observer:true,
    observeParents:true,
    on:{
      slideChange:function(){
        lbIdx=this.activeIndex;
        syncLbMeta(lbVis[lbIdx]);
      }
    }
  });
  return lbSwiper;
}
function openLb(idx){
  lbVis=getVis();lbIdx=idx;
  var item=lbVis[lbIdx];if(!item)return;
  renderLbSlides(lbVis);
  if(window.Swiper){
    ensureLbSwiper(lbIdx);
  }else{
    var bg=item.querySelector('.pbg');
    loadGalleryBg(bg);
    lbWrap.innerHTML='<div class="swiper-slide lb-slide" style="'+(bg?bg.style.cssText:'')+';min-height:300px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;"></div>';
  }
  syncLbMeta(item);
  lb.classList.add('open');document.body.style.overflow='hidden';
}
function closeLb(){lb.classList.remove('open');document.body.style.overflow='';}
function lbNav(d){
  lbVis=getVis();
  if(!lbVis.length)return;
  lbIdx=(lbIdx+d+lbVis.length)%lbVis.length;
  if(lbSwiper){
    lbSwiper.slideTo(lbIdx);
  }else{
    openLb(lbIdx);
  }
}
mitems.forEach(function(item){item.addEventListener('click',function(){lbVis=getVis();openLb(lbVis.indexOf(item));});});
document.getElementById('lbClose').addEventListener('click',closeLb);
document.getElementById('lbPrev').addEventListener('click',function(){lbNav(-1);});
document.getElementById('lbNext').addEventListener('click',function(){lbNav(1);});
lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
document.addEventListener('keydown',function(e){
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')closeLb();
  if(e.key==='ArrowLeft')lbNav(-1);
  if(e.key==='ArrowRight')lbNav(1);
});

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=btn.closest('.faq-item'),isOpen=item.classList.contains('open');
    btn.closest('.faq-grp').querySelectorAll('.faq-item.open').forEach(function(i){if(i!==item)i.classList.remove('open');});
    item.classList.toggle('open',!isOpen);
  });
});

/* ── FAQ CAT FILTER ── */
var fcbs=document.querySelectorAll('.fcb');
var fgrps=document.querySelectorAll('.faq-grp');
var fitems=document.querySelectorAll('.faq-item');
fcbs.forEach(function(btn){
  btn.addEventListener('click',function(){
    fcbs.forEach(function(b){b.classList.remove('active');});btn.classList.add('active');
    var cat=btn.dataset.cat;
    var si=document.getElementById('faqSearch');if(si)si.value='';
    var nr=document.getElementById('faqNr');if(nr)nr.classList.remove('show');
    fitems.forEach(function(i){
      i.style.display='';
      var qt=i.querySelector('.faq-qt'),ans=i.querySelector('.faq-ans');
      if(i._origQ)qt.innerHTML=i._origQ;
      if(i._origA)ans.innerHTML=i._origA;
    });
    fgrps.forEach(function(g){g.style.display=(cat==='all'||g.dataset.cat===cat)?'':'none';});
    document.querySelectorAll('.faq-tb').forEach(function(tb){tb.classList.toggle('active',cat==='all'||tb.dataset.target===g);});
  });
});

/* ── FAQ SEARCH ── */
var fsi=document.getElementById('faqSearch');
if(fsi){
  fsi.addEventListener('input',function(){
    var q=fsi.value.trim().toLowerCase(),nr=document.getElementById('faqNr'),any=false;
    if(!q){
      fitems.forEach(function(i){i.style.display='';var qt=i.querySelector('.faq-qt'),ans=i.querySelector('.faq-ans');if(i._origQ)qt.innerHTML=i._origQ;if(i._origA)ans.innerHTML=i._origA;});
      fgrps.forEach(function(g){g.style.display='';});
      if(nr)nr.classList.remove('show');return;
    }
    fitems.forEach(function(item){
      var qt=item.querySelector('.faq-qt'),ans=item.querySelector('.faq-ans');
      if(!item._origQ)item._origQ=qt.innerHTML;
      if(!item._origA)item._origA=ans.innerHTML;
      var m=item._origQ.toLowerCase().includes(q)||item._origA.toLowerCase().includes(q);
      item.style.display=m?'':'none';
      if(m){
        var re=new RegExp('('+fsi.value.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
        qt.innerHTML=item._origQ.replace(re,'<mark>$1</mark>');
        ans.innerHTML=item._origA.replace(re,'<mark>$1</mark>');
        any=true;
      }
    });
    fgrps.forEach(function(g){g.style.display=Array.from(g.querySelectorAll('.faq-item')).some(function(i){return i.style.display!=='none';})?'':'none';});
    if(nr)nr.classList.toggle('show',!any);
  });
}

/* ── FAQ TOC ── */
document.querySelectorAll('.faq-tb').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.faq-tb').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    var t=document.getElementById('group-'+btn.dataset.target);
    if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

/* ── CONTACT INTENT ── */
var ibs=document.querySelectorAll('#intentSel .ib');
var phs={join:"Tell us about yourself — what year, what branch, and what you're excited to build…",collab:"Tell us about the collaboration — what you're proposing and what you bring to the table…",event:"What's your question about? An upcoming event, registration, or something else?",project:"Describe your project idea — even if it's rough. We love half-baked ideas…",other:"Tell us what's on your mind — a question about joining, a hello, anything."};
ibs.forEach(function(btn){
  btn.addEventListener('click',function(){
    ibs.forEach(function(b){b.classList.remove('active');});btn.classList.add('active');
    var f=document.getElementById('intentF');if(f)f.value=btn.textContent;
    var msg=document.getElementById('msg');if(msg)msg.placeholder=phs[btn.dataset.intent]||phs.other;
  });
});

/* ── CHAR COUNTER ── */
var msgEl=document.getElementById('msg'),cc2=document.getElementById('cc2');
if(msgEl&&cc2){
  msgEl.addEventListener('input',function(){
    var l=msgEl.value.length;cc2.textContent=l+' / 600';
    cc2.classList.toggle('warn',l>480&&l<=600);cc2.classList.toggle('limit',l>=600);
  });
}

/* ── CONTACT FORM ── */
var cform=document.getElementById('cform'),fsuc=document.getElementById('fsuc');
if(cform){
  cform.addEventListener('submit',function(e){
    e.preventDefault();var ok=true;
    cform.querySelectorAll('[required]').forEach(function(f){
      if(!f.value.trim()){f.style.borderColor='rgba(255,100,100,0.5)';f.addEventListener('input',function(){f.style.borderColor='';},{once:true});ok=false;}
    });
    if(!ok)return;
    var sb=cform.querySelector('.bsend');sb.textContent='Sending…';sb.disabled=true;
    setTimeout(function(){cform.style.display='none';fsuc.classList.add('show');},800);
  });
}
var fres=document.getElementById('freset');
if(fres){
  fres.addEventListener('click',function(){
    if(cform){cform.reset();cform.style.display='';}
    if(cc2){cc2.textContent='0 / 600';cc2.className='cc2';}
    if(fsuc)fsuc.classList.remove('show');
    var sb=cform&&cform.querySelector('.bsend');
    if(sb){sb.disabled=false;sb.innerHTML='Send Message <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';}
  });
}

/* ── BACK TO TOP ── */
var btt=document.getElementById('btt');
if(btt)btt.addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});
