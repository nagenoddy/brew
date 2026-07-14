let current = 'v60';
let roast = 'medium';
let last = null;
let sec = 0;
let int = null;
let currentVariant = { sage: 'cone', oxo: 'rapid' };
let currentTechnique = {};

let coffees = [];
let currentCoffeeId = null;
let coachApplied = false;
let brewerOffsets = JSON.parse(localStorage.getItem('brewer-offsets') || '{}');

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'home') {
    render();
    runLearningEngine(); // Phase 5 check runs when returning to home
  }
}

function iconImg(key, name) {
  return `<img src="${icons[key]}" alt="${name}">`;
}

function getConfig(key = current) {
  const base = methods[key];
  let cfg = { ...base };
  if (base.variants) {
    const variantKey = currentVariant[key] || base.defaultVariant;
    cfg = { ...base, ...base.variants[variantKey], variantKey };
  }
  if (base.techniques) {
    const techniqueKey = currentTechnique[key] || Object.keys(base.techniques)[0];
    const t = { ...base.techniques[techniqueKey] };
    delete t.label;
    cfg = { ...cfg, ...t, techniqueKey };
  }
  return cfg;
}

function loadOwnedBrewers() {
  try {
    const val = localStorage.getItem('brew-owned');
    if (!val) return Object.keys(methods);
    const parsed = JSON.parse(val);
    return (Array.isArray(parsed) && parsed.length > 0) ? parsed : Object.keys(methods);
  } catch(e) {
    return Object.keys(methods);
  }
}

function render() {
  const box = document.getElementById('methods');
  box.innerHTML = '';
  const owned = loadOwnedBrewers();
  
  Object.entries(methods).forEach(([k, m]) => {
    if (!owned.includes(k)) return;
    const c = getConfig(k);
    const bOffset = brewerOffsets[k] || 0;
    const effectiveGrind = Math.max(1, Math.min(11, quarter(c.grind + bOffset)));
    
    box.innerHTML += `
      <button class="method" onclick="choose('${k}')">
        <span class="icon">${iconImg(m.icon, m.name)}</span>
        <span>
          <span class="name">${m.name}</span>
          <span class="meta">${c.defaultAmount}g · Opus ${formatGrind(effectiveGrind)}</span>
        </span>
      </button>
    `;
  });
}

function openSettings() {
  const list = document.getElementById('settingsList');
  list.innerHTML = '';
  const owned = loadOwnedBrewers();
  
  Object.entries(methods).forEach(([k, m]) => {
    const isChecked = owned.includes(k) ? 'checked' : '';
    list.innerHTML += `
      <div class="settingsRow">
        <label for="chk-${k}">
          <span style="width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center">${iconImg(m.icon, m.name)}</span>
          ${m.name}
        </label>
        <input type="checkbox" id="chk-${k}" value="${k}" ${isChecked} onchange="saveSettings()">
      </div>
    `;
  });
  show('settings');
}

function saveSettings() {
  const checked = Array.from(document.querySelectorAll('#settingsList input[type="checkbox"]:checked')).map(el => el.value);
  localStorage.setItem('brew-owned', JSON.stringify(checked));
}

function renderVariants() {
  const m = methods[current];
  const card = document.getElementById('variantCard');
  const buttons = document.getElementById('variantButtons');
  const label = document.getElementById('variantLabel');

  if (!m.variants) {
    card.classList.remove('active');
    buttons.innerHTML = '';
    return;
  }

  card.classList.add('active');
  label.textContent = m.variantLabel || 'Brew style';
  buttons.innerHTML = '';

  Object.entries(m.variants).forEach(([key, v]) => {
    const b = document.createElement('button');
    b.textContent = v.label;
    b.className = (currentVariant[current] === key) ? 'on' : '';
    b.onclick = () => setVariant(key);
    buttons.appendChild(b);
  });
}

function renderTechniques() {
  const m = methods[current];
  const card = document.getElementById('techniqueCard');
  const buttons = document.getElementById('techniqueButtons');

  if (!m.techniques) {
    card.classList.remove('active');
    buttons.innerHTML = '';
    return;
  }

  card.classList.add('active');
  buttons.innerHTML = '';
  const active = currentTechnique[current] || Object.keys(m.techniques)[0];
  Object.entries(m.techniques).forEach(([key, t]) => {
    const b = document.createElement('button');
    b.textContent = t.label;
    b.className = (active === key) ? 'on' : '';
    b.onclick = () => setTechnique(key);
    buttons.appendChild(b);
  });
}

function setTechnique(key) {
  currentTechnique[current] = key;
  const c = getConfig();
  document.getElementById('amount').value = c.defaultAmount;
  renderTechniques();
  renderPresets();
}

function renderPresets() {
  const c = getConfig();
  const row = document.getElementById('presetRow');
  const amountVal = Number(document.getElementById('amount').value);
  row.innerHTML = '';
  (c.presets || []).forEach(p => {
    const b = document.createElement('button');
    b.className = 'presetBtn' + (amountVal === p ? ' on' : '');
    b.textContent = p + 'g';
    b.onclick = () => {
      document.getElementById('amount').value = p;
      renderPresets();
    };
    row.appendChild(b);
  });
}

function renderCoffeeSelect() {
  const sel = document.getElementById('coffeeSelect');
  sel.innerHTML = '<option value="">Guest Bean / Unlogged</option>';
  
  const activeBags = coffees.filter(c => c.status === 'active');
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

function choose(k) {
  current = k;
  const m = methods[k];
  const c = getConfig(k);

  document.getElementById('calcIcon').innerHTML = iconImg(m.icon, m.name);
  document.getElementById('calcName').textContent = m.name;
  document.getElementById('calcHint').textContent = c.hint || m.hint;
  document.getElementById('amount').value = c.defaultAmount;

  renderVariants();
  renderTechniques();
  renderPresets();
  renderCoffeeSelect();
  show('calc');
}

function setVariant(key) {
  currentVariant[current] = key;
  const m = methods[current];
  const c = getConfig();

  document.getElementById('calcHint').textContent = c.hint || m.hint;
  document.getElementById('amount').value = c.defaultAmount;

  renderVariants();
  renderTechniques();
  renderPresets();
}

function setRoast(r) {
  roast = r;
  ['Light','Med','Dark'].forEach(x => document.getElementById('r'+x).classList.remove('on'));
  document.getElementById('r' + (r === 'light' ? 'Light' : r === 'dark' ? 'Dark' : 'Med')).classList.add('on');
}

function quarter(n) { return Math.round(n * 4) / 4; }
function formatGrind(g) { return quarter(g).toFixed(2); }

function adjGrind(g) {
  const m = getConfig();
  if (!m.roastAdjust) return quarter(g);
  let a = roast === 'light' ? -0.25 : roast === 'dark' ? 0.25 : 0;
  
  let beanOffset = 0;
  if (currentCoffeeId) {
    const b = coffees.find(x => x.id === currentCoffeeId);
    if (b && b.grindOffset) beanOffset = b.grindOffset;
  }
  
  const bOffset = brewerOffsets[current] || 0;
  
  return Math.max(1, Math.min(11, quarter(g + a + beanOffset + bOffset)));
}

function grindForVolume(m, liquid) {
  if (!m.grindCurve) return m.grind;
  const c = [...m.grindCurve].sort((a,b) => a[0] - b[0]);
  let g;
  if (liquid <= c[0][0]) g = c[0][1];
  else if (liquid >= c[c.length-1][0]) g = c[c.length-1][1];
  else {
    for(let j=0; j<c.length-1; j++) {
      const [x1, y1] = c[j], [x2, y2] = c[j+1];
      if (liquid >= x1 && liquid <= x2) { g = y1 + (y2 - y1) * (liquid - x1) / (x2 - x1); break; }
    }
  }
  return Math.round(g * 4) / 4;
}

function quarterIndex(g) {
  return Math.round((quarter(g) - Math.floor(quarter(g))) * 4);
}

function dialMarkup() {
  const cx = 170, cy = 146, R = 130;
  const pt = (v, r) => {
    const a = (150 + 240 * (v - 1) / 10) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  };
  const f = n => n.toFixed(1);
  let s = '';
  s += `<text x="${cx}" y="42" text-anchor="middle" font-size="10" fill="#f7f3ec" fill-opacity=".55" style="text-transform:uppercase;letter-spacing:.14em">Fellow Opus \u00b7 main dial</text>`;
  s += `<text id="grindType" x="${cx}" y="62" text-anchor="middle" font-size="10.5" font-weight="700" fill="#d7a86e" style="text-transform:uppercase;letter-spacing:.14em">\u2014</text>`;
  const [ax,ay] = pt(1,R), [bx,by] = pt(11,R);
  s += `<path d="M ${f(ax)} ${f(ay)} A ${R} ${R} 0 1 0 ${f(bx)} ${f(by)}" fill="none" stroke="#f7f3ec" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>`;
  for(let i=1; i<=10; i++) for(let q=1; q<=3; q++) {
    const v = i + q/4, [x1,y1] = pt(v,R+4), [x2,y2] = pt(v,R-4);
    s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#f7f3ec" stroke-opacity=".42" stroke-width="1.4"/>`;
  }
  for(let i=1; i<=11; i++) {
    const [x1,y1] = pt(i,R+7), [x2,y2] = pt(i,R-7), [lx,ly] = pt(i,R-24);
    s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#f7f3ec" stroke-opacity=".72" stroke-width="2.4" stroke-linecap="round"/>`;
