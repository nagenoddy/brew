let current='v60',roast='medium',last=null,sec=0,int=null;
let currentVariant={sage:'cone',oxo:'rapid'};
let currentTechnique={};

// Phase 4: Coffee Library State
let coffees = [];
let currentCoffeeId = null;

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='home') render();
}

function iconImg(key,name){
  return `<img src="${icons[key]}" alt="${name}">`;
}

function getConfig(key=current){
  const base=methods[key];
  let cfg={...base};
  if(base.variants){
    const variantKey=currentVariant[key]||base.defaultVariant;
    cfg={...base,...base.variants[variantKey],variantKey};
  }
  if(base.techniques){
    const techniqueKey=currentTechnique[key]||Object.keys(base.techniques)[0];
    const t={...base.techniques[techniqueKey]};
    delete t.label;
    cfg={...cfg,...t,techniqueKey};
  }
  return cfg;
}

function loadOwnedBrewers(){
  try{
    const val=localStorage.getItem('brew-owned');
    if(!val) return Object.keys(methods);
    const parsed=JSON.parse(val);
    return (Array.isArray(parsed) && parsed.length>0) ? parsed : Object.keys(methods);
  } catch(e){
    return Object.keys(methods);
  }
}

function render(){
  const box=document.getElementById('methods');
  box.innerHTML='';
  const owned=loadOwnedBrewers();
  
  Object.entries(methods).forEach(([k,m])=>{
    if(!owned.includes(k)) return;
    const c=getConfig(k);
    box.innerHTML+=`
      <button class="method" onclick="choose('${k}')">
        <span class="icon">${iconImg(m.icon,m.name)}</span>
        <span>
          <span class="name">${m.name}</span>
          <span class="meta">${c.defaultAmount}g · Opus ${formatGrind(c.grind)}</span>
        </span>
      </button>
    `;
  });
}

function openSettings(){
  const list=document.getElementById('settingsList');
  list.innerHTML='';
  const owned=loadOwnedBrewers();
  
  Object.entries(methods).forEach(([k,m])=>{
    const isChecked = owned.includes(k) ? 'checked' : '';
    list.innerHTML+=`
      <div class="settingsRow">
        <label for="chk-${k}">
          <span style="width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center">${iconImg(m.icon,m.name)}</span>
          ${m.name}
        </label>
        <input type="checkbox" id="chk-${k}" value="${k}" ${isChecked} onchange="saveSettings()">
      </div>
    `;
  });
  show('settings');
}

function saveSettings(){
  const checked = Array.from(document.querySelectorAll('#settingsList input[type="checkbox"]:checked')).map(el=>el.value);
  localStorage.setItem('brew-owned', JSON.stringify(checked));
}

function renderVariants(){
  const m=methods[current];
  const card=document.getElementById('variantCard');
  const buttons=document.getElementById('variantButtons');
  const label=document.getElementById('variantLabel');

  if(!m.variants){
    card.classList.remove('active');
    buttons.innerHTML='';
    return;
  }

  card.classList.add('active');
  label.textContent=m.variantLabel || 'Brew style';
  buttons.innerHTML='';

  Object.entries(m.variants).forEach(([key,v])=>{
    const b=document.createElement('button');
    b.textContent=v.label;
    b.className=(currentVariant[current]===key)?'on':'';
    b.onclick=()=>setVariant(key);
    buttons.appendChild(b);
  });
}

function renderTechniques(){
  const m=methods[current];
  const card=document.getElementById('techniqueCard');
  const buttons=document.getElementById('techniqueButtons');

  if(!m.techniques){
    card.classList.remove('active');
    buttons.innerHTML='';
    return;
  }

  card.classList.add('active');
  buttons.innerHTML='';
  const active=currentTechnique[current]||Object.keys(m.techniques)[0];
  Object.entries(m.techniques).forEach(([key,t])=>{
    const b=document.createElement('button');
    b.textContent=t.label;
    b.className=(active===key)?'on':'';
    b.onclick=()=>setTechnique(key);
    buttons.appendChild(b);
  });
}

function setTechnique(key){
  currentTechnique[current]=key;
  const c=getConfig();
  amount.value=c.defaultAmount;
  renderTechniques();
  renderPresets();
}

function renderPresets(){
  const c=getConfig();
  const row=document.getElementById('presetRow');
  row.innerHTML='';
  (c.presets||[]).forEach(p=>{
    const b=document.createElement('button');
    b.className='presetBtn'+(Number(amount.value)===p?' on':'');
    b.textContent=p+'g';
    b.onclick=()=>{
      amount.value=p;
      renderPresets();
    };
    row.appendChild(b);
  });
}

function renderCoffeeSelect() {
  const sel = document.getElementById('coffeeSelect');
  sel.innerHTML = '<option value="">Guest Bean / Unlogged</option>';
  
  const activeBags = coffees.filter(c => c.status === 'active');
  
  // Smart Sort: Light roasts rise to the top for Pour-Overs, Dark for Espresso/Moka
  const lightPref = ['v60','hoop','chemex','clever','zero'].includes(current);
  
  activeBags.sort((a, b) => {
    if (lightPref) {
      if (a.roastLevel === 'light' && b.roastLevel !== 'light') return -1;
      if (a.roastLevel !== 'light' && b.roastLevel === 'light') return 1;
    } else {
      if (a.roastLevel === 'dark' && b.roastLevel !== 'dark') return -1;
      if (a.roastLevel !== 'dark' && b.roastLevel === 'dark') return 1;
    }
    return 0;
  });

  activeBags.forEach(c => {
    const rLabel = c.roastLevel ? c.roastLevel.charAt(0).toUpperCase() + c.roastLevel.slice(1) : '';
    sel.innerHTML += `<option value="${c.id}">${c.roaster} ${c.name} (${rLabel})</option>`;
  });
  
  sel.value = currentCoffeeId || "";
}

function selectCoffee(id) {
  currentCoffeeId = id;
  if (id) {
    const b = coffees.find(x => x.id === id);
    if (b && b.roastLevel) {
      setRoast(b.roastLevel);
    }
  }
}

function choose(k){
  current=k;
  const m=methods[k];
  const c=getConfig(k);

  calcIcon.innerHTML=iconImg(m.icon,m.name);
  calcName.textContent=m.name;
  calcHint.textContent=c.hint || m.hint;
  amount.value=c.defaultAmount;

  renderVariants();
  renderTechniques();
  renderPresets();
  renderCoffeeSelect();
  show('calc');
}

function setVariant(key){
  currentVariant[current]=key;
  const m=methods[current];
  const c=getConfig();

  calcHint.textContent=c.hint || m.hint;
  amount.value=c.defaultAmount;

  renderVariants();
  renderTechniques();
  renderPresets();
}

function setRoast(r){
  roast=r;
  ['Light','Med','Dark'].forEach(x=>document.getElementById('r'+x).classList.remove('on'));
  document.getElementById('r'+(r==='light'?'Light':r==='dark'?'Dark':'Med')).classList.add('on');
}

function quarter(n){return Math.round(n*4)/4}
function formatGrind(g){return quarter(g).toFixed(2)}

function adjGrind(g){
  const m=getConfig();
  if(!m.roastAdjust)return quarter(g);
  let a=roast==='light'?-0.25:roast==='dark'?0.25:0;
  
  let beanOffset = 0;
  if (currentCoffeeId) {
    const b = coffees.find(x => x.id === currentCoffeeId);
    if (b && b.grindOffset) beanOffset = b.grindOffset;
  }
  
  return Math.max(1,Math.min(11,quarter(g+a+beanOffset)));
}

function grindForVolume(m, liquid){
  if(!m.grindCurve) return m.grind;
  const c=[...m.grindCurve].sort((a,b)=>a[0]-b[0]);
  let g;
  if(liquid<=c[0][0]) g=c[0][1];
  else if(liquid>=c[c.length-1][0]) g=c[c.length-1][1];
  else{
    for(let j=0;j<c.length-1;j++){
      const [x1,y1]=c[j],[x2,y2]=c[j+1];
      if(liquid>=x1&&liquid<=x2){ g=y1+(y2-y1)*(liquid-x1)/(x2-x1); break; }
    }
  }
  return Math.round(g*4)/4;
}

function quarterIndex(g){
  return Math.round((quarter(g)-Math.floor(quarter(g)))*4);
}

function dialMarkup(){
  const cx=170,cy=146,R=130;
  const pt=(v,r)=>{
    const a=(150+240*(v-1)/10)*Math.PI/180;
    return [cx+r*Math.cos(a), cy-r*Math.sin(a)];
  };
  const f=n=>n.toFixed(1);
  let s='';
  s+=`<text x="${cx}" y="42" text-anchor="middle" font-size="10" fill="#f7f3ec" fill-opacity=".55" style="text-transform:uppercase;letter-spacing:.14em">Fellow Opus \u00b7 main dial</text>`;
  s+=`<text id="grindType" x="${cx}" y="62" text-anchor="middle" font-size="10.5" font-weight="700" fill="#d7a86e" style="text-transform:uppercase;letter-spacing:.14em">\u2014</text>`;
  const [ax,ay]=pt(1,R),[bx,by]=pt(11,R);
  s+=`<path d="M ${f(ax)} ${f(ay)} A ${R} ${R} 0 1 0 ${f(bx)} ${f(by)}" fill="none" stroke="#f7f3ec" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>`;
  for(let i=1;i<=10;i++)for(let q=1;q<=3;q++){
    const v=i+q/4,[x1,y1]=pt(v,R+4),[x2,y2]=pt(v,R-4);
    s+=`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#f7f3ec" stroke-opacity=".42" stroke-width="1.4"/>`;
  }
  for(let i=1;i<=11;i++){
    const [x1,y1]=pt(i,R+7),[x2,y2]=pt(i,R-7),[lx,ly]=pt(i,R-24);
    s+=`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#f7f3ec" stroke-opacity=".72" stroke-width="2.4" stroke-linecap="round"/>`;
    s+=`<text x="${f(lx)}" y="${f(ly+4)}" text-anchor="middle" font-size="12" font-weight="600" fill="#f7f3ec" fill-opacity=".85">${i}</text>`;
  }
  s+=`<g id="dialNeedle">`;
  s+=`<line x1="${cx}" y1="${cy+18}" x2="${cx}" y2="${cy+R-34}" stroke="#d7a86e" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>`;
  s+=`<circle cx="${cx}" cy="${cy+R}" r="12" fill="#d7a86e" fill-opacity=".25"/>`;
  s+=`<circle cx="${cx}" cy="${cy+R}" r="7" fill="#d7a86e"/>`;
  s+=`</g>`;
  s+=`<text id="grindOut" x="${cx}" y="${cy-2}" text-anchor="middle" font-size="42" font-weight="800" fill="#f7f3ec">\u2014</text>`;
  for(let i=0;i<4;i++){
    s+=`<circle id="qd${i}" cx="${cx-27+i*18}" cy="${cy+22}" r="4" fill="#f7f3ec" fill-opacity=".28"/>`;
  }
  s+=`<text x="${cx}" y="${cy+46}" text-anchor="middle" font-size="10.5" fill="#f7f3ec" fill-opacity=".45">Micro <tspan id="microOut">0</tspan></text>`;
  return s;
}

function buildDial(){
  document.getElementById('opusDial').innerHTML=dialMarkup();
}

function renderScale(g){
  const rot=144-24*Math.max(1,Math.min(11,g));
  document.getElementById('dialNeedle').style.transform='rotate('+rot+'deg)';
}

function renderQuarterDots(g){
  const idx=quarterIndex(g);
  for(let i=0;i<4;i++){
    const d=document.getElementById('qd'+i);
    const on=i===idx;
    d.setAttribute('r',on?5:4);
    d.setAttribute('fill',on?'#d7a86e':'#f7f3ec');
    d.setAttribute('fill-opacity',on?'1':'.28');
  }
}

function calculate(){
  const base=methods[current];
  const m=getConfig();
  const liquid=Number(amount.value||0);
  const coffee=liquid/m.ratio;
  let water=liquid;

  if(current==='flair'){
    water=coffee*m.ratio;
  } else if(current==='oxo' && (m.variantKey==='rapid' || m.variantKey==='cold')){
    water=coffee*m.ratio;
  } else if(current==='sage' && m.variantKey==='cold'){
    water=coffee*m.ratio;
  }

  const grind=adjGrind(grindForVolume(m, liquid));
  last={m,liquid,coffee,water,grind};

  resIcon.innerHTML=iconImg(base.icon,base.name);
  resName.textContent=base.name;
  coffeeOut.textContent=coffee.toFixed(1)+' g';
  waterOut.textContent=water.toFixed(0)+' g';
  grindOut.textContent=formatGrind(grind);
  grindType.textContent=m.type;
  microOut.textContent='0';

  renderScale(grind);
  renderQuarterDots(grind);

  let appliedString = `Ratio 1:${m.ratio}.`;
  if (m.roastAdjust) appliedString += ` ${roast} roast applied.`;
  
  if (currentCoffeeId) {
    const b = coffees.find(x => x.id === currentCoffeeId);
    if (b && b.grindOffset !== 0) {
      appliedString += ` Bag offset (${b.grindOffset > 0 ? '+'+b.grindOffset : b.grindOffset}) applied.`;
    }
  }
  ratioOut.textContent = appliedString;

  stepsOut.innerHTML=m.steps.map((s,i)=>`
    <div class="step">
      <b>${i+1}. ${s}</b>
      <span>${i===0?'Start here, then move down the list.':''}</span>
    </div>
  `).join('');

  localStorage.setItem('brewguide-last',JSON.stringify({current,roast,amount:amount.value,currentVariant,currentTechnique,last,currentCoffeeId}));

  fbSelected=new Set();
  renderFeedback();
  renderCoach(grind, liquid);
  const logBtnEl=document.getElementById('logBtn');
  logBtnEl.textContent='Log this brew';
  logBtnEl.disabled=false;

  show('result');
}

function startTimer(){
  timerMethod.textContent=methods[current].name;
  show('timer');
}

function fmt(s){
  return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
}

function toggleTimer(){
  if(int){
    clearInterval(int);
    int=null;
    timerBtn.textContent='Start';
  }else{
    int=setInterval(()=>{
      sec++;
      clock.textContent=fmt(sec);
    },1000);
    timerBtn.textContent='Pause';
  }
}

function resetTimer(){
  clearInterval(int);
  int=null;
  sec=0;
  clock.textContent='00:00';
  timerBtn.textContent='Start';
}

/* ---------- coach ---------- */
let coachSuggested=null;

function getAgeWarning() {
  if (!currentCoffeeId) return '';
  const b = coffees.find(x => x.id === currentCoffeeId);
  if (b && b.roastDate) {
    const ageDays = (Date.now() - new Date(b.roastDate).getTime()) / 86400000;
    if (ageDays > 42) {
      return ' Note: This coffee is 6+ weeks off roast. Expect fading sweetness; bias +0.25 coarser if it tastes dry/woody.';
    }
  }
  return '';
}

function getCoachSuggestion(calcGrind, liquid){
  const vk=getConfig().variantKey||null;
  const tk=getConfig().techniqueKey||'classic';
  const logs=loadLog().filter(r=>r.brewer===current&&(r.variant||null)===vk&&(r.technique||'classic')===tk&&Array.isArray(r.feedback)&&r.feedback.length);
  
  const ageWarning = getAgeWarning();
  
  if(!logs.length) {
    if (ageWarning) {
      return {text: 'Age Check', reason: ageWarning.trim(), confidence: 'medium', suggested: null};
    }
    return null;
  }
  
  const lastB=logs[logs.length-1];
  const f=new Set(lastB.feedback);
  const faults=FEEDBACK.filter(x=>f.has(x)&&x!=='perfect');
  const dateStr=new Date(lastB.ts).toLocaleDateString(undefined,{day:'numeric',month:'short'});
  const ctx='Last brew ('+dateStr+', '+lastB.volume+'g)';

  if(f.has('perfect')){
    return {text:ctx+' was perfect at Opus '+formatGrind(lastB.grind)+'.',
            reason:'Change nothing \u2014 repeat the recipe exactly.' + ageWarning,confidence:'high',suggested:null};
  }

  const coarse=f.has('dry')||f.has('bitter')||f.has('muddy');
  const fine=f.has('sour');
  const weak=f.has('weak');

  if(coarse&&fine){
    return {text:ctx+' read both bitter and sour.',
            reason:'Mixed signals usually mean uneven extraction \u2014 check pour technique and bed level before changing grind.' + ageWarning,
            confidence:'low',suggested:null};
  }

  let delta=0,reason='',conf='high';
  if(coarse){
    delta=0.25;
    const muddyOnly=f.has('muddy')&&!f.has('bitter')&&!f.has('dry');
    reason=muddyOnly
      ?'Muddy cups usually mean excess fines \u2014 a coarser grind produces fewer.'
      :'Dry / bitter points to over-extraction \u2014 coarser slows it down.';
    if(muddyOnly)conf='medium';
  }else if(fine){
    delta=-0.25;
    reason=weak
      ?'Weak and sour together point to under-extraction \u2014 finer helps both.'
      :'Sour usually means under-extraction \u2014 finer speeds it up.';
  }else if(weak){
    return {text:ctx+' was weak but balanced.',
            reason:'That is a strength issue, not extraction \u2014 use about 10% more coffee at the same grind.' + ageWarning,
            confidence:'medium',suggested:null};
  }

  if(logs.length>=2){
    const prev=logs[logs.length-2];
    const pf=new Set(prev.feedback||[]);
    const sameDir=delta>0?(pf.has('dry')||pf.has('bitter')||pf.has('muddy')):pf.has('sour');
    if(sameDir&&prev.grind!==lastB.grind){
      delta*=2;
      reason+=' The same fault appeared twice despite an adjustment, so a bigger step is warranted.';
    }
  }

  let suggested=Math.max(1,Math.min(11,quarter(lastB.grind+delta)));
  if((delta>0&&calcGrind>=suggested)||(delta<0&&calcGrind<=suggested)) {
    if (ageWarning) return {text: 'Age Check', reason: ageWarning.trim(), confidence: 'medium', suggested: null};
    return null;
  }

  if(lastB.volume&&liquid&&Math.abs(lastB.volume-liquid)/lastB.volume>0.25){
    reason+=' Your last logged brew was a different batch size, so treat this as a starting point.';
    if(conf==='high')conf='medium';
  }

  return {text:ctx+' was '+faults.join(' and ')+' at Opus '+formatGrind(lastB.grind)+'.',
          reason:reason + ageWarning,confidence:conf,suggested:suggested};
}

function renderCoach(calcGrind, liquid){
  const card=document.getElementById('coachCard');
  const s=getCoachSuggestion(calcGrind, liquid);
  coachSuggested=s&&s.suggested?s.suggested:null;
  if(!s){card.style.display='none';return;}
  document.getElementById('coachText').textContent=s.text;
  document.getElementById('coachReason').textContent=s.reason
    +(s.suggested?' Try Opus '+formatGrind(s.suggested)+'.':'');
  document.getElementById('coachConf').textContent=s.confidence+' confidence';
  const btn=document.getElementById('coachApply');
  btn.style.display=s.suggested?'':'none';
  btn.textContent='Apply '+(s.suggested?formatGrind(s.suggested):'');
  btn.disabled=false;
  card.style.display='';
}

function applyCoach(){
  if(!coachSuggested||!last)return;
  last.grind=coachSuggested;
  grindOut.textContent=formatGrind(coachSuggested);
  renderScale(coachSuggested);
  renderQuarterDots(coachSuggested);
  const btn=document.getElementById('coachApply');
  btn.textContent='Applied \u2713';
  btn.disabled=true;
}

/* ---------- brew log ---------- */
const FEEDBACK=['sweet','dry','bitter','sour','weak','muddy','perfect'];
let fbSelected=new Set();

function loadLog(){
  try{const l=JSON.parse(localStorage.getItem('brew-log')||'[]');return Array.isArray(l)?l:[]}
  catch(e){return []}
}
function saveLogData(l){localStorage.setItem('brew-log',JSON.stringify(l))}

function renderFeedback(){
  const row=document.getElementById('fbRow');
  row.innerHTML='';
  FEEDBACK.forEach(f=>{
    const b=document.createElement('button');
    b.className='fbChip'+(fbSelected.has(f)?' on':'');
    b.textContent=f[0].toUpperCase()+f.slice(1);
    b.onclick=()=>{
      if(f==='perfect'){fbSelected.has(f)?fbSelected.delete(f):(fbSelected.clear(),fbSelected.add(f));}
      else{fbSelected.delete('perfect');fbSelected.has(f)?fbSelected.delete(f):fbSelected.add(f);}
      renderFeedback();
    };
    row.appendChild(b);
  });
}

function logBrew(){
  if(!last)return;
  const rec={
    id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),
    ts:new Date().toISOString(),
    brewer:current,
    variant:last.m.variantKey||null,
    technique:last.m.techniqueKey||null,
    volume:Math.round(last.liquid),
    coffee_g:Number(last.coffee.toFixed(1)),
    grind:last.grind,
    roast,
    coffeeId: currentCoffeeId || null,
    feedback:[...fbSelected],
    rating:null,
    note:null
  };
  const l=loadLog();
  l.push(rec);
  saveLogData(l);
  const btn=document.getElementById('logBtn');
  btn.textContent='Logged ✓';
  btn.disabled=true;
}

function brewLabel(rec){
  const m=methods[rec.brewer];
  if(!m)return rec.brewer;
  let name=m.name;
  if(rec.variant&&m.variants&&m.variants[rec.variant])name+=' · '+m.variants[rec.variant].label;
  if(rec.technique&&rec.technique!=='classic'&&m.techniques&&m.techniques[rec.technique])name+=' \u00b7 '+m.techniques[rec.technique].label;
  return name;
}

function openJournal(){
  const l=loadLog().slice().reverse();
  const list=document.getElementById('logList');
  document.getElementById('journalCount').textContent=
    l.length?l.length+' brew'+(l.length===1?'':'s')+' logged on this device.':'';
  if(!l.length){
    list.innerHTML='<div class="logEmpty">No brews logged yet.<br>Calculate a recipe, taste, then tap the descriptors.</div>';
  }else{
    list.innerHTML=l.slice(0,50).map(r=>`
      <div class="logItem">
        <div class="logHead">
          <b>${brewLabel(r)}</b>
          <span class="logDate">${new Date(r.ts).toLocaleDateString(undefined,{day:'numeric',month:'short'})}
            <button class="logDelete" onclick="deleteBrew('${r.id}')">×</button>
          </span>
        </div>
        <div class="logMeta">${r.volume}g · ${r.coffee_g}g coffee · Opus ${formatGrind(r.grind)} · ${r.roast}</div>
        ${r.feedback.length?'<div class="logChips">'+r.feedback.map(f=>'<span>'+f+'</span>').join('')+'</div>':''}
      </div>
    `).join('');
  }
  show('journal');
}

function deleteBrew(id){
  saveLogData(loadLog().filter(r=>r.id!==id));
  openJournal();
}

function exportLog(){
  const data=JSON.stringify(loadLog());
  const done=()=>alert('Backup copied. Paste it somewhere safe (Notes, email to yourself).');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(data).then(done).catch(()=>prompt('Copy this backup text:',data));
  }else{
    prompt('Copy this backup text:',data);
  }
}

function importLog(){
  const raw=prompt('Paste a backup here:');
  if(!raw)return;
  try{
    const incoming=JSON.parse(raw);
    if(!Array.isArray(incoming))throw 0;
    const cur=loadLog();
    const ids=new Set(cur.map(r=>r.id));
    let added=0;
    incoming.forEach(r=>{
      if(r&&r.id&&r.ts&&r.brewer&&!ids.has(r.id)){cur.push(r);ids.add(r.id);added++;}
    });
    cur.sort((a,b)=>a.ts<b.ts?-1:1);
    saveLogData(cur);
    alert(added+' brew'+(added===1?'':'s')+' imported.');
    openJournal();
  }catch(e){
    alert('That did not look like a valid backup. Nothing was changed.');
  }
}

/* ---------- Phase 4: Coffee Beans Library ---------- */
function loadCoffees(){
  try{const c=JSON.parse(localStorage.getItem('brew-coffees')||'[]');return Array.isArray(c)?c:[]}
  catch(e){return []}
}

function saveCoffeesData(c){
  localStorage.setItem('brew-coffees',JSON.stringify(c));
}

function showBeans() {
  coffees = loadCoffees();
  renderBeanList();
  show('beans');
}

function showAddBean() {
  document.getElementById('newRoaster').value = '';
  document.getElementById('newName').value = '';
  document.getElementById('newRoast').value = 'medium';
  document.getElementById('newProcess').value = '';
  document.getElementById('newDate').value = '';
  show('addBean');
}

function saveNewBean() {
  const roaster = document.getElementById('newRoaster').value.trim();
  const name = document.getElementById('newName').value.trim();
  const dateStr = document.getElementById('newDate').value;
  
  if(!roaster || !name) {
    alert("Roaster and Coffee Name are required.");
    return;
  }
  
  const newBean = {
    id: Date.now().toString(36)+Math.random().toString(36).slice(2,7),
    roaster: roaster,
    name: name,
    roastLevel: document.getElementById('newRoast').value,
    process: document.getElementById('newProcess').value,
    roastDate: dateStr || null,
    grindOffset: 0,
    status: 'active'
  };
  
  coffees.push(newBean);
  saveCoffeesData(coffees);
  showBeans();
}

function adjustOffset(id, delta) {
  const b = coffees.find(x => x.id === id);
  if(b) {
    b.grindOffset = quarter(b.grindOffset + delta);
    saveCoffeesData(coffees);
    renderBeanList();
  }
}

function toggleBeanStatus(id) {
  const b = coffees.find(x => x.id === id);
  if(b) {
    b.status = b.status === 'active' ? 'archived' : 'active';
    if(b.status === 'archived' && currentCoffeeId === id) {
      currentCoffeeId = null;
    }
    saveCoffeesData(coffees);
    renderBeanList();
  }
}

function renderBeanList() {
  const activeDiv = document.getElementById('activeBeanList');
  const archDiv = document.getElementById('archivedBeanList');
  
  activeDiv.innerHTML = '';
  archDiv.innerHTML = '';
  
  if (coffees.length === 0) {
    activeDiv.innerHTML = '<div class="logEmpty">No coffees tracked yet.<br>Tap above to add a bag.</div>';
  }
  
  coffees.forEach(b => {
    let rec = "";
    if (b.roastLevel === 'light') rec = "Best for: Pour-over (V60, Hoop)";
    if (b.roastLevel === 'dark') rec = "Best for: Espresso, Moka, Immersion";
    if (b.roastLevel === 'medium') rec = "Versatile: Excels in Clever or AeroPress";

    let dateStr = b.roastDate ? new Date(b.roastDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'No date';
    let procStr = b.process ? b.process.charAt(0).toUpperCase() + b.process.slice(1) + ' · ' : '';

    const html = `
      <div class="beanCard ${b.status === 'archived' ? 'archived' : ''}">
        <div class="beanHead">
          <div class="beanTitle">
            <span>${b.roaster}</span>
            ${b.name}
          </div>
        </div>
        <div class="logMeta" style="margin-bottom:12px;">${procStr}${b.roastLevel.charAt(0).toUpperCase() + b.roastLevel.slice(1)} · Roasted ${dateStr}</div>
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="logMeta" style="font-weight:700;">Grind Offset</div>
          <div class="offsetControl">
            <button onclick="adjustOffset('${b.id}', -0.25)">-</button>
            <span>${b.grindOffset > 0 ? '+'+b.grindOffset : b.grindOffset}</span>
            <button onclick="adjustOffset('${b.id}', 0.25)">+</button>
          </div>
        </div>
        
        <div class="beanRec">${rec}</div>
        
        <div class="beanActions">
          <button onclick="toggleBeanStatus('${b.id}')">${b.status === 'active' ? 'Archive Bag' : 'Unarchive'}</button>
        </div>
      </div>
    `;
    
    if (b.status === 'active') {
      activeDiv.innerHTML += html;
    } else {
      archDiv.innerHTML += html;
    }
  });
}


window.addEventListener('load',()=>{
  buildDial();
  coffees = loadCoffees();
  const saved=JSON.parse(localStorage.getItem('brewguide-last')||'null');
  if(saved){
    current=saved.current || current;
    roast=saved.roast || roast;
    currentVariant=saved.currentVariant || currentVariant;
    currentTechnique=saved.currentTechnique || currentTechnique;
    currentCoffeeId=saved.currentCoffeeId || null;
    setRoast(roast);
  }
  render();
});

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}
