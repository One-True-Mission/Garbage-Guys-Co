// ---------- app.js ----------
// Background brightness slider (persisted)
const sliderSelector = '#brightness';
const BR_KEY = 'bg_brightness_pct';

function applyBrightness(pct){
  const value = Math.max(50, Math.min(115, Number(pct)||85));
  const normalized = (value/100).toFixed(2);
  document.documentElement.style.setProperty('--bg-brightness', normalized);
}

function initBrightness(){
  const saved = localStorage.getItem(BR_KEY);
  const slider = document.querySelector(sliderSelector);
  if(slider){
    if(saved){ slider.value = saved; applyBrightness(saved); }
    slider.addEventListener('input', (e)=>{
      const v = e.target.value;
      localStorage.setItem(BR_KEY, v);
      applyBrightness(v);
    });
  }else if(saved){
    applyBrightness(saved);
  }
}

// Off‑canvas menu
const menu = {
  wrap: document.getElementById('sidemenu'),
  btn: document.querySelector('.hamburger'),
  close: null,
  backdrop: document.querySelector('.backdrop'),
  open(){
    this.wrap.classList.add('open');
    this.wrap.setAttribute('aria-hidden','false');
    this.btn?.setAttribute('aria-expanded','true');
    this.backdrop.hidden = false;
  },
  hide(){
    this.wrap.classList.remove('open');
    this.wrap.setAttribute('aria-hidden','true');
    this.btn?.setAttribute('aria-expanded','false');
    this.backdrop.hidden = true;
  },
  init(){
    if(!this.wrap) return;
    this.close = this.wrap.querySelector('.close');
    this.btn?.addEventListener('click', ()=> this.open());
    this.close?.addEventListener('click', ()=> this.hide());
    this.backdrop?.addEventListener('click', ()=> this.hide());
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') this.hide();
    });
  }
};

// Utilities
function hashString(s){
  let h = 0; for(let i=0;i<s.length;i++){ h = (h<<5)-h + s.charCodeAt(i); h|=0; }
  return Math.abs(h);
}

function pickDailyIndex(total){
  const d = new Date();
  const key = `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  return hashString(key) % total;
}

function renderScripture(item){
  if(!item) return;
  document.getElementById('ref').textContent = item.ref;
  document.getElementById('verse').textContent = item.verse;
  document.getElementById('meaning').textContent = item.meaning;
}

async function loadData(){
  const res = await fetch('data/scriptures.json');
  const data = await res.json();
  return data.scriptures || [];
}

function normalized(s){ return (s||'').toLowerCase(); }

function searchItems(items, q){
  const qq = normalized(q);
  if(!qq) return null;
  const found = items.find(it =>
    normalized(it.ref).includes(qq) ||
    normalized(it.verse).includes(qq) ||
    normalized(it.meaning).includes(qq) ||
    (it.keywords||[]).some(k => normalized(k).includes(qq))
  );
  return found || null;
}

async function initScripture(){
  const items = await loadData();
  const total = items.length;

  // Default daily pick
  let current = items[pickDailyIndex(total)];
  renderScripture(current);

  // Search
  const form = document.getElementById('searchForm');
  const field = document.getElementById('q');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = field.value.trim();
    if(!q){ field.focus(); return; }
    const hit = searchItems(items, q);
    if(hit){ renderScripture(hit); }
    else{
      document.getElementById('ref').textContent = 'Coming soon';
      document.getElementById('verse').textContent = 'We don\\'t have that verse yet. Check back later!';
      document.getElementById('meaning').textContent = 'Tip: try a different reference (e.g., “John 3:16”) or a few keywords (e.g., “good shepherd hope”).';
    }
  });

  // Another (random)
  document.getElementById('another')?.addEventListener('click', (e)=>{
    e.preventDefault();
    let i = Math.floor(Math.random()*total);
    if(items[i] === current){ i = (i+1) % total; }
    current = items[i];
    renderScripture(current);
  });

  // Copy
  document.getElementById('copy')?.addEventListener('click', async ()=>{
    const text = `${current.ref}\\n${current.verse}\\n\\nWhat this means:\\n${current.meaning}`;
    try{
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard.');
    }catch{ alert('Copy failed.'); }
  });

  // Share (if supported)
  document.getElementById('share')?.addEventListener('click', async ()=>{
    const text = `${current.ref} — ${current.verse}`;
    if(navigator.share){
      try{ await navigator.share({ text }); } catch{ /* closed */ }
    }else{
      alert('Sharing not supported on this device.');
    }
  });
}

function initYear(){
  const el = document.getElementById('year');
  if(el) el.textContent = new Date().getFullYear();
}

// iOS momentum scroll hint for fixed bg (prevents raster banding)
(function(){
  const div = document.createElement('div');
  div.style.height = '1px'; document.body.appendChild(div);
  setTimeout(()=> div.remove(), 0);
})();

// Boot
window.addEventListener('DOMContentLoaded', ()=>{
  initBrightness();
  menu.init();
  initScripture();
  initYear();
});
