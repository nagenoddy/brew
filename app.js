let current='v60',roast='medium',last=null,sec=0,int=null;
let currentVariant={sage:'cone',oxo:'rapid'};

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function iconImg(key,name){
  return `<img src="${icons[key]}" alt="${name}">`;
}

function getConfig(key=current){
  const base=methods[key];
  if(!base.variants)return base;
  const variantKey=currentVariant[key]||base.defaultVariant;
  return {...base,...base.variants[variantKey],variantKey};
}

function render(){
  const box=document.getElementById('methods');
  box.innerHTML='';
  Object.entries(methods).forEach(([k,m])=>{
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

function choose(k){
  current=k;
  const m=methods[k];
  const c=getConfig(k);

  calcIcon.innerHTML=iconImg(m.icon,m.name);
  calcName.textContent=m.name;
  calcHint.textContent=c.hint || m.hint;
  amount.value=c.defaultAmount;

  renderVariants();
  renderPresets();
  show('calc');
}

function setVariant(key){
  currentVariant[current]=key;
  const m=methods[current];
  const c=getConfig();

  calcHint.textContent=c.hint || m.hint;
  amount.value=c.defaultAmount;

  renderVariants();
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
  return Math.max(1,Math.min(11,quarter(g+a)));
}

function quarterIndex(g){
  return Math.round((quarter(g)-Math.floor(quarter(g)))*4);
}

function renderQuarterDots(g){
  const wrap=document.getElementById('quarterDots');
  wrap.innerHTML='';
  let idx=quarterIndex(g);
  for(let i=0;i<4;i++){
    const d=document.createElement('span');
    d.className='qdot'+(i===idx?' on':'');
    wrap.appendChild(d);
  }
}

function renderScale(g){
  const scale=document.getElementById('opusScale');
  scale.innerHTML='<div class="rail"></div>';

  for(let i=1;i<=11;i++){
    const major=document.createElement('div');
    major.className='majorTick';
    major.style.left=((i-1)/10*100)+'%';
    scale.appendChild(major);

    const lab=document.createElement('div');
    lab.className='tickLabel';
    lab.style.left=((i-1)/10*100)+'%';
    lab.textContent=i;
    scale.appendChild(lab);

    if(i<11){
      for(let q=1;q<=3;q++){
        const mi=document.createElement('div');
        mi.className='minorTick';
        mi.style.left=(((i-1)+(q/4))/10*100)+'%';
        scale.appendChild(mi);
      }
    }
  }

  const d=document.createElement('div');
  d.className='dot';
  d.style.left=((g-1)/10*100)+'%';
  scale.appendChild(d);
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

  const grind=adjGrind(m.grind);
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

  ratioOut.textContent=`Ratio 1:${m.ratio}. ${m.roastAdjust ? roast+' roast adjustment applied where useful.' : 'Baseline held steady for this method.'}`;

  stepsOut.innerHTML=m.steps.map((s,i)=>`
    <div class="step">
      <b>${i+1}. ${s}</b>
      <span>${i===0?'Start here, then move down the list.':''}</span>
    </div>
  `).join('');

  localStorage.setItem('brewguide-last',JSON.stringify({current,roast,amount:amount.value,currentVariant,last}));
  show('result');
}

function saveFav(){
  localStorage.setItem('brewguide-favourite',JSON.stringify(last));
  alert('Saved on this phone.');
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

window.addEventListener('load',()=>{
  const saved=JSON.parse(localStorage.getItem('brewguide-last')||'null');
  if(saved){
    current=saved.current || current;
    roast=saved.roast || roast;
    currentVariant=saved.currentVariant || currentVariant;
    setRoast(roast);
  }
  render();
});

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}
