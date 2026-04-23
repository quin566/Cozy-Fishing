(() => {
  const STORAGE_KEY = 'morning-koi-deluxe-v1';

  const species = [
    { id: 'sunlit-koi', name: 'Sunlit Koi', rarity: 'common', chance: 28, coins: 6, lore: 1, description: 'A warm orange koi that glides near the morning light.', asset: 'assets/fish/sunlit-koi.svg', colors: ['#ef915f', '#fff0da'] },
    { id: 'moss-carp', name: 'Moss Carp', rarity: 'common', chance: 22, coins: 5, lore: 1, description: 'A quiet pond fish with soft green tones like drifting moss.', asset: 'assets/fish/moss-carp.svg', colors: ['#75895a', '#d6e6b4'] },
    { id: 'silver-minnow', name: 'Silver Minnow', rarity: 'common', chance: 18, coins: 4, lore: 1, description: 'A small shimmer that flickers just under the surface.', asset: 'assets/fish/silver-minnow.svg', colors: ['#d0d8df', '#8ca6b4'] },
    { id: 'pearl-koi', name: 'Pearl Koi', rarity: 'uncommon', chance: 12, coins: 10, lore: 2, description: 'Creamy white scales with a soft gold glint.', asset: 'assets/fish/pearl-koi.svg', colors: ['#f4eee6', '#e1c4a1'] },
    { id: 'maple-koi', name: 'Maple Koi', rarity: 'uncommon', chance: 9, coins: 11, lore: 2, description: 'A richer koi with maple reds and dark edging.', asset: 'assets/fish/maple-koi.svg', colors: ['#db6a4c', '#5f3124'] },
    { id: 'moon-fin-koi', name: 'Moon-Fin Koi', rarity: 'rare', chance: 6, coins: 18, lore: 4, description: 'A cool-toned koi that prefers very still mornings.', asset: 'assets/fish/moon-fin-koi.svg', colors: ['#bfc6ff', '#6c7bcc'] },
    { id: 'golden-ayanagi', name: 'Golden Ayanagi', rarity: 'rare', chance: 4, coins: 24, lore: 5, description: 'Long golden fins that trail like silk in the water.', asset: 'assets/fish/golden-ayanagi.svg', colors: ['#f3cd72', '#fff3c2'] },
    { id: 'spirit-koi', name: 'Spirit Koi', rarity: 'epic', chance: 1, coins: 45, lore: 10, description: 'A pale koi that appears only when the pond is almost silent.', asset: 'assets/fish/spirit-koi.svg', colors: ['#e9f5ff', '#b9d7ef'] }
  ];

  const baits = [
    { id: 'rice-crumbs', name: 'Rice Crumbs', hint: '+ common fish', modifier: { common: 1.14 } },
    { id: 'petal-mix', name: 'Petal Mix', hint: '+ uncommon fish', modifier: { uncommon: 1.24 } },
    { id: 'glow-pellet', name: 'Glow Pellet', hint: '+ rare fish', modifier: { rare: 1.28, epic: 1.18 } },
    { id: 'plain-hook', name: 'Plain Hook', hint: 'balanced chance', modifier: {} }
  ];

  const gears = [
    { id: 'linen-line', name: 'Linen Line', hint: 'balanced and calm', biteBonus: 0, rareBonus: 0 },
    { id: 'bamboo-float', name: 'Bamboo Float', hint: 'steadier bites', biteBonus: 0.12, rareBonus: 0.04 },
    { id: 'moon-thread', name: 'Moon Thread', hint: 'stronger rare luck', biteBonus: 0.18, rareBonus: 0.12 }
  ];

  const rarityRank = { common: 1, uncommon: 2, rare: 3, epic: 4 };
  const rarityLabel = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', epic: 'Epic' };
  const weatherCycle = ['Still Water', 'Garden Hush', 'Light Breeze'];
  const timeCycle = ['Dawn Calm', 'Quiet Morning', 'Soft Drift'];
  const dayCycle = [
    { key: 'morning', label: 'Dawn Calm', weather: 'clear' },
    { key: 'noon', label: 'Quiet Morning', weather: 'breeze' },
    { key: 'evening', label: 'Soft Drift', weather: 'mist' },
    { key: 'night', label: 'Night Glass', weather: 'rain' }
  ];

  const sceneWrap = document.getElementById('sceneWrap');
  const sceneTap = document.getElementById('sceneTap');
  const fishLayer = document.getElementById('fishLayer');
  const rippleLayer = document.getElementById('rippleLayer');
  const sparkleLayer = document.getElementById('sparkleLayer');
  const skyOverlay = document.getElementById('skyOverlay');
  const weatherOverlay = document.getElementById('weatherOverlay');
  const catchBurst = document.getElementById('catchBurst');
  const bobberWrap = document.getElementById('bobberWrap');
  const fishingLine = document.getElementById('fishingLine');
  const bobberButton = document.getElementById('bobberButton');
  const biteAlert = document.getElementById('biteAlert');
  const lastCatchCard = document.getElementById('lastCatchCard');
  const lastCatchIcon = document.getElementById('lastCatchIcon');
  const lastCatchName = document.getElementById('lastCatchName');
  const scenePrompt = document.getElementById('scenePrompt');
  const timeMood = document.getElementById('timeMood');
  const weatherMood = document.getElementById('weatherMood');

  const coinsValue = document.getElementById('coinsValue');
  const loreValue = document.getElementById('loreValue');
  const castsValue = document.getElementById('castsValue');
  const catchesValue = document.getElementById('catchesValue');
  const rarestValue = document.getElementById('rarestValue');
  const streakValue = document.getElementById('streakValue');
  const speciesCount = document.getElementById('speciesCount');
  const journalList = document.getElementById('journalList');
  const collectionList = document.getElementById('collectionList');
  const baitGrid = document.getElementById('baitGrid');
  const gearGrid = document.getElementById('gearGrid');

  const castButton = document.getElementById('castButton');
  const reelButton = document.getElementById('reelButton');
  const soundToggle = document.getElementById('soundToggle');
  const zenToggle = document.getElementById('zenToggle');
  const flowState = document.getElementById('flowState');
  const flowHint = document.getElementById('flowHint');
  const biteMeter = document.getElementById('biteMeter');
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = {
    journal: document.getElementById('journalPanel'),
    tackle: document.getElementById('tacklePanel'),
    collection: document.getElementById('collectionPanel')
  };

  const defaultState = {
    coins: 0,
    lore: 0,
    casts: 0,
    catches: 0,
    bestStreak: 0,
    currentStreak: 0,
    rarestId: null,
    selectedBait: 'rice-crumbs',
    selectedGear: 'linen-line',
    discovered: {},
    journal: [],
    flow: 'ready',
    biteAt: 0,
    biteDeadline: 0,
    castStartedAt: 0,
    selectedSpot: null,
    soundOn: false,
    zenMode: false,
    activeCatch: null,
    lastCatch: null,
    lastInteractionAt: Date.now()
  };

  const state = Object.assign({}, defaultState, loadState());

  let audioCtx = null;
  let masterGain = null;
  let ambientTimer = null;
  let uiTimer = null;
  let biteTimeout = null;
  let failTimeout = null;
  let lastRippleAt = 0;
  let rippleInterval = null;
  let sparkleTimer = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function saveState() {
    try {
      const payload = {
        coins: state.coins,
        lore: state.lore,
        casts: state.casts,
        catches: state.catches,
        bestStreak: state.bestStreak,
        currentStreak: state.currentStreak,
        rarestId: state.rarestId,
        selectedBait: state.selectedBait,
        selectedGear: state.selectedGear,
        discovered: state.discovered,
        journal: state.journal.slice(0, 18),
        lastCatch: state.lastCatch
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // ignore storage failures
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function chanceOfRarity(speciesItem, bait, gear) {
    let weight = speciesItem.chance;
    if (speciesItem.rarity === 'common' && bait.modifier.common) weight *= bait.modifier.common;
    if (speciesItem.rarity === 'uncommon' && bait.modifier.uncommon) weight *= bait.modifier.uncommon;
    if (speciesItem.rarity === 'rare' && bait.modifier.rare) weight *= bait.modifier.rare;
    if (speciesItem.rarity === 'epic' && bait.modifier.epic) weight *= bait.modifier.epic;
    if ((speciesItem.rarity === 'rare' || speciesItem.rarity === 'epic') && gear.rareBonus) {
      weight *= (1 + gear.rareBonus);
    }
    return weight;
  }

  function selectedBait() {
    return baits.find(item => item.id === state.selectedBait) || baits[0];
  }

  function selectedGear() {
    return gears.find(item => item.id === state.selectedGear) || gears[0];
  }

  function getSpecies(id) {
    return species.find(item => item.id === id) || null;
  }

  function chooseSpecies() {
    const bait = selectedBait();
    const gear = selectedGear();
    const pool = species.map(item => ({ item, weight: chanceOfRarity(item, bait, gear) }));
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of pool) {
      roll -= entry.weight;
      if (roll <= 0) return entry.item;
    }
    return species[0];
  }

  function interact() {
    state.lastInteractionAt = Date.now();
  }

  function setPrompt(text) {
    scenePrompt.textContent = text;
  }

  function setFlow(flow, hint) {
    state.flow = flow;
    flowState.textContent = flow.charAt(0).toUpperCase() + flow.slice(1);
    if (hint) flowHint.textContent = hint;
  }

  function updateMoodText() {
    const idleFor = Date.now() - state.lastInteractionAt;
    if (idleFor > 18000) timeMood.textContent = timeCycle[2];
    else if (idleFor > 9000) timeMood.textContent = timeCycle[1];
    else timeMood.textContent = timeCycle[0];
  }

  function formatTime(date = new Date()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function pushJournal(title, text) {
    state.journal.unshift({ title, text, time: formatTime() });
    state.journal = state.journal.slice(0, 18);
  }

  function addRipple(x, y, type = 'normal') {
    const ripple = document.createElement('span');
    ripple.className = `ripple${type === 'gold' ? ' gold' : ''}`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    rippleLayer.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 1800);
  }


  function spawnSparkle() {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    const rect = sceneWrap.getBoundingClientRect();
    sparkle.style.left = `${clamp(Math.random() * rect.width, 24, rect.width - 24)}px`;
    sparkle.style.top = `${clamp(rect.height * (0.38 + Math.random() * 0.5), rect.height * 0.38, rect.height - 24)}px`;
    sparkleLayer.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 1500);
  }

  function updateFishDepthClasses() {
    const idleFor = Date.now() - state.lastInteractionAt;
    const fish = fishLayer.querySelectorAll('.fish-sprite');
    fish.forEach((node, index) => {
      node.classList.remove('idle-soft', 'idle-deep', 'blessed');
      if (idleFor > 12000) node.classList.add(index % 2 ? 'idle-deep' : 'idle-soft');
      if (idleFor < 2200 && index === 0) node.classList.add('blessed');
    });
  }

  function updateAtmosphere(now = Date.now()) {
    const cycleIndex = Math.floor(now / 12000) % dayCycle.length;
    const phase = dayCycle[cycleIndex];
    skyOverlay.className = `sky-overlay ${phase.key}`;
    weatherOverlay.className = `weather-overlay ${phase.weather}`;
    timeMood.textContent = phase.label;
    weatherMood.textContent = phase.weather === 'clear'
      ? 'Still Water'
      : phase.weather === 'breeze'
      ? 'Light Breeze'
      : phase.weather === 'mist'
      ? 'Garden Mist'
      : 'Soft Rain';
  }

  function triggerRareCelebration(catchItem) {
    if (!catchItem || (catchItem.rarity !== 'rare' && catchItem.rarity !== 'epic')) return;
    catchBurst.classList.remove('hidden');
    if (catchItem.rarity === 'epic') {
      setPrompt(`You found ${catchItem.name}. The whole pond seems to glow.`);
    }
    for (let i = 0; i < (catchItem.rarity === 'epic' ? 8 : 4); i += 1) {
      window.setTimeout(spawnSparkle, i * 90);
    }
    window.setTimeout(() => catchBurst.classList.add('hidden'), catchItem.rarity === 'epic' ? 1400 : 1000);
  }

  function createAmbientRipples() {
    if (Math.random() < 0.55) return;
    const rect = sceneWrap.getBoundingClientRect();
    const x = clamp(Math.random() * rect.width, 28, rect.width - 28);
    const y = clamp(rect.height * (0.42 + Math.random() * 0.5), rect.height * 0.42, rect.height - 24);
    addRipple(x, y, Math.random() > 0.84 ? 'gold' : 'normal');
    if (Math.random() > 0.72) spawnSparkle();
  }

  function layoutBobber(x, y) {
    const anchor = { x: sceneWrap.clientWidth * 0.86, y: sceneWrap.clientHeight * 0.12 };
    const dx = x - anchor.x;
    const dy = y - anchor.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    fishingLine.style.left = `${anchor.x}px`;
    fishingLine.style.top = `${anchor.y}px`;
    fishingLine.style.height = `${length}px`;
    fishingLine.style.transform = `rotate(${angle + 90}deg)`;

    bobberButton.style.left = `${x}px`;
    bobberButton.style.top = `${y}px`;
  }

  function startCast(normalizedX = 0.62) {
    interact();
    if (state.flow === 'waiting' || state.flow === 'bite') return;

    clearTimeout(biteTimeout);
    clearTimeout(failTimeout);

    state.casts += 1;
    state.castStartedAt = Date.now();
    const gear = selectedGear();

    const spotX = clamp(normalizedX * sceneWrap.clientWidth, 48, sceneWrap.clientWidth - 54);
    const spotY = sceneWrap.clientHeight * (0.48 + Math.random() * 0.32);
    state.selectedSpot = { x: spotX, y: spotY };
    state.activeCatch = null;
    state.biteAt = Date.now() + 1600 + Math.random() * 2200 - gear.biteBonus * 700;
    state.biteDeadline = 0;

    layoutBobber(spotX, spotY);
    bobberWrap.classList.remove('hidden');
    reelButton.disabled = true;
    biteMeter.style.width = '12%';
    setFlow('waiting', 'The float is drifting. Let the pond decide.');
    setPrompt('Your float is in the water. Watch for a soft bite.');
    addRipple(spotX, spotY + 10);
    addRipple(spotX + 6, spotY + 14);

    biteTimeout = window.setTimeout(triggerBite, Math.max(300, state.biteAt - Date.now()));
    saveState();
    renderStats();
  }

  function triggerBite() {
    if (state.flow !== 'waiting' || !state.selectedSpot) return;
    interact();
    state.flow = 'bite';
    state.activeCatch = chooseSpecies();
    state.biteDeadline = Date.now() + 2800;
    setFlow('bite', 'A fish is interested. Reel in gently now.');
    setPrompt('Bite! Tap Reel In or tap the bobber before the fish slips away.');
    reelButton.disabled = false;
    biteMeter.style.width = '100%';
    biteAlert.classList.remove('hidden');
    window.setTimeout(() => biteAlert.classList.add('hidden'), 900);
    addRipple(state.selectedSpot.x, state.selectedSpot.y + 10, state.activeCatch && (state.activeCatch.rarity === 'rare' || state.activeCatch.rarity === 'epic') ? 'gold' : 'normal');
    playTone(state.activeCatch?.rarity === 'epic' ? 720 : 640, 0.18, 'triangle', 0.03);

    clearTimeout(failTimeout);
    failTimeout = window.setTimeout(() => {
      if (state.flow === 'bite') missCatch();
    }, 2800);
  }

  function updateRarest(candidate) {
    if (!state.rarestId) {
      state.rarestId = candidate.id;
      return;
    }
    const current = getSpecies(state.rarestId);
    if (!current || rarityRank[candidate.rarity] > rarityRank[current.rarity]) {
      state.rarestId = candidate.id;
    }
  }

  function showLastCatch(item) {
    lastCatchCard.classList.remove('hidden');
    lastCatchName.textContent = item.name;
    lastCatchIcon.style.background = `linear-gradient(90deg, ${item.colors[0]}, ${item.colors[1]})`;
    window.clearTimeout(uiTimer);
    uiTimer = window.setTimeout(() => lastCatchCard.classList.add('hidden'), 5200);
  }

  function reelIn() {
    interact();
    if (state.flow !== 'bite' || !state.activeCatch) return;

    clearTimeout(failTimeout);
    const catchItem = state.activeCatch;
    state.catches += 1;
    state.currentStreak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
    state.coins += catchItem.coins;
    state.lore += catchItem.lore;
    state.discovered[catchItem.id] = true;
    state.lastCatch = catchItem.id;
    updateRarest(catchItem);

    pushJournal(`Caught ${catchItem.name}`, `${catchItem.description} +${catchItem.coins} coins and +${catchItem.lore} lore.`);

    if (catchItem.rarity === 'rare' || catchItem.rarity === 'epic') {
      setPrompt(`You caught a ${catchItem.name}. A beautiful rare find.`);
      setFlow('ready', `You landed a ${catchItem.name}.`);
    } else {
      setPrompt(`You caught a ${catchItem.name}. The pond seems pleased.`);
      setFlow('ready', `You landed a ${catchItem.name}.`);
    }

    addRipple(state.selectedSpot.x, state.selectedSpot.y + 8, catchItem.rarity === 'epic' || catchItem.rarity === 'rare' ? 'gold' : 'normal');
    addRipple(state.selectedSpot.x + 12, state.selectedSpot.y + 10);
    playTone(catchItem.rarity === 'epic' ? 760 : catchItem.rarity === 'rare' ? 660 : 540, 0.24, 'triangle', 0.03);

    state.activeCatch = null;
    state.selectedSpot = null;
    state.biteAt = 0;
    state.biteDeadline = 0;

    biteMeter.style.width = '0%';
    bobberWrap.classList.add('hidden');
    reelButton.disabled = true;
    showLastCatch(catchItem);
    triggerRareCelebration(catchItem);
    saveState();
    renderEverything();
  }

  function missCatch() {
    state.currentStreak = 0;
    state.activeCatch = null;
    state.selectedSpot = null;
    state.biteAt = 0;
    state.biteDeadline = 0;
    bobberWrap.classList.add('hidden');
    reelButton.disabled = true;
    biteMeter.style.width = '0%';
    setFlow('ready', 'The pond settles back down. Try again whenever you like.');
    setPrompt('The fish slipped away. That is okay. The pond is still here.');
    pushJournal('A quiet miss', 'A fish nibbled and drifted away. Nothing rushed.');
    saveState();
    renderEverything();
  }

  function renderStats() {
    coinsValue.textContent = String(state.coins);
    loreValue.textContent = String(state.lore);
    castsValue.textContent = String(state.casts);
    catchesValue.textContent = String(state.catches);
    const rarest = state.rarestId ? getSpecies(state.rarestId)?.name : 'None';
    rarestValue.textContent = rarest || 'None';
    streakValue.textContent = String(state.bestStreak);
    soundToggle.textContent = state.soundOn ? 'Sound On' : 'Sound Off';
    soundToggle.classList.toggle('active', state.soundOn);
    soundToggle.setAttribute('aria-pressed', String(state.soundOn));
    zenToggle.textContent = state.zenMode ? 'Exit Zen' : 'Zen Mode';
    zenToggle.classList.toggle('active', state.zenMode);
    zenToggle.setAttribute('aria-pressed', String(state.zenMode));
  }

  function renderJournal() {
    journalList.innerHTML = '';
    const entries = state.journal.length ? state.journal : [{ title: 'First light', text: 'Your journal will fill as you fish and relax by the pond.', time: 'now' }];
    entries.forEach(entry => {
      const article = document.createElement('article');
      article.className = 'journal-item';
      article.innerHTML = `
        <h4>${escapeHtml(entry.title)}</h4>
        <p>${escapeHtml(entry.text)}</p>
        <div class="journal-meta">${escapeHtml(entry.time)}</div>
      `;
      journalList.appendChild(article);
    });
  }

  function renderTackle() {
    baitGrid.innerHTML = '';
    baits.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chip-btn${state.selectedBait === item.id ? ' active' : ''}`;
      button.innerHTML = `${escapeHtml(item.name)}<small>${escapeHtml(item.hint)}</small>`;
      button.addEventListener('click', () => {
        interact();
        state.selectedBait = item.id;
        saveState();
        renderTackle();
      });
      baitGrid.appendChild(button);
    });

    gearGrid.innerHTML = '';
    gears.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chip-btn${state.selectedGear === item.id ? ' active' : ''}`;
      button.innerHTML = `${escapeHtml(item.name)}<small>${escapeHtml(item.hint)}</small>`;
      button.addEventListener('click', () => {
        interact();
        state.selectedGear = item.id;
        saveState();
        renderTackle();
      });
      gearGrid.appendChild(button);
    });
  }

  function renderCollection() {
    collectionList.innerHTML = '';
    let discoveredCount = 0;
    species.forEach(item => {
      const discovered = Boolean(state.discovered[item.id]);
      if (discovered) discoveredCount += 1;
      const row = document.createElement('article');
      row.className = 'collection-item';
      row.innerHTML = `
        <div class="collection-main">
          <img src="${item.asset}" alt="${escapeHtml(item.name)}" class="${discovered ? '' : 'locked'}" />
          <div>
            <h4>${escapeHtml(discovered ? item.name : 'Unknown Fish')}</h4>
            <p>${escapeHtml(discovered ? item.description : 'Keep fishing quietly to discover this species.')}</p>
          </div>
        </div>
        <span class="badge ${item.rarity === 'rare' || item.rarity === 'epic' ? item.rarity : ''}">${rarityLabel[item.rarity]}</span>
      `;
      collectionList.appendChild(row);
    });
    speciesCount.textContent = `${discoveredCount} / ${species.length}`;
  }

  function renderEverything() {
    renderStats();
    renderJournal();
    renderTackle();
    renderCollection();
    if (state.lastCatch) {
      const last = getSpecies(state.lastCatch);
      if (last) {
        lastCatchName.textContent = last.name;
        lastCatchIcon.style.background = `linear-gradient(90deg, ${last.colors[0]}, ${last.colors[1]})`;
      }
    }
  }

  function createFishDecor() {
    fishLayer.innerHTML = '';
    const decor = [
      { id: 'sunlit-koi', top: 46, left: -8, width: 52, speed: 'slow' },
      { id: 'golden-ayanagi', top: 58, left: -12, width: 58, speed: 'medium' },
      { id: 'silver-minnow', top: 73, left: -14, width: 42, speed: 'fast' },
      { id: 'maple-koi', top: 84, right: -10, width: 50, speed: 'slow', reverse: true },
      { id: 'spirit-koi', top: 66, right: -12, width: 46, speed: 'medium', reverse: true },
      { id: 'moss-carp', top: 89, left: -16, width: 54, speed: 'slow' },
    ];

    decor.forEach((item, index) => {
      const img = document.createElement('img');
      img.src = getSpecies(item.id).asset;
      img.alt = '';
      img.className = `fish-sprite ${item.speed}${item.reverse ? ' reverse' : ''}`;
      img.style.top = `${item.top}%`;
      if (item.left !== undefined) img.style.left = `${item.left}%`;
      if (item.right !== undefined) img.style.right = `${item.right}%`;
      img.style.width = `${item.width}px`;
      img.style.animationDelay = `${-index * 3.2}s`;
      fishLayer.appendChild(img);
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function switchTab(name) {
    tabButtons.forEach(button => {
      const active = button.dataset.tab === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    Object.entries(tabPanels).forEach(([key, panel]) => {
      const active = key === name;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  }

  function toggleZenMode() {
    interact();
    state.zenMode = !state.zenMode;
    document.body.classList.toggle('zen-mode', state.zenMode);
    saveState();
    renderStats();
  }

  function ensureAudio() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.03;
    masterGain.connect(audioCtx.destination);
  }

  function playTone(freq, duration, type = 'sine', volume = 0.02) {
    if (!state.soundOn) return;
    ensureAudio();
    if (!audioCtx || !masterGain) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(masterGain);
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  function startAmbientAudio() {
    if (!state.soundOn) return;
    ensureAudio();
    if (!audioCtx || !masterGain) return;
    clearInterval(ambientTimer);
    ambientTimer = window.setInterval(() => {
      if (!state.soundOn) return;
      playTone(220 + Math.random() * 40, 1.7, 'sine', 0.012);
      if (Math.random() > 0.45) {
        window.setTimeout(() => playTone(420 + Math.random() * 120, 0.18, 'triangle', 0.012), 260 + Math.random() * 280);
      }
      if (Math.random() > 0.65) {
        window.setTimeout(() => playTone(520 + Math.random() * 140, 0.12, 'sine', 0.008), 780 + Math.random() * 420);
      }
    }, 2600);
  }

  function toggleSound() {
    interact();
    state.soundOn = !state.soundOn;
    if (state.soundOn) {
      startAmbientAudio();
      playTone(262, 0.22, 'triangle', 0.025);
      window.setTimeout(() => playTone(392, 0.28, 'triangle', 0.018), 120);
    } else {
      clearInterval(ambientTimer);
    }
    saveState();
    renderStats();
  }

  function updateLoop() {
    const now = Date.now();
    updateMoodText();
    updateAtmosphere(now);
    updateFishDepthClasses();

    if (state.flow === 'waiting' && state.castStartedAt) {
      const total = Math.max(500, state.biteAt - state.castStartedAt);
      const elapsed = now - state.castStartedAt;
      biteMeter.style.width = `${clamp((elapsed / total) * 80 + 10, 10, 88)}%`;
    }

    if (state.flow === 'bite' && state.biteDeadline) {
      const remaining = state.biteDeadline - now;
      biteMeter.style.width = `${clamp((remaining / 2800) * 100, 0, 100)}%`;
    }

    if (now - lastRippleAt > 1100 && Math.random() > 0.55) {
      createAmbientRipples();
      lastRippleAt = now;
    }
    requestAnimationFrame(updateLoop);
  }

  function handleSceneTap(event) {
    const rect = sceneWrap.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    if (state.flow === 'bite') {
      reelIn();
      return;
    }
    startCast(x);
  }

  function attachEvents() {
    castButton.addEventListener('click', () => startCast());
    reelButton.addEventListener('click', reelIn);
    bobberButton.addEventListener('click', reelIn);
    soundToggle.addEventListener('click', toggleSound);
    zenToggle.addEventListener('click', toggleZenMode);
    sceneTap.addEventListener('click', handleSceneTap);
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        interact();
        switchTab(button.dataset.tab);
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) interact();
    });
  }

  function boot() {
    if (!state.journal.length) {
      pushJournal('First light', 'The koi pond is quiet, the cabin is warm, and the water is ready when you are.');
    }

    createFishDecor();
    attachEvents();
    document.body.classList.toggle('zen-mode', state.zenMode);
    setFlow(state.flow === 'bite' || state.flow === 'waiting' ? 'ready' : state.flow, 'Use a gentle pace. Nothing here should feel rushed.');
    state.flow = 'ready';
    state.activeCatch = null;
    state.selectedSpot = null;
    reelButton.disabled = true;
    bobberWrap.classList.add('hidden');
    setPrompt('Tap the pond or press Cast Line to drift your float into the water.');
    renderEverything();
    if (state.soundOn) startAmbientAudio();
    rippleInterval = window.setInterval(createAmbientRipples, 1800);
    sparkleTimer = window.setInterval(() => { if (Math.random() > 0.55) spawnSparkle(); }, 2600);
    switchTab('journal');
    saveState();
    requestAnimationFrame(updateLoop);
  }

  boot();
})();
