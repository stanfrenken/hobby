const STORAGE_KEY = 'fitnessLog.v1';
const SYNC_KEY = 'fitnessLog.sync.v1';

const dateInput = document.getElementById('dateInput');
const sessionNameInput = document.getElementById('sessionName');
const addExerciseBtn = document.getElementById('addExercise');
const addExerciseMiniBtn = document.getElementById('addExerciseMini');
const addExerciseEmptyBtn = document.getElementById('addExerciseEmpty');
const saveDayBtn = document.getElementById('saveDay');
const exerciseList = document.getElementById('exerciseList');
const emptyState = document.getElementById('emptyState');
const progressExercise = document.getElementById('progressExercise');
const progressChart = document.getElementById('progressChart');
const progressTable = document.getElementById('progressTable');
const exportBtn = document.getElementById('exportData');
const importInput = document.getElementById('importData');
const syncUrlInput = document.getElementById('syncUrl');
const syncSheetIdInput = document.getElementById('syncSheetId');
const syncTokenInput = document.getElementById('syncToken');
const syncAutoInput = document.getElementById('syncAuto');
const syncAutoPullInput = document.getElementById('syncAutoPull');
const syncNowBtn = document.getElementById('syncNow');
const syncAllBtn = document.getElementById('syncAll');
const syncPullBtn = document.getElementById('syncPull');
const syncTestBtn = document.getElementById('syncTest');
const syncStatus = document.getElementById('syncStatus');

const statExercises = document.getElementById('statExercises');
const statSets = document.getElementById('statSets');
const statVolume = document.getElementById('statVolume');
const statBest = document.getElementById('statBest');

const exerciseTemplate = document.getElementById('exerciseTemplate');
const setRowTemplate = document.getElementById('setRowTemplate');

const state = {
  date: '',
  sessionName: '',
  exercises: []
};

const syncState = {
  url: '',
  sheetId: '',
  token: '',
  auto: false,
  pullOnLoad: true,
  debounceId: null,
  dirty: false,
  lastLocalChange: 0,
  lastChangedDate: '',
  lastPull: 0,
  pullInFlight: false,
  pushInFlight: false,
  autoPullIntervalId: null
};

const AUTO_PULL_INTERVAL_MS = 10000;
const AUTO_PULL_MIN_GAP_MS = 8000;
const AUTO_PULL_DIRTY_GRACE_MS = 1500;

function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function cloneState() {
  return JSON.parse(JSON.stringify({
    sessionName: state.sessionName,
    exercises: state.exercises
  }));
}

function loadDay(date) {
  const all = loadAll();
  const day = all[date];
  state.date = date;
  state.sessionName = day?.sessionName || '';
  state.exercises = (day?.exercises || []).map(ex => ({
    id: ex.id || uid(),
    name: ex.name || '',
    notes: ex.notes || '',
    sets: (ex.sets || []).map(set => ({
      id: set.id || uid(),
      reps: set.reps ?? '',
      weight: set.weight ?? '',
      rpe: set.rpe ?? '',
      done: !!set.done
    }))
  }));

  sessionNameInput.value = state.sessionName;
}

function persist() {
  const all = loadAll();
  all[state.date] = cloneState();
  saveAll(all);
  refreshProgress();
  syncState.dirty = true;
  syncState.lastLocalChange = Date.now();
  syncState.lastChangedDate = state.date;
  scheduleAutoSync();
}

function addExercise() {
  state.exercises.push({
    id: uid(),
    name: '',
    notes: '',
    sets: [newSet()]
  });
  renderExercises();
  persist();
}

function newSet(seed) {
  return {
    id: uid(),
    reps: seed?.reps ?? '',
    weight: seed?.weight ?? '',
    rpe: seed?.rpe ?? '',
    done: false
  };
}

function renderExercises() {
  exerciseList.innerHTML = '';

  if (!state.exercises.length) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  state.exercises.forEach(exercise => {
    const card = exerciseTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = exercise.id;

    const nameInput = card.querySelector('.exercise-name');
    const notesInput = card.querySelector('.exercise-notes');
    nameInput.value = exercise.name;
    notesInput.value = exercise.notes;

    const setsBody = card.querySelector('.sets-body');
    exercise.sets.forEach((set, index) => {
      const row = setRowTemplate.content.firstElementChild.cloneNode(true);
      row.dataset.id = set.id;
      row.querySelector('.set-index').textContent = index + 1;
      row.querySelector('.set-reps').value = set.reps;
      row.querySelector('.set-weight').value = set.weight;
      row.querySelector('.set-rpe').value = set.rpe;
      row.querySelector('.set-done').checked = set.done;
      setsBody.appendChild(row);
    });

    exerciseList.appendChild(card);
    updateExerciseStats(exercise.id, card);
  });

  updateSummary();
}

function updateExerciseStats(exerciseId, cardEl) {
  const exercise = state.exercises.find(ex => ex.id === exerciseId);
  if (!exercise) return;

  const volume = exercise.sets.reduce((sum, set) => sum + setVolume(set), 0);
  const best = findBestSet(exercise.sets);

  const volumeEl = cardEl.querySelector('.volume');
  const bestEl = cardEl.querySelector('.best');
  volumeEl.textContent = formatNumber(volume);
  bestEl.textContent = best ? `${formatNumber(best.weight)} x ${best.reps}` : '-';
}

function updateSummary() {
  const totalExercises = state.exercises.length;
  const totalSets = state.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalVolume = state.exercises.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + setVolume(set), 0), 0);
  const bestSet = findBestSet(state.exercises.flatMap(ex => ex.sets));

  statExercises.textContent = totalExercises;
  statSets.textContent = totalSets;
  statVolume.textContent = formatNumber(totalVolume);
  statBest.textContent = bestSet ? `${formatNumber(bestSet.weight)} x ${bestSet.reps}` : '-';
}

function setVolume(set) {
  const reps = Number(set.reps) || 0;
  const weight = Number(set.weight) || 0;
  return reps * weight;
}

function findBestSet(sets) {
  let best = null;
  let bestVol = -1;
  sets.forEach(set => {
    const vol = setVolume(set);
    if (vol > bestVol) {
      bestVol = vol;
      best = set;
    }
  });
  return bestVol > 0 ? best : null;
}

function formatNumber(value) {
  return new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(value);
}

function handleInputChange(target) {
  const card = target.closest('.exercise-card');
  if (!card) return;
  const exId = card.dataset.id;
  const exercise = state.exercises.find(ex => ex.id === exId);
  if (!exercise) return;

  if (target.classList.contains('exercise-name')) {
    exercise.name = target.value;
  }
  if (target.classList.contains('exercise-notes')) {
    exercise.notes = target.value;
  }

  const setRow = target.closest('.set-row');
  if (setRow) {
    const setId = setRow.dataset.id;
    const set = exercise.sets.find(s => s.id === setId);
    if (!set) return;

    if (target.classList.contains('set-reps')) set.reps = target.value;
    if (target.classList.contains('set-weight')) set.weight = target.value;
    if (target.classList.contains('set-rpe')) set.rpe = target.value;
    if (target.classList.contains('set-done')) set.done = target.checked;
  }

  updateExerciseStats(exId, card);
  updateSummary();
  persist();
}

function addSet(exId, seed) {
  const exercise = state.exercises.find(ex => ex.id === exId);
  if (!exercise) return;
  exercise.sets.push(newSet(seed));
  renderExercises();
  persist();
}

function removeSet(exId, setId) {
  const exercise = state.exercises.find(ex => ex.id === exId);
  if (!exercise) return;
  exercise.sets = exercise.sets.filter(set => set.id !== setId);
  renderExercises();
  persist();
}

function removeExercise(exId) {
  state.exercises = state.exercises.filter(ex => ex.id !== exId);
  renderExercises();
  persist();
}

function refreshProgress() {
  const all = loadAll();
  all[state.date] = cloneState();

  const names = collectExerciseNames(all);
  const selected = progressExercise.value;
  progressExercise.innerHTML = '';

  if (!names.length) {
    const opt = document.createElement('option');
    opt.textContent = 'Nog geen data';
    opt.value = '';
    progressExercise.appendChild(opt);
    progressTable.innerHTML = '<p class="hint">Log een oefening om progress te zien.</p>';
    drawChart([]);
    return;
  }

  names.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    progressExercise.appendChild(opt);
  });

  const nextValue = names.includes(selected) ? selected : names[0];
  progressExercise.value = nextValue;
  renderProgressFor(nextValue, all);
}

function collectExerciseNames(all) {
  const names = new Set();
  Object.values(all).forEach(day => {
    (day.exercises || []).forEach(ex => {
      const name = (ex.name || '').trim();
      if (name) names.add(name);
    });
  });
  return Array.from(names).sort((a, b) => a.localeCompare(b, 'nl-NL'));
}

function renderProgressFor(name, all) {
  const points = [];
  const rows = [];

  Object.entries(all)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, day]) => {
      const matches = (day.exercises || []).filter(ex => (ex.name || '').trim() === name);
      if (!matches.length) return;

      const sets = matches.flatMap(ex => ex.sets || []);
      const volume = sets.reduce((sum, set) => sum + setVolume(set), 0);
      const best = findBestSet(sets);

      points.push({ date, volume });
      rows.push({
        date,
        volume,
        best: best ? `${formatNumber(best.weight)} x ${best.reps}` : '-'
      });
    });

  drawChart(points);
  renderProgressTable(rows.slice(-6).reverse());
}

function renderProgressTable(rows) {
  if (!rows.length) {
    progressTable.innerHTML = '<p class="hint">Nog geen sessies voor deze oefening.</p>';
    return;
  }

  progressTable.innerHTML = '';
  rows.forEach(row => {
    const el = document.createElement('div');
    el.className = 'progress-row';
    el.innerHTML = `<span>${row.date}</span><span>${formatNumber(row.volume)} - ${row.best}</span>`;
    progressTable.appendChild(el);
  });
}

function drawChart(points) {
  const ctx = progressChart.getContext('2d');
  const w = progressChart.width;
  const h = progressChart.height;
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  if (!points.length) {
    ctx.fillStyle = '#6a5e54';
    ctx.font = '14px Space Grotesk';
    ctx.fillText('Geen data', 14, h / 2);
    return;
  }

  const padding = 24;
  const maxValue = Math.max(...points.map(p => p.volume), 10);
  const minValue = 0;

  const xStep = (w - padding * 2) / (points.length - 1 || 1);

  ctx.strokeStyle = 'rgba(26,26,26,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.stroke();

  ctx.strokeStyle = '#c2552d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = padding + index * xStep;
    const y = h - padding - ((point.volume - minValue) / (maxValue - minValue)) * (h - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = '#0f6b66';
  points.forEach((point, index) => {
    const x = padding + index * xStep;
    const y = h - padding - ((point.volume - minValue) / (maxValue - minValue)) * (h - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function flashSaved() {
  const original = saveDayBtn.textContent;
  saveDayBtn.textContent = 'Opgeslagen';
  setTimeout(() => {
    saveDayBtn.textContent = original;
  }, 800);
}

function exportData() {
  const all = loadAll();
  all[state.date] = cloneState();
  const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `fitness-log-${todayISO()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      saveAll(data);
      loadDay(state.date);
      renderExercises();
      refreshProgress();
    } catch {
      alert('Kon JSON niet lezen.');
    }
  };
  reader.readAsText(file);
}

function loadSyncConfig() {
  const raw = localStorage.getItem(SYNC_KEY);
  if (raw) {
    try {
      const data = JSON.parse(raw);
      syncState.url = normalizeScriptUrl(data.url || '');
      syncState.sheetId = data.sheetId || '';
      syncState.token = data.token || '';
      syncState.auto = !!data.auto;
      syncState.pullOnLoad = data.pullOnLoad !== undefined ? !!data.pullOnLoad : true;
    } catch {
      // ignore invalid data
    }
  }

  syncState.pullOnLoad = true;
  syncUrlInput.value = syncState.url;
  syncSheetIdInput.value = syncState.sheetId;
  syncTokenInput.value = syncState.token;
  syncAutoInput.checked = syncState.auto;
  syncAutoPullInput.checked = true;
  syncAutoPullInput.disabled = true;
  updateSyncStatus(hasSyncConfig() ? 'Gereed om te syncen.' : 'Nog niet verbonden.');
}

function normalizeScriptUrl(url) {
  if (!url) return '';
  return url.replace(/\/dev\s*$/i, '/exec');
}

function saveSyncConfig() {
  syncState.url = normalizeScriptUrl(syncUrlInput.value.trim());
  syncState.sheetId = syncSheetIdInput.value.trim();
  syncState.token = syncTokenInput.value.trim();
  syncState.auto = syncAutoInput.checked;
  syncState.pullOnLoad = true;
  syncUrlInput.value = syncState.url;
  localStorage.setItem(SYNC_KEY, JSON.stringify({
    url: syncState.url,
    sheetId: syncState.sheetId,
    token: syncState.token,
    auto: syncState.auto,
    pullOnLoad: true
  }));
  updateSyncStatus(hasSyncConfig() ? 'Gereed om te syncen.' : 'Nog niet verbonden.');
}

function updateSyncStatus(message) {
  if (syncStatus) syncStatus.textContent = message;
}

function hasSyncConfig() {
  return !!(syncState.url && syncState.sheetId);
}

function buildRowsForDay(date, day) {
  const rowsSets = [];
  const totalExercises = day.exercises?.length || 0;
  let totalSets = 0;
  let totalVolume = 0;
  let best = null;
  let bestVolume = -1;

  (day.exercises || []).forEach(exercise => {
    const exerciseName = (exercise.name || '').trim() || 'Oefening';
    const notes = exercise.notes || '';

    (exercise.sets || []).forEach((set, index) => {
      const repsValue = Number(set.reps);
      const weightValue = Number(set.weight);
      const reps = Number.isFinite(repsValue) && set.reps !== '' ? repsValue : '';
      const weight = Number.isFinite(weightValue) && set.weight !== '' ? weightValue : '';
      const rpe = set.rpe ?? '';
      const done = set.done ? 'yes' : '';
      const volume = (Number(repsValue) || 0) * (Number(weightValue) || 0);

      totalSets += 1;
      totalVolume += volume;

      if (volume > bestVolume) {
        bestVolume = volume;
        best = { weight: weightValue || 0, reps: repsValue || 0 };
      }

      rowsSets.push([
        date,
        day.sessionName || '',
        exerciseName,
        index + 1,
        reps,
        weight,
        rpe,
        done,
        notes,
        volume
      ]);
    });
  });

  const bestStr = best && bestVolume > 0 ? `${formatNumber(best.weight)} x ${best.reps}` : '-';
  const rowsDays = [[
    date,
    day.sessionName || '',
    totalExercises,
    totalSets,
    totalVolume,
    bestStr
  ]];

  return { rowsDays, rowsSets };
}

function buildPayloadForAll(all) {
  return Object.entries(all)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, day]) => {
      const rows = buildRowsForDay(date, day);
      return {
        date,
        rowsDays: rows.rowsDays,
        rowsSets: rows.rowsSets
      };
    });
}

async function postSync(payload) {
  try {
    const response = await fetch(syncState.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
    if (!response.ok || data.ok === false) {
      throw new Error(data.error || 'Sync mislukt');
    }
    return { ok: true, data };
  } catch (error) {
    updateSyncStatus(`Fout: ${error.message}`);
    return { ok: false };
  }
}

async function syncDay(dateOverride, options = {}) {
  if (!hasSyncConfig()) {
    updateSyncStatus('Vul eerst URL en Sheet ID in.');
    return;
  }

  const all = loadAll();
  const targetDate = dateOverride || state.date;
  all[targetDate] = targetDate === state.date ? cloneState() : all[targetDate];
  const rows = buildRowsForDay(targetDate, all[targetDate] || { sessionName: '', exercises: [] });

  if (!options.silent) updateSyncStatus('Syncen...');
  syncState.pushInFlight = true;
  const result = await postSync({
    action: 'syncDay',
    sheetId: syncState.sheetId,
    token: syncState.token,
    date: targetDate,
    rowsDays: rows.rowsDays,
    rowsSets: rows.rowsSets
  });

  syncState.pushInFlight = false;
  if (result.ok) {
    syncState.dirty = false;
    if (!options.silent) updateSyncStatus(`Gesynct: ${targetDate}`);
  }
}

async function syncAll() {
  if (!hasSyncConfig()) {
    updateSyncStatus('Vul eerst URL en Sheet ID in.');
    return;
  }

  const all = loadAll();
  all[state.date] = cloneState();
  const days = buildPayloadForAll(all);

  updateSyncStatus('Alles syncen...');
  syncState.pushInFlight = true;
  const result = await postSync({
    action: 'syncAll',
    sheetId: syncState.sheetId,
    token: syncState.token,
    days
  });
  syncState.pushInFlight = false;
  if (result.ok) {
    syncState.dirty = false;
    updateSyncStatus('Alles gesynct.');
  }
}

async function testSync() {
  if (!hasSyncConfig()) {
    updateSyncStatus('Vul eerst URL en Sheet ID in.');
    return;
  }

  updateSyncStatus('Testen...');
  const result = await postSync({
    action: 'test',
    sheetId: syncState.sheetId,
    token: syncState.token
  });

  if (result.ok) updateSyncStatus('Verbinding OK.');
}

function scheduleAutoSync() {
  if (!syncState.auto) return;
  if (!hasSyncConfig()) return;
  if (syncState.pushInFlight) return;

  if (syncState.debounceId) clearTimeout(syncState.debounceId);
  syncState.debounceId = setTimeout(() => {
    const targetDate = syncState.lastChangedDate || state.date;
    syncDay(targetDate, { silent: true });
  }, 1200);
}

function parseMaybeNumber(value) {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  return Number.isFinite(num) ? num : value;
}

function normalizeDateValue(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function buildAllFromSheets(daysRows, setsRows) {
  const all = {};
  const exerciseIndex = {};

  (daysRows || []).forEach(row => {
    const date = normalizeDateValue(row[0]);
    if (!date) return;
    const sessionName = row[1] || '';
    all[date] = { sessionName, exercises: [] };
  });

  (setsRows || []).forEach(row => {
    const date = normalizeDateValue(row[0]);
    if (!date) return;
    const sessionName = row[1] || '';
    const exerciseName = (row[2] || '').trim() || 'Oefening';
    const setNumber = Number(row[3]) || 0;
    const reps = parseMaybeNumber(row[4]);
    const weight = parseMaybeNumber(row[5]);
    const rpe = parseMaybeNumber(row[6]);
    const doneRaw = row[7];
    const notes = row[8] || '';
    const done = doneRaw === true || doneRaw === 'yes' || doneRaw === 'true' || doneRaw === 1 || doneRaw === '1';

    if (!all[date]) {
      all[date] = { sessionName, exercises: [] };
    } else if (!all[date].sessionName && sessionName) {
      all[date].sessionName = sessionName;
    }

    if (!exerciseIndex[date]) exerciseIndex[date] = {};
    if (!exerciseIndex[date][exerciseName]) {
      exerciseIndex[date][exerciseName] = {
        exercise: { id: uid(), name: exerciseName, notes: '', sets: [] },
        sets: []
      };
    }

    const entry = exerciseIndex[date][exerciseName];
    if (!entry.exercise.notes && notes) entry.exercise.notes = notes;

    entry.sets.push({
      order: setNumber,
      set: { id: uid(), reps, weight, rpe, done }
    });
  });

  Object.keys(exerciseIndex).forEach(date => {
    const day = all[date] || { sessionName: '', exercises: [] };
    const exercises = Object.values(exerciseIndex[date]).map(entry => {
      const sets = entry.sets
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(item => item.set);
      return { ...entry.exercise, sets };
    });
    day.exercises = exercises;
    all[date] = day;
  });

  return all;
}

async function pullAllFromSheets(options = {}) {
  if (!hasSyncConfig()) {
    updateSyncStatus('Vul eerst URL en Sheet ID in.');
    return;
  }

  const silent = !!options.silent;
  const skipStatus = !!options.skipStatus;
  const confirmOverwrite = options.confirmOverwrite !== false;
  if (!silent && confirmOverwrite) {
    const proceed = confirm('Dit overschrijft je lokale data met de data uit Google Sheets. Doorgaan?');
    if (!proceed) return;
  }

  if (!skipStatus) updateSyncStatus('Ophalen...');
  syncState.pullInFlight = true;
  const result = await postSync({
    action: 'pullAll',
    sheetId: syncState.sheetId,
    token: syncState.token
  });

  syncState.pullInFlight = false;
  if (!result.ok) return;

  const all = buildAllFromSheets(result.data?.days || [], result.data?.sets || []);
  saveAll(all);
  syncState.dirty = false;
  loadDay(state.date);
  renderExercises();
  refreshProgress();
  syncState.lastPull = Date.now();
  if (!skipStatus) updateSyncStatus('Data opgehaald.');
}

async function maybeAutoPull(reason) {
  if (!syncState.pullOnLoad) return;
  if (!hasSyncConfig()) return;
  if (syncState.pullInFlight || syncState.pushInFlight) return;

  const now = Date.now();
  if (reason === 'interval' && now - syncState.lastPull < AUTO_PULL_MIN_GAP_MS) return;
  if (syncState.dirty && now - syncState.lastLocalChange < AUTO_PULL_DIRTY_GRACE_MS) return;

  if (syncState.dirty) {
    const targetDate = syncState.lastChangedDate || state.date;
    await syncDay(targetDate, { silent: true });
  }

  await pullAllFromSheets({ silent: true, confirmOverwrite: false, skipStatus: true });
}


addExerciseBtn.addEventListener('click', addExercise);
addExerciseMiniBtn.addEventListener('click', addExercise);
addExerciseEmptyBtn.addEventListener('click', addExercise);

saveDayBtn.addEventListener('click', () => {
  persist();
  flashSaved();
});

sessionNameInput.addEventListener('input', () => {
  state.sessionName = sessionNameInput.value;
  persist();
});

exerciseList.addEventListener('input', event => handleInputChange(event.target));
exerciseList.addEventListener('change', event => handleInputChange(event.target));

exerciseList.addEventListener('click', event => {
  const card = event.target.closest('.exercise-card');
  if (!card) return;
  const exId = card.dataset.id;

  if (event.target.classList.contains('add-set')) {
    addSet(exId);
  }

  if (event.target.classList.contains('duplicate-set')) {
    const exercise = state.exercises.find(ex => ex.id === exId);
    const last = exercise?.sets[exercise.sets.length - 1];
    if (last) addSet(exId, last);
  }

  if (event.target.classList.contains('remove-set')) {
    const row = event.target.closest('.set-row');
    if (row) removeSet(exId, row.dataset.id);
  }

  if (event.target.classList.contains('remove-exercise')) {
    removeExercise(exId);
  }
});

progressExercise.addEventListener('change', () => {
  const all = loadAll();
  all[state.date] = cloneState();
  renderProgressFor(progressExercise.value, all);
});

exportBtn.addEventListener('click', exportData);
importInput.addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (file) importData(file);
  event.target.value = '';
});

syncUrlInput.addEventListener('input', saveSyncConfig);
syncSheetIdInput.addEventListener('input', saveSyncConfig);
syncTokenInput.addEventListener('input', saveSyncConfig);
syncAutoInput.addEventListener('change', () => {
  saveSyncConfig();
  scheduleAutoSync();
});
syncAutoPullInput.addEventListener('change', () => {
  saveSyncConfig();
  maybeAutoPull('toggle');
});

syncNowBtn.addEventListener('click', () => {
  saveSyncConfig();
  syncDay();
});

syncAllBtn.addEventListener('click', () => {
  saveSyncConfig();
  syncAll();
});

syncPullBtn.addEventListener('click', () => {
  saveSyncConfig();
  pullAllFromSheets();
});

syncTestBtn.addEventListener('click', () => {
  saveSyncConfig();
  testSync();
});

dateInput.addEventListener('change', () => {
  persist();
  loadDay(dateInput.value);
  renderExercises();
  refreshProgress();
});

function init() {
  loadSyncConfig();
  const today = todayISO();
  dateInput.value = today;
  loadDay(today);
  renderExercises();
  refreshProgress();
  maybeAutoPull('init');
  if (!syncState.autoPullIntervalId) {
    syncState.autoPullIntervalId = setInterval(() => {
      maybeAutoPull('interval');
    }, AUTO_PULL_INTERVAL_MS);
  }
  window.addEventListener('focus', () => maybeAutoPull('focus'));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) maybeAutoPull('visibility');
  });
}

init();







