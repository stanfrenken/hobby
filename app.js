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
const dayBadge = document.getElementById('dayBadge');
const dayExerciseSummary = document.getElementById('dayExerciseSummary');
const dayEmpty = document.getElementById('dayEmpty');
const primarySummary = document.getElementById('primarySummary');
const weekPrimaryChart = document.getElementById('weekPrimaryChart');
const weekSecondaryChart = document.getElementById('weekSecondaryChart');
const weekPrimaryReadout = document.getElementById('weekPrimaryReadout');
const weekSecondaryReadout = document.getElementById('weekSecondaryReadout');
const weekPrimaryLegend = document.getElementById('weekPrimaryLegend');
const weekSecondaryLegend = document.getElementById('weekSecondaryLegend');
const focusName = document.getElementById('focusName');
const focusExerciseSelect = document.getElementById('focusExerciseSelect');
const focusChart = document.getElementById('focusChart');
const focusMetrics = document.getElementById('focusMetrics');
const focusStartNow = document.getElementById('focusStartNow');
const focusTable = document.getElementById('focusTable');
const focusEmpty = document.getElementById('focusEmpty');
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
    const parsed = JSON.parse(raw);
    const normalized = normalizeAllData(parsed);
    const before = JSON.stringify(parsed);
    const after = JSON.stringify(normalized);
    if (before !== after) {
      saveAll(normalized);
    }
    return normalized;
  } catch {
    return {};
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function normalizeAllData(data) {
  if (!data || typeof data !== 'object') return {};
  const normalized = {};

  Object.entries(data).forEach(([rawDate, rawDay]) => {
    const date = normalizeDateValue(rawDate);
    if (!date) return;

    const day = rawDay && typeof rawDay === 'object' ? rawDay : {};
    const sourceExercises = Array.isArray(day.exercises) ? day.exercises : [];

    const mappedExercises = sourceExercises.map(ex => ({
      id: ex?.id || uid(),
      name: ex?.name || '',
      notes: ex?.notes || '',
      primaryGroup: ex?.primaryGroup || '',
      secondaryGroup: ex?.secondaryGroup || '',
      sets: Array.isArray(ex?.sets)
        ? ex.sets.map(set => ({
          id: set?.id || uid(),
          reps: set?.reps ?? '',
          weight: set?.weight ?? '',
          rpe: set?.rpe ?? '',
          done: !!set?.done
        }))
        : []
    }));

    if (!normalized[date]) {
      normalized[date] = { sessionName: day.sessionName || '', exercises: [] };
    }
    if (!normalized[date].sessionName && day.sessionName) {
      normalized[date].sessionName = day.sessionName;
    }
    normalized[date].exercises.push(...mappedExercises);
  });

  return normalized;
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
    primaryGroup: ex.primaryGroup || '',
    secondaryGroup: ex.secondaryGroup || '',
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
  const exercise = {
    id: uid(),
    name: '',
    notes: '',
    primaryGroup: '',
    secondaryGroup: '',
    sets: [newSet()]
  };
  state.exercises.push(exercise);
  activeExerciseId = exercise.id;
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

function populateMuscleSelect(select, options) {
  if (!select) return;
  if (select.options.length) return;
  options.forEach(option => {
    const el = document.createElement('option');
    el.value = option;
    el.textContent = option;
    select.appendChild(el);
  });
}

function renderExercises() {
  exerciseList.innerHTML = '';
  ensureActiveExercise();

  if (!state.exercises.length) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  state.exercises.forEach(exercise => {
    const card = exerciseTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = exercise.id;
    if (exercise.id === activeExerciseId) card.classList.add('active');

    const nameInput = card.querySelector('.exercise-name');
    const notesInput = card.querySelector('.exercise-notes');
    const primarySelect = card.querySelector('.exercise-primary');
    const secondarySelect = card.querySelector('.exercise-secondary');
    nameInput.value = exercise.name;
    notesInput.value = exercise.notes;
    populateMuscleSelect(primarySelect, MUSCLE_SELECT_OPTIONS);
    populateMuscleSelect(secondarySelect, SECONDARY_SELECT_OPTIONS);
    primarySelect.value = exercise.primaryGroup || 'Automatisch';
    secondarySelect.value = exercise.secondaryGroup || 'Geen';

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

  statExercises.textContent = totalExercises;
  statSets.textContent = totalSets;
  statVolume.textContent = formatNumber(totalVolume);
  if (dayBadge) dayBadge.textContent = formatLongDate(state.date);
  renderPrimarySummary();
  renderDayExerciseSummary();
}

function renderPrimarySummary() {
  if (!primarySummary) return;

  const totals = {};
  state.exercises.forEach(exercise => {
    const volume = (exercise.sets || []).reduce((sum, set) => sum + setVolume(set), 0);
    if (volume <= 0) return;
    const { primary } = resolveExerciseMuscles(exercise);
    totals[primary] = (totals[primary] || 0) + volume;
  });

  const rows = Object.entries(totals)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'nl-NL'));

  if (!rows.length) {
    primarySummary.innerHTML = '<div class="muscle-stat empty">Nog geen kg per primary muscle vandaag.</div>';
    return;
  }

  primarySummary.innerHTML = '';
  rows.forEach(([group, volume]) => {
    const card = document.createElement('div');
    card.className = 'muscle-stat';
    card.style.setProperty('--muscle-color', CATEGORY_COLORS[group] || '#b2bec3');
    card.innerHTML = `
      <span class="label">${group}</span>
      <span class="value">${formatNumber(volume)} kg</span>
      <span class="sub">Primary volume vandaag</span>
    `;
    primarySummary.appendChild(card);
  });
}

function formatSetTag(set) {
  const reps = Number(set.reps);
  const weight = Number(set.weight);
  const hasReps = Number.isFinite(reps) && set.reps !== '';
  const hasWeight = Number.isFinite(weight) && set.weight !== '';

  if (hasReps && hasWeight) return `${reps}x${formatNumber(weight)}`;
  if (hasReps) return `${reps} reps`;
  if (hasWeight) return `${formatNumber(weight)} kg`;
  return '-';
}

function formatSetsSummary(sets) {
  if (!sets || !sets.length) return '-';
  return sets
    .map((set, index) => `S${index + 1} ${formatSetTag(set)}`)
    .join(', ');
}

function renderDayExerciseSummary() {
  if (!dayExerciseSummary) return;

  dayExerciseSummary.innerHTML = '';
  if (!state.exercises.length) {
    if (dayEmpty) dayEmpty.style.display = 'block';
    return;
  }

  if (dayEmpty) dayEmpty.style.display = 'none';

  state.exercises.forEach(exercise => {
    const card = document.createElement('div');
    card.className = 'day-exercise';

    const name = (exercise.name || '').trim() || 'Oefening';
    const volume = exercise.sets.reduce((sum, set) => sum + setVolume(set), 0);

    const head = document.createElement('div');
    head.className = 'day-exercise-head';
    head.innerHTML = `<span class="day-exercise-name">${name}</span><span class="day-exercise-volume">${formatNumber(volume)}</span>`;

    const tags = document.createElement('div');
    tags.className = 'set-tags';

    if (!exercise.sets.length) {
      const tag = document.createElement('span');
      tag.className = 'tag muted';
      tag.textContent = 'Geen sets';
      tags.appendChild(tag);
    } else {
      exercise.sets.forEach((set, index) => {
        const tag = document.createElement('span');
        const label = formatSetTag(set);
        tag.className = set.done ? 'tag' : 'tag muted';
        tag.textContent = `S${index + 1} ${label}`;
        tags.appendChild(tag);
      });
    }

    card.appendChild(head);
    card.appendChild(tags);
    dayExerciseSummary.appendChild(card);
  });
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

function getNiceAxisMax(value, ticks = 4) {
  const safeValue = Math.max(Number(value) || 0, 10);
  const roughStep = safeValue / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;

  let niceStep = 1;
  if (normalized <= 1) niceStep = 1;
  else if (normalized <= 2) niceStep = 2;
  else if (normalized <= 2.5) niceStep = 2.5;
  else if (normalized <= 5) niceStep = 5;
  else niceStep = 10;

  return Math.ceil(safeValue / (niceStep * magnitude)) * niceStep * magnitude;
}

function parseDate(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const date = raw.includes('T') ? new Date(raw) : new Date(`${raw}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatShortDate(value) {
  const date = parseDate(value);
  if (!date) return value || '-';
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  }).format(date);
}

function formatTinyDate(value) {
  const date = parseDate(value);
  if (!date) return value || '-';
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'short',
    day: '2-digit'
  }).format(date);
}

function formatLongDate(value) {
  const date = parseDate(value);
  if (!date) return value || '-';
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
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
  if (target.classList.contains('exercise-primary')) {
    exercise.primaryGroup = target.value === 'Automatisch' ? '' : target.value;
    if (exercise.secondaryGroup && exercise.secondaryGroup === exercise.primaryGroup) {
      exercise.secondaryGroup = '';
      const secondaryEl = card.querySelector('.exercise-secondary');
      if (secondaryEl) secondaryEl.value = 'Geen';
    }
  }
  if (target.classList.contains('exercise-secondary')) {
    const next = target.value === 'Geen' ? '' : target.value;
    exercise.secondaryGroup = next === exercise.primaryGroup ? '' : next;
    if (exercise.secondaryGroup === '') target.value = 'Geen';
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
  const removedActive = exId === activeExerciseId;
  state.exercises = state.exercises.filter(ex => ex.id !== exId);
  if (removedActive) {
    activeExerciseId = state.exercises[0]?.id || null;
  }
  renderExercises();
  persist();
}

function refreshProgress() {
  const all = loadAll();
  all[state.date] = cloneState();

  renderWeekCharts(all);
  updateFocusExerciseSelector(all);
  renderExerciseFocus(all);
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

function formatMetricValue(point) {
  if (!point) return '-';
  const date = formatShortDate(point.date);
  const volume = formatNumber(point.volume);
  const best = point.best || '-';
  return `${date} • Vol ${volume} • ${best}`;
}


function getPointAtOrBefore(points, targetDate) {
  let candidate = null;
  points.forEach(point => {
    const date = parseDate(point.date);
    if (!date || date > targetDate) return;
    if (!candidate || date > parseDate(candidate.date)) {
      candidate = point;
    }
  });
  return candidate;
}

function buildMetrics(points) {
  const metrics = [
    { label: 'Start', value: '-' },
    { label: 'Vorige week', value: '-' },
    { label: 'Vorige sessie', value: '-' },
    { label: 'Laatste', value: '-' }
  ];

  if (!points.length) return metrics;

  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const lastDate = parseDate(last.date);
  const weekAgoTarget = lastDate ? new Date(lastDate.getTime() - 7 * 24 * 60 * 60 * 1000) : null;
  const weekAgo = weekAgoTarget ? getPointAtOrBefore(sorted, weekAgoTarget) : null;

  metrics[0].value = formatMetricValue(first);
  metrics[1].value = formatMetricValue(weekAgo);
  metrics[2].value = formatMetricValue(prev);
  metrics[3].value = formatMetricValue(last);
  return metrics;
}

function buildPRAnnotations(points) {
  if (!points.length) return [];
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  let allIndex = 0;
  let allMax = -1;
  sorted.forEach((point, idx) => {
    if (point.volume > allMax) {
      allMax = point.volume;
      allIndex = idx;
    }
  });

  const lastDate = parseDate(sorted[sorted.length - 1].date);
  const weekStart = lastDate ? new Date(lastDate.getTime() - 7 * 24 * 60 * 60 * 1000) : null;
  let weekIndex = allIndex;
  let weekMax = -1;
  if (weekStart) {
    sorted.forEach((point, idx) => {
      const date = parseDate(point.date);
      if (!date || date < weekStart) return;
      if (point.volume > weekMax) {
        weekMax = point.volume;
        weekIndex = idx;
      }
    });
  }

  const annotations = [];
  if (allIndex !== undefined) {
    annotations.push({ index: allIndex, label: 'PR', color: '#c2552d' });
  }
  if (weekIndex !== undefined && weekIndex !== allIndex) {
    annotations.push({ index: weekIndex, label: 'Week PR', color: '#0f6b66' });
  } else if (weekIndex === allIndex) {
    annotations[0].label = 'PR / Week PR';
  }

  return annotations;
}

function renderMetrics(container, metrics) {
  if (!container) return;
  container.innerHTML = '';
  metrics.forEach(metric => {
    const item = document.createElement('div');
    item.className = 'metric';
    item.innerHTML = `<span class="label">${metric.label}</span><span class="value">${metric.value}</span>`;
    container.appendChild(item);
  });
}

function renderStartNow(container, points, currentExercise) {
  if (!container) return;
  container.innerHTML = '';

  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const currentSets = currentExercise?.sets || [];
  const currentBest = findBestSet(currentSets);
  const currentBestStr = currentBest ? `${formatNumber(currentBest.weight)} x ${currentBest.reps}` : '-';
  const currentSetsLabel = formatSetsSummary(currentSets);

  const currentDate = state.date;
  const previousSessions = sorted.filter(point => point.date < currentDate);
  const last = previousSessions.length ? previousSessions[previousSessions.length - 1] : sorted[sorted.length - 1];

  const cards = [
    {
      label: 'Startgewicht',
      value: first ? first.best : '-',
      sub: first ? first.setsLabel : '-'
    },
    {
      label: 'Laatste keer',
      value: last ? last.best : '-',
      sub: last ? last.setsLabel : '-'
    },
    {
      label: 'Huidig',
      value: currentBestStr,
      sub: currentSetsLabel
    }
  ];

  cards.forEach(card => {
    const item = document.createElement('div');
    item.className = 'metric';
    item.innerHTML = `<span class="label">${card.label}</span><span class="value">${card.value}</span><span class="sub">${card.sub}</span>`;
    container.appendChild(item);
  });
}

const PRIMARY_GROUPS = [
  'Biceps',
  'Triceps',
  'Borst',
  'Schouders',
  'Kuiten',
  'Hamstrings',
  'Quads',
  'Upper back',
  'Traps',
  'Abs',
  'Overig'
];

const MUSCLE_SELECT_OPTIONS = ['Automatisch', ...PRIMARY_GROUPS];
const SECONDARY_SELECT_OPTIONS = ['Geen', ...PRIMARY_GROUPS];

const CATEGORY_COLORS = {
  Biceps: '#6c5ce7',
  Triceps: '#00b894',
  Borst: '#d63031',
  Schouders: '#e17055',
  Kuiten: '#0984e3',
  Hamstrings: '#2d3436',
  Quads: '#e84393',
  'Upper back': '#00cec9',
  Traps: '#fdcb6e',
  Abs: '#636e72',
  Overig: '#b2bec3'
};

function classifyExercise(name) {
  const n = (name || '').toLowerCase();

  if (/(shoulder|overhead|military|arnold|lateral|rear delt|delt)/.test(n)) {
    return { primary: 'Schouders', secondary: /press/.test(n) ? ['Triceps'] : [] };
  }
  if (/(bench|chest|incline|decline|fly|pec)/.test(n)) {
    return { primary: 'Borst', secondary: /press|bench/.test(n) ? ['Triceps'] : [] };
  }
  if (/(bicep|curl)/.test(n)) {
    return { primary: 'Biceps', secondary: [] };
  }
  if (/(tricep|pushdown|skull|extension)/.test(n)) {
    return { primary: 'Triceps', secondary: [] };
  }
  if (/(squat|leg press|lunge|leg extension|hack squat)/.test(n)) {
    return { primary: 'Quads', secondary: ['Hamstrings'] };
  }
  if (/(hamstring|leg curl|rdl|romanian|deadlift|good morning)/.test(n)) {
    return { primary: 'Hamstrings', secondary: ['Upper back'] };
  }
  if (/(calf)/.test(n)) {
    return { primary: 'Kuiten', secondary: [] };
  }
  if (/(row|pull|pulldown|lat|chin|pullup|pull-up)/.test(n)) {
    return { primary: 'Upper back', secondary: ['Biceps'] };
  }
  if (/(shrug|trap)/.test(n)) {
    return { primary: 'Traps', secondary: [] };
  }
  if (/(abs|core|crunch|plank|sit-up|leg raise)/.test(n)) {
    return { primary: 'Abs', secondary: [] };
  }

  return { primary: 'Overig', secondary: [] };
}

function sanitizeMuscleGroup(value) {
  return PRIMARY_GROUPS.includes(value) ? value : '';
}

function resolveExerciseMuscles(exercise) {
  const fallback = classifyExercise(exercise?.name || '');
  const primary = sanitizeMuscleGroup(exercise?.primaryGroup) || fallback.primary;
  const secondaryRaw = sanitizeMuscleGroup(exercise?.secondaryGroup) || fallback.secondary[0] || '';
  const secondary = secondaryRaw && secondaryRaw !== primary ? secondaryRaw : '';
  return { primary, secondary };
}

function getWeekDates(baseDate) {
  const base = parseDate(baseDate) || new Date();
  const dates = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function computeWeekTotals(all, dates) {
  const primaryTotals = {};
  const secondaryTotals = {};
  PRIMARY_GROUPS.forEach(group => {
    primaryTotals[group] = new Array(dates.length).fill(0);
    secondaryTotals[group] = new Array(dates.length).fill(0);
  });

  dates.forEach((date, index) => {
    const day = all[date];
    if (!day || !day.exercises) return;
    day.exercises.forEach(exercise => {
      const name = (exercise.name || '').trim();
      if (!name) return;
      const volume = (exercise.sets || []).reduce((sum, set) => sum + setVolume(set), 0);
      const { primary, secondary } = resolveExerciseMuscles(exercise);
      primaryTotals[primary][index] += volume;
      if (secondary && secondaryTotals[secondary]) {
        secondaryTotals[secondary][index] += volume;
      }
    });
  });

  return { primaryTotals, secondaryTotals };
}

function renderLegend(container, groups) {
  if (!container) return;
  container.innerHTML = '';
  groups.forEach(group => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `<span class="legend-swatch" style="background:${CATEGORY_COLORS[group] || '#b2bec3'}"></span>${group}`;
    container.appendChild(item);
  });
}

function getChartTooltip() {
  if (chartTooltip) return chartTooltip;
  chartTooltip = document.createElement('div');
  chartTooltip.className = 'chart-tooltip';
  document.body.appendChild(chartTooltip);
  return chartTooltip;
}

function hideChartTooltip() {
  const tooltip = getChartTooltip();
  tooltip.classList.remove('visible');
}

function showChartTooltip(content, x, y) {
  const tooltip = getChartTooltip();
  tooltip.innerHTML = content;
  tooltip.classList.add('visible');
  tooltip.style.left = `${x + 14}px`;
  tooltip.style.top = `${y + 14}px`;
}

function updateChartReadout(readoutEl, hit) {
  if (!readoutEl) return;
  if (!hit) {
    readoutEl.textContent = 'Beweeg over de chart voor details.';
    return;
  }
  readoutEl.textContent = `${formatShortDate(hit.date)} • ${hit.group}: ${formatNumber(hit.value)} kg • Dagtotaal: ${formatNumber(hit.total)} kg`;
}

function getCanvasHit(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = event.clientX ?? event.touches?.[0]?.clientX;
  const clientY = event.clientY ?? event.touches?.[0]?.clientY;
  if (clientX == null || clientY == null) return null;

  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  const hit = (canvas._stackedHitboxes || []).find(box =>
    x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height
  );

  return {
    hit,
    clientX,
    clientY
  };
}

function bindStackedChartHover(canvas, hitboxes, readoutEl) {
  if (!canvas) return;
  canvas._stackedHitboxes = hitboxes;
  canvas._stackedReadout = readoutEl || null;
  canvas.classList.toggle('chart-hover', hitboxes.length > 0);
  updateChartReadout(canvas._stackedReadout, null);

  if (canvas._hoverBound) return;
  canvas._hoverBound = true;

  const moveHandler = event => {
    const position = getCanvasHit(canvas, event);
    const hit = position?.hit || null;

    if (!hit) {
      hideChartTooltip();
      updateChartReadout(canvas._stackedReadout, null);
      return false;
    }

    updateChartReadout(canvas._stackedReadout, hit);
    showChartTooltip(
      `<span class="title">${formatShortDate(hit.date)} · ${hit.group}</span><span class="value">${formatNumber(hit.value)} kg</span><span class="title">Dagtotaal: ${formatNumber(hit.total)} kg</span>`,
      position.clientX,
      position.clientY
    );
    return true;
  };

  canvas.addEventListener('pointermove', moveHandler);
  canvas.addEventListener('mousemove', moveHandler);
  canvas.addEventListener('pointerdown', moveHandler);
  canvas.addEventListener('touchstart', moveHandler, { passive: true });
  canvas.addEventListener('touchmove', moveHandler, { passive: true });

  const leaveHandler = () => {
    hideChartTooltip();
    updateChartReadout(canvas._stackedReadout, null);
  };

  canvas.addEventListener('mouseleave', leaveHandler);
  canvas.addEventListener('pointerleave', leaveHandler);
  canvas.addEventListener('touchend', leaveHandler, { passive: true });
}

function drawStackedBarChart(canvas, dates, totals, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const paddingLeft = 64;
  const paddingRight = 14;
  const paddingTop = 14;
  const paddingBottom = 30;
  const groups = options.groups || PRIMARY_GROUPS;
  const hitboxes = [];

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  if (!groups.length || !dates.length) {
    ctx.fillStyle = '#6a5e54';
    ctx.font = '14px Space Grotesk';
    ctx.fillText('Geen data', 14, h / 2);
    bindStackedChartHover(canvas, [], options.readoutEl);
    return;
  }

  const totalsPerDay = dates.map((_, i) =>
    groups.reduce((sum, group) => sum + (totals[group]?.[i] || 0), 0)
  );
  const ticks = 4;
  const maxTotal = getNiceAxisMax(Math.max(...totalsPerDay, 0), ticks);
  const chartHeight = h - paddingTop - paddingBottom;
  const barGap = 8;
  const chartWidth = w - paddingLeft - paddingRight;
  const barWidth = (chartWidth - barGap * (dates.length - 1)) / dates.length;

  ctx.font = '11px Space Grotesk';
  ctx.textBaseline = 'middle';

  ctx.strokeStyle = 'rgba(26,26,26,0.16)';
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, h - paddingBottom);
  ctx.lineTo(w - paddingRight, h - paddingBottom);
  ctx.stroke();

  ctx.save();
  ctx.translate(18, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '700 12px Space Grotesk';
  ctx.textAlign = 'center';
  ctx.fillText('kg', 0, 0);
  ctx.restore();

  for (let i = 0; i <= ticks; i += 1) {
    const value = (maxTotal / ticks) * i;
    const y = h - paddingBottom - (value / maxTotal) * chartHeight;
    ctx.strokeStyle = 'rgba(26,26,26,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();

      ctx.fillStyle = '#1a1a1a';
      ctx.font = '600 11px Space Grotesk';
      ctx.textAlign = 'right';
      ctx.fillText(`${formatNumber(value)} kg`, paddingLeft - 6, y);
    }

  dates.forEach((date, index) => {
    let y = h - paddingBottom;
    const x = paddingLeft + index * (barWidth + barGap);
    groups.forEach(group => {
      const value = totals[group]?.[index] || 0;
      if (value <= 0) return;
      const height = (value / maxTotal) * chartHeight;
      ctx.fillStyle = CATEGORY_COLORS[group] || '#b2bec3';
      ctx.fillRect(x, y - height, barWidth, height);
        hitboxes.push({
          x,
          y: y - height,
          width: barWidth,
          height,
          group,
          value,
          total: totalsPerDay[index],
          date
        });
      y -= height;
    });

      ctx.fillStyle = '#6a5e54';
      ctx.font = '11px Space Grotesk';
      ctx.textAlign = 'center';
      ctx.fillText(formatTinyDate(date), x + barWidth / 2, h - 10);
    });

  bindStackedChartHover(canvas, hitboxes, options.readoutEl);
}

function renderWeekCharts(all) {
  const dates = getWeekDates(state.date);
  const { primaryTotals, secondaryTotals } = computeWeekTotals(all, dates);

  const primaryGroups = PRIMARY_GROUPS.filter(group => primaryTotals[group].some(value => value > 0));
  const secondaryGroups = PRIMARY_GROUPS.filter(group => secondaryTotals[group].some(value => value > 0));

  drawStackedBarChart(weekPrimaryChart, dates, primaryTotals, {
    groups: primaryGroups,
    readoutEl: weekPrimaryReadout
  });
  drawStackedBarChart(weekSecondaryChart, dates, secondaryTotals, {
    groups: secondaryGroups,
    readoutEl: weekSecondaryReadout
  });

  renderLegend(weekPrimaryLegend, primaryGroups);
  renderLegend(weekSecondaryLegend, secondaryGroups);
}

function updateFocusExerciseSelector(all) {
  if (!focusExerciseSelect) return;
  const names = collectExerciseNames(all);
  const activeName = (state.exercises.find(ex => ex.id === activeExerciseId)?.name || '').trim();
  const nextValue = names.includes(focusExerciseName)
    ? focusExerciseName
    : names.includes(activeName)
      ? activeName
      : names[0] || '';

  focusExerciseSelect.innerHTML = '';

  if (!names.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Nog geen oefeningen';
    focusExerciseSelect.appendChild(option);
    focusExerciseName = '';
    return;
  }

  names.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    focusExerciseSelect.appendChild(option);
  });

  focusExerciseName = nextValue;
  focusExerciseSelect.value = nextValue;
}

let activeExerciseId = null;
let focusExerciseName = '';
let chartTooltip = null;

function ensureActiveExercise() {
  if (!state.exercises.length) {
    activeExerciseId = null;
    return;
  }

  const exists = state.exercises.some(ex => ex.id === activeExerciseId);
  if (!exists) {
    activeExerciseId = state.exercises[0].id;
  }
}

function setActiveExercise(exerciseId) {
  if (!exerciseId || exerciseId === activeExerciseId) return;
  activeExerciseId = exerciseId;
  const activeExercise = state.exercises.find(ex => ex.id === exerciseId);
  if (activeExercise?.name?.trim()) {
    focusExerciseName = activeExercise.name.trim();
    if (focusExerciseSelect) focusExerciseSelect.value = focusExerciseName;
  }
  document.querySelectorAll('.exercise-card').forEach(card => {
    card.classList.toggle('active', card.dataset.id === exerciseId);
  });
  const all = loadAll();
  all[state.date] = cloneState();
  renderExerciseFocus(all);
}

function buildExerciseProgress(name, all) {
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
      const bestStr = best ? `${formatNumber(best.weight)} x ${best.reps}` : '-';
      const bestWeight = best ? Number(best.weight) || 0 : 0;
      const bestReps = best ? Number(best.reps) || 0 : 0;
      const setsLabel = formatSetsSummary(sets);

      points.push({ date, volume, best: bestStr, bestWeight, bestReps, setsLabel });
      rows.push({
        date,
        volume,
        best: bestStr,
        detail: `${formatNumber(volume)} - ${bestStr} • ${sets.length} sets`
      });
    });

  return { points, rows };
}

function renderExerciseFocus(all) {
  if (!focusChart || !focusTable || !focusMetrics) return;

  ensureActiveExercise();
  const selectedName = (focusExerciseName || '').trim();
  const active = state.exercises.find(ex => ex.id === activeExerciseId);

  if (!selectedName && !active) {
    if (focusName) focusName.textContent = '-';
    if (focusEmpty) focusEmpty.style.display = 'block';
    drawChart(focusChart, [], { lineColor: '#c2552d', dotColor: '#0f6b66', emptyLabel: 'Geen data' });
    renderMetrics(focusMetrics, buildMetrics([]));
    renderStartNow(focusStartNow, [], null);
    renderProgressTable([], focusTable, 'Geen oefeningen gelogd.');
    return;
  }

  const name = selectedName || (active?.name || '').trim();
  const currentExercise = state.exercises.find(ex => (ex.name || '').trim() === name) || active || null;
  if (!name) {
    if (focusName) focusName.textContent = 'Oefening';
    if (focusEmpty) {
      focusEmpty.textContent = 'Geef deze oefening een naam om progress te zien.';
      focusEmpty.style.display = 'block';
    }
    drawChart(focusChart, [], { lineColor: '#c2552d', dotColor: '#0f6b66', emptyLabel: 'Geen data' });
    renderMetrics(focusMetrics, buildMetrics([]));
    renderStartNow(focusStartNow, [], null);
    renderProgressTable([], focusTable, 'Nog geen sessies voor deze oefening.');
    return;
  }

  if (focusName) focusName.textContent = name;
  if (focusEmpty) focusEmpty.style.display = 'none';

  const { points, rows } = buildExerciseProgress(name, all);
  const annotations = buildPRAnnotations(points);

  drawChart(focusChart, points, {
    lineColor: '#c2552d',
    dotColor: '#0f6b66',
    emptyLabel: 'Geen data',
    annotations
  });
  renderMetrics(focusMetrics, buildMetrics(points));
  renderStartNow(focusStartNow, points, currentExercise);
  renderProgressTable(rows.slice(-6).reverse(), focusTable, 'Nog geen sessies voor deze oefening.');
}

function renderProgressTable(rows, container, emptyMessage) {
  if (!container) return;
  if (!rows.length) {
    container.innerHTML = `<p class="hint">${emptyMessage}</p>`;
    return;
  }

  container.innerHTML = '';
  rows.forEach(row => {
    const el = document.createElement('div');
    el.className = 'progress-row';
    const detail = row.detail || `${formatNumber(row.volume)} - ${row.best}`;
    el.innerHTML = `<span>${formatShortDate(row.date)}</span><span>${detail}</span>`;
    container.appendChild(el);
  });
}

function drawChart(canvas, points, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const lineColor = options.lineColor || '#c2552d';
  const dotColor = options.dotColor || '#0f6b66';
  const emptyLabel = options.emptyLabel || 'Geen data';
  const annotations = options.annotations || [];
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  if (!points.length) {
    ctx.fillStyle = '#6a5e54';
    ctx.font = '14px Space Grotesk';
    ctx.fillText(emptyLabel, 14, h / 2);
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

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = padding + index * xStep;
    const y = h - padding - ((point.volume - minValue) / (maxValue - minValue)) * (h - padding * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = dotColor;
  points.forEach((point, index) => {
    const x = padding + index * xStep;
    const y = h - padding - ((point.volume - minValue) / (maxValue - minValue)) * (h - padding * 2);
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  if (annotations.length) {
    ctx.font = '12px Space Grotesk';
    annotations.forEach(annotation => {
      const idx = annotation.index;
      if (idx < 0 || idx >= points.length) return;
      const point = points[idx];
      const x = padding + idx * xStep;
      const y = h - padding - ((point.volume - minValue) / (maxValue - minValue)) * (h - padding * 2);
      ctx.fillStyle = annotation.color || '#1a1a1a';
      ctx.fillText(annotation.label, x + 6, y - 8);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = annotation.color || '#1a1a1a';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }
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
    const { primary, secondary } = resolveExerciseMuscles(exercise);

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
        exercise.id || '',
        primary,
        secondary,
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
  const raw = String(value).trim();
  if (raw.includes('T')) {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  return raw;
}

function isLikelyExerciseId(value) {
  const raw = String(value || '').trim();
  if (!raw) return false;
  if (PRIMARY_GROUPS.includes(raw)) return false;
  if (!raw.includes('-')) return false;
  return /^[a-z0-9-]+$/i.test(raw);
}

function parseSetRow(rawRow) {
  const row = Array.isArray(rawRow) ? rawRow : [];

  const col3 = String(row[3] || '').trim();
  const col4 = String(row[4] || '').trim();
  const col5 = Number(row[5]);

  const looksLikeV13 = row.length >= 13 && isLikelyExerciseId(col3);
  const looksLikeV12 = row.length >= 12
    && (col3 === '' || PRIMARY_GROUPS.includes(col3))
    && (col4 === '' || PRIMARY_GROUPS.includes(col4))
    && Number.isFinite(col5);

  if (looksLikeV13) {
    return {
      exerciseId: col3,
      primary: sanitizeMuscleGroup(row[4]),
      secondary: sanitizeMuscleGroup(row[5]),
      setNumber: Number(row[6]) || 0,
      reps: parseMaybeNumber(row[7]),
      weight: parseMaybeNumber(row[8]),
      rpe: parseMaybeNumber(row[9]),
      doneRaw: row[10],
      notes: row[11] || ''
    };
  }

  if (looksLikeV12) {
    return {
      exerciseId: '',
      primary: sanitizeMuscleGroup(row[3]),
      secondary: sanitizeMuscleGroup(row[4]),
      setNumber: Number(row[5]) || 0,
      reps: parseMaybeNumber(row[6]),
      weight: parseMaybeNumber(row[7]),
      rpe: parseMaybeNumber(row[8]),
      doneRaw: row[9],
      notes: row[10] || ''
    };
  }

  return {
    exerciseId: '',
    primary: '',
    secondary: '',
    setNumber: Number(row[3]) || 0,
    reps: parseMaybeNumber(row[4]),
    weight: parseMaybeNumber(row[5]),
    rpe: parseMaybeNumber(row[6]),
    doneRaw: row[7],
    notes: row[8] || ''
  };
}

function buildAllFromSheets(daysRows, setsRows) {
  const all = {};
  const exerciseIndex = {};
  const fallbackOccurrence = {};

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
    const parsed = parseSetRow(row);
    const exerciseId = parsed.exerciseId;
    const primary = parsed.primary;
    const secondary = parsed.secondary;
    const setNumber = parsed.setNumber;
    const reps = parsed.reps;
    const weight = parsed.weight;
    const rpe = parsed.rpe;
    const doneRaw = parsed.doneRaw;
    const notes = parsed.notes;
    const done = doneRaw === true || doneRaw === 'yes' || doneRaw === 'true' || doneRaw === 1 || doneRaw === '1';

    if (!all[date]) {
      all[date] = { sessionName, exercises: [] };
    } else if (!all[date].sessionName && sessionName) {
      all[date].sessionName = sessionName;
    }

    if (!exerciseIndex[date]) exerciseIndex[date] = {};
    const fallbackKey = `${exerciseName}::${primary}::${secondary}`;
    let exerciseKey = exerciseId;
    if (!exerciseKey) {
      if (!fallbackOccurrence[date]) fallbackOccurrence[date] = {};
      const state = fallbackOccurrence[date][fallbackKey] || { block: 0, lastSet: 0 };
      if (state.lastSet > 0 && setNumber > 0 && setNumber <= state.lastSet) {
        state.block += 1;
      }
      state.lastSet = setNumber > 0 ? setNumber : state.lastSet;
      fallbackOccurrence[date][fallbackKey] = state;
      exerciseKey = `${fallbackKey}::${state.block}`;
    }
    if (!exerciseIndex[date][exerciseKey]) {
      exerciseIndex[date][exerciseKey] = {
        exercise: {
          id: exerciseId || uid(),
          name: exerciseName,
          notes: '',
          primaryGroup: primary,
          secondaryGroup: secondary,
          sets: []
        },
        sets: []
      };
    }

    const entry = exerciseIndex[date][exerciseKey];
    if (!entry.exercise.primaryGroup && primary) entry.exercise.primaryGroup = primary;
    if (!entry.exercise.secondaryGroup && secondary) entry.exercise.secondaryGroup = secondary;
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

function shouldProtectLocalDay() {
  const focusedInsideExercises = !!(document.activeElement && exerciseList.contains(document.activeElement));
  const recentlyEdited = Date.now() - syncState.lastLocalChange < 30000;
  return focusedInsideExercises || recentlyEdited || syncState.dirty;
}

function mergeCurrentLocalDayIntoAll(all) {
  if (!state.date || !shouldProtectLocalDay()) return all;

  const localDay = cloneState();
  all[state.date] = {
    sessionName: localDay.sessionName || '',
    exercises: localDay.exercises
  };

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

  const all = mergeCurrentLocalDayIntoAll(buildAllFromSheets(result.data?.days || [], result.data?.sets || []));
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
  if (document.activeElement && exerciseList.contains(document.activeElement)) return;

  const now = Date.now();
  if (reason === 'interval' && now - syncState.lastPull < AUTO_PULL_MIN_GAP_MS) return;
  if (syncState.dirty && now - syncState.lastLocalChange < AUTO_PULL_DIRTY_GRACE_MS) return;

  if (syncState.dirty) {
    const targetDate = syncState.lastChangedDate || state.date;
    await syncDay(targetDate, { silent: true });
    if (syncState.dirty) {
      return;
    }
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
  if (exId) setActiveExercise(exId);

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

focusExerciseSelect.addEventListener('change', () => {
  focusExerciseName = focusExerciseSelect.value;
  const matchingCurrent = state.exercises.find(ex => (ex.name || '').trim() === focusExerciseName);
  if (matchingCurrent) {
    activeExerciseId = matchingCurrent.id;
    document.querySelectorAll('.exercise-card').forEach(card => {
      card.classList.toggle('active', card.dataset.id === activeExerciseId);
    });
  }
  const all = loadAll();
  all[state.date] = cloneState();
  renderExerciseFocus(all);
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







