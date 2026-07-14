let current='v60',roast='medium',last=null,sec=0,int=null,coffees=[],currentCoffeeId=null;
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='home')render()}
function iconImg(key,name){return `<img src="${icons[key]}" alt="${name}">`}
function getConfig(key=current){
  const base=methods[key];let cfg={...base};
  if(base.variants){const vK=currentVariant[key]||base.defaultVariant;cfg={...base,...base.variants[vK],vK}}
  if(base.techniques){const tK=currentTechnique[key]||Object.keys(base.techniques)[0];const t={...base.techniques[tK]};delete t.label;cfg={...cfg,...t,tK}}
  return cfg
}
function updateSliderLabels(){
  const ext=document.getElementById('extSlider').value,str=document.getElementById('strSlider').value;
  const extMap={"-2":"Very Sour","-1":"Sour","0":"Sweet / Balanced","1":"Bitter","2":"Bitter / Ashy"};
  const strMap={"-2":"Very Weak","-1":"Weak","0":"Perfect","1":"Heavy","2":"Muddy / Heavy"};
  document.getElementById('extLabel').textContent=extMap[ext];document.getElementById('strLabel').textContent=strMap[str];
}
function calculate(){
  const base=methods[current],m=getConfig(),liquid=Number(amount.value||0),coffee=liquid/m.ratio;
  let water=liquid;
  if(current==='flair'||(current==='oxo'&&(m.vK==='rapid'||m.vK==='cold'))||(current==='sage'&&m.vK==='cold')) water=coffee*m.ratio;
  let beanOffset=0;
  if(currentCoffeeId){const b=coffees.find(x=>x.id===currentCoffeeId);if(b)beanOffset=b.grindOffset}
  const grind=Math.max(1,Math.min(11,Math.round((m.grind+(roast==='light'?-0.25:roast==='dark'?0.25:0)+beanOffset)*4)/4));
  last={m,liquid,coffee,water,grind};
  resIcon.innerHTML=iconImg(base.icon,base.name);resName.textContent=base.name;coffeeOut.textContent=coffee.toFixed(1)+' g';waterOut.textContent=water.toFixed(0)+' g';grindOut.textContent=grind.toFixed(2);
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
// [Phase 4 helpers remain: loadCoffees, renderBeanList, saveNewBean, etc.]
window.addEventListener('load',()=>{render();coffees=JSON.parse(localStorage.getItem('brew-coffees')||'[]')});
