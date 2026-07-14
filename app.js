let current='v60',roast='medium',last=null,sec=0,int=null,coffees=[],currentCoffeeId=null;
let currentVariant={sage:'cone',oxo:'rapid'},currentTechnique={};

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='home') render();
}
function iconImg(key,name){return `<img src="${icons[key]}" alt="${name}">`}
function getConfig(key=current){
  const base=methods[key]; let cfg={...base};
  if(base.variants){const vK=currentVariant[key]||base.defaultVariant;cfg={...base,...base.variants[vK],vK}}
  if(base.techniques){const tK=currentTechnique[key]||Object.keys(base.techniques)[0];const t={...base.techniques[tK]};delete t.label;cfg={...cfg,...t,tK}}
  return cfg
}

function updateSliderLabels(){
  const ext=document.getElementById('extSlider').value,str=document.getElementById('strSlider').value;
  const extMap={"-2":"Very Sour","-1":"Sour","0":"Sweet / Balanced","1":"Bitter","2":"Bitter / Ashy"};
  const strMap={"-2":"Very Weak","-1":"Weak","0":"Perfect","1":"Heavy","2":"Muddy / Heavy"};
  document.getElementById('extLabel').textContent=extMap[ext];
  document.getElementById('strLabel').textContent=strMap[str];
}

function loadOwnedBrewers(){try{const v=localStorage.getItem('brew-owned');return v?JSON.parse(v):Object.keys(methods)}catch(e){return Object.keys(methods)}}

function render(){
  const box=document.getElementById('methods'); box.innerHTML='';
  const owned=loadOwnedBrewers();
  Object.entries(methods).forEach(([k,m])=>{
    if(!owned.includes(k)) return;
    const c=getConfig(k);
    box.innerHTML+=`<button class="method" onclick="choose('${k}')"><span class="icon">${iconImg(m.icon,m.name)}</span><span><span class="name">${m.name}</span><span class="meta">${c.defaultAmount}g</span></span></button>`;
  });
}

function renderCoffeeSelect() {
  const sel = document.getElementById('coffeeSelect');
  sel.innerHTML = '<option value="">Guest Bean / Unlogged</option>';
  coffees.filter(c => c.status === 'active').forEach(c => {
    sel.innerHTML += `<option value="${c.id}">${c.roaster} ${c.name}</option>`;
  });
  sel.value = currentCoffeeId || "";
}

function selectCoffee(id) { currentCoffeeId = id; if(id) { const b=coffees.find(x=>x.id===id); if(b) setRoast(b.roastLevel); } }

function calculate(){
  const base=methods[current], m=getConfig(), liquid=Number(amount.value||0);
  let beanOffset=0;
  if(currentCoffeeId){const b=coffees.find(x=>x.id===currentCoffeeId);if(b)beanOffset=b.grindOffset}
  const grind=Math.max(1,Math.min(11,Math.round((m.grind+(roast==='light'?-0.25:roast==='dark'?0.25:0)+beanOffset)*4)/4));
  last={m,liquid,grind};
  resIcon.innerHTML=iconImg(base.icon,base.name);resName.textContent=base.name;
  show('result');
}

function logBrew(){
  if(!last)return;
  const l=loadLog();
  l.push({id:Date.now().toString(36),ts:new Date().toISOString(),brewer:current,ext:parseInt(document.getElementById('extSlider').value),str:parseInt(document.getElementById('strSlider').value),coffeeId:currentCoffeeId});
  saveLogData(l);
  document.getElementById('logBtn').textContent='Logged ✓';
}

function loadLog(){try{return JSON.parse(localStorage.getItem('brew-log')||'[]')}catch(e){return []}}
function saveLogData(l){localStorage.setItem('brew-log',JSON.stringify(l))}
function loadCoffees(){try{return JSON.parse(localStorage.getItem('brew-coffees')||'[]')}catch(e){return []}}
function saveCoffeesData(c){localStorage.setItem('brew-coffees',JSON.stringify(c))}

function showBeans() { coffees=loadCoffees(); renderBeanList(); show('beans'); }
function showAddBean() { show('addBean'); }
function saveNewBean() {
  coffees.push({id:Date.now().toString(36),roaster:document.getElementById('newRoaster').value,name:document.getElementById('newName').value,roastLevel:document.getElementById('newRoast').value,roastDate:document.getElementById('newDate').value,grindOffset:0,status:'active'});
  saveCoffeesData(coffees); showBeans();
}
function renderBeanList() {
  const activeDiv = document.getElementById('activeBeanList'), archDiv = document.getElementById('archivedBeanList');
  activeDiv.innerHTML = ''; archDiv.innerHTML = '';
  coffees.forEach(b => {
    const html = `<div class="beanCard"><b>${b.roaster} ${b.name}</b><br><button onclick="toggleBeanStatus('${b.id}')">${b.status==='active'?'Archive':'Unarchive'}</button></div>`;
    if(b.status==='active') activeDiv.innerHTML += html; else archDiv.innerHTML += html;
  });
}
function toggleBeanStatus(id) { const b=coffees.find(x=>x.id===id); if(b) b.status=b.status==='active'?'archived':'active'; saveCoffeesData(coffees); renderBeanList(); }

window.addEventListener('load',()=>{ coffees=loadCoffees(); render(); });
