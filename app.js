const STORAGE_KEY = 'fitnessLog.v1';
const SYNC_KEY = 'fitnessLog.sync.v1';
const DB_CONFIG_KEY = 'fitnessLog.dbConfig.v1';
const EXERCISE_LIBRARY_KEY = 'fitnessLog.exerciseLibrary.v1';
const ROUTINES_KEY = 'fitnessLog.routines.v1';
const UI_PAGE_KEY = 'fitnessLog.uiPage.v1';
const ROUTINE_UI_KEY = 'fitnessLog.routineDay.v1';
const DASHBOARD_WEEK_KEY = 'fitnessLog.dashboardWeek.v1';

const dateInput = document.getElementById('dateInput');
const sessionNameInput = document.getElementById('sessionName');
const bodyweightInput = document.getElementById('bodyweightInput');
const routineSourceDaySelect = document.getElementById('routineSourceDay');
const pageLogBtn = document.getElementById('pageLogBtn');
const pageDashboardBtn = document.getElementById('pageDashboardBtn');
const pageRoutinesBtn = document.getElementById('pageRoutinesBtn');
const logPage = document.getElementById('logPage');
const dashboardPage = document.getElementById('dashboardPage');
const routinesPage = document.getElementById('routinesPage');
const addExerciseBtn = document.getElementById('addExercise');
const addRoutineToDayBtn = document.getElementById('addRoutineToDayBtn');
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
const dashboardWeekInput = document.getElementById('dashboardWeek');
const dashboardWeekNowBtn = document.getElementById('dashboardWeekNow');
const dashboardWeekLabel = document.getElementById('dashboardWeekLabel');
const focusName = document.getElementById('focusName');
const focusExerciseSelect = document.getElementById('focusExerciseSelect');
const focusChart = document.getElementById('focusChart');
const focusMetrics = document.getElementById('focusMetrics');
const focusStartNow = document.getElementById('focusStartNow');
const focusTable = document.getElementById('focusTable');
const focusEmpty = document.getElementById('focusEmpty');
const bodyweightChart = document.getElementById('bodyweightChart');
const bodyweightHint = document.getElementById('bodyweightHint');
const routineDayTabs = document.getElementById('routineDayTabs');
const routineList = document.getElementById('routineList');
const routineEmpty = document.getElementById('routineEmpty');
const addRoutineExerciseBtn = document.getElementById('addRoutineExerciseBtn');
const saveRoutineDayBtn = document.getElementById('saveRoutineDayBtn');
const routineSaveHint = document.getElementById('routineSaveHint');
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
const routineTemplate = document.getElementById('routineTemplate');

const state = {
  date: '',
  sessionName: '',
  bodyweight: '',
  updatedAt: 0,
  exercises: []
};
const sessionProtectedDates = new Set();

const ROUTINE_DAYS = [
  { key: 'monday', label: 'Maandag', index: 1 },
  { key: 'tuesday', label: 'Dinsdag', index: 2 },
  { key: 'wednesday', label: 'Woensdag', index: 3 },
  { key: 'thursday', label: 'Donderdag', index: 4 },
  { key: 'friday', label: 'Vrijdag', index: 5 },
  { key: 'saturday', label: 'Zaterdag', index: 6 },
  { key: 'sunday', label: 'Zondag', index: 0 }
];

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
  lastChangedScope: 'day',
  lastPull: 0,
  pullInFlight: false,
  pushInFlight: false,
  autoPullIntervalId: null
};

const AUTO_PULL_INTERVAL_MS = 10000;
const AUTO_PULL_MIN_GAP_MS = 8000;
const AUTO_PULL_DIRTY_GRACE_MS = 1500;

function setActivePage(page, options = {}) {
  const nextPage = page === 'dashboard' || page === 'routines' ? page : 'log';
  if (logPage) logPage.classList.toggle('active', nextPage === 'log');
  if (dashboardPage) dashboardPage.classList.toggle('active', nextPage === 'dashboard');
  if (routinesPage) routinesPage.classList.toggle('active', nextPage === 'routines');
  if (pageLogBtn) pageLogBtn.classList.toggle('active', nextPage === 'log');
  if (pageDashboardBtn) pageDashboardBtn.classList.toggle('active', nextPage === 'dashboard');
  if (pageRoutinesBtn) pageRoutinesBtn.classList.toggle('active', nextPage === 'routines');
  if (!options.skipPersist) {
    localStorage.setItem(UI_PAGE_KEY, nextPage);
  }
  if (!options.skipScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function getPreferredPage() {
  const saved = localStorage.getItem(UI_PAGE_KEY);
  return saved === 'dashboard' || saved === 'routines' ? saved : 'log';
}

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

function loadCustomExerciseLibrary() {
  const raw = localStorage.getItem(EXERCISE_LIBRARY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(item => normalizeExerciseProfile({
        name: item?.name,
        primary: item?.primary,
        secondaryGroups: item?.secondaryGroups ?? item?.secondary
      }))
      .filter(item => item.name);
  } catch {
    return [];
  }
}

function saveCustomExerciseLibrary(items) {
  const normalized = (items || [])
    .map(item => normalizeExerciseProfile(item))
    .filter(item => item.name);
  localStorage.setItem(EXERCISE_LIBRARY_KEY, JSON.stringify(normalized));
}

function createEmptyRoutines() {
  return ROUTINE_DAYS.reduce((acc, day) => {
    acc[day.key] = [];
    return acc;
  }, {});
}

function normalizeRoutineState(data) {
  const normalized = createEmptyRoutines();
  if (!data || typeof data !== 'object') return normalized;

  ROUTINE_DAYS.forEach(day => {
    const list = Array.isArray(data[day.key]) ? data[day.key] : [];
    normalized[day.key] = list.map(item => ({
      id: item?.id || uid(),
      name: String(item?.name || '').trim(),
      primaryGroup: sanitizeMuscleGroup(item?.primaryGroup) || sanitizeMuscleGroup(item?.primary) || '',
      secondaryGroups: normalizeSecondaryGroups(
        item?.secondaryGroups ?? item?.secondaryGroup ?? item?.secondary,
        sanitizeMuscleGroup(item?.primaryGroup) || sanitizeMuscleGroup(item?.primary) || ''
      )
    }));
  });

  return normalized;
}

function loadRoutines() {
  const raw = localStorage.getItem(ROUTINES_KEY);
  if (!raw) return createEmptyRoutines();
  try {
    return normalizeRoutineState(JSON.parse(raw));
  } catch {
    return createEmptyRoutines();
  }
}

function saveRoutines(routines) {
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(normalizeRoutineState(routines)));
}

function isDriveCloudConfigured() {
  const raw = localStorage.getItem(DB_CONFIG_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    return !!(parsed?.provider === 'drive'
      && String(parsed?.clientId || '').trim());
  } catch {
    return false;
  }
}

function emitCloudChange(scope) {
  if (window.__fitnessApplyingRemote) return;
  window.dispatchEvent(new CustomEvent('fitness:data-changed', {
    detail: {
      scope,
      date: state.date,
      updatedAt: state.updatedAt || Date.now()
    }
  }));
}

function getRoutineDayKeyFromDate(value) {
  const date = parseDate(value) || new Date();
  const match = ROUTINE_DAYS.find(day => day.index === date.getDay());
  return match?.key || 'monday';
}

function getRoutineDayLabel(dayKey) {
  return ROUTINE_DAYS.find(day => day.key === dayKey)?.label || 'Dag';
}

function populateRoutineSourceDaySelect() {
  if (!routineSourceDaySelect || routineSourceDaySelect.options.length) return;
  ROUTINE_DAYS.forEach(day => {
    const option = document.createElement('option');
    option.value = day.key;
    option.textContent = day.label;
    routineSourceDaySelect.appendChild(option);
  });
}

function getSelectedRoutineSourceDay() {
  populateRoutineSourceDaySelect();
  const selected = routineSourceDaySelect?.value || '';
  if (ROUTINE_DAYS.some(day => day.key === selected)) return selected;
  return getRoutineDayKeyFromDate(state.date || todayISO());
}

function updateRoutineApplyButton(options = {}) {
  populateRoutineSourceDaySelect();
  const targetKey = options.syncSelect === true
    ? getRoutineDayKeyFromDate(state.date || todayISO())
    : getSelectedRoutineSourceDay();

  if (routineSourceDaySelect) {
    routineSourceDaySelect.value = targetKey;
  }
  if (!addRoutineToDayBtn) return;
  const label = getRoutineDayLabel(targetKey).toLowerCase();
  addRoutineToDayBtn.textContent = `Voeg vaste oefeningen van ${label} toe`;
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
      primaryGroup: sanitizeMuscleGroup(ex?.primaryGroup) || '',
      secondaryGroups: normalizeSecondaryGroups(ex?.secondaryGroups ?? ex?.secondaryGroup, sanitizeMuscleGroup(ex?.primaryGroup) || ''),
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
      normalized[date] = {
        sessionName: day.sessionName || '',
        bodyweight: day.bodyweight ?? '',
        updatedAt: Number(day.updatedAt) || 0,
        exercises: []
      };
    }
    if (!normalized[date].sessionName && day.sessionName) {
      normalized[date].sessionName = day.sessionName;
    }
    if ((normalized[date].bodyweight === '' || normalized[date].bodyweight === undefined) && day.bodyweight !== undefined) {
      normalized[date].bodyweight = day.bodyweight;
    }
    if ((Number(day.updatedAt) || 0) > (Number(normalized[date].updatedAt) || 0)) {
      normalized[date].updatedAt = Number(day.updatedAt) || 0;
    }
    normalized[date].exercises.push(...mappedExercises);
  });

  return normalized;
}

function cloneState() {
  return JSON.parse(JSON.stringify({
    sessionName: state.sessionName,
    bodyweight: state.bodyweight,
    updatedAt: state.updatedAt || 0,
    exercises: state.exercises
  }));
}

function loadDay(date) {
  const all = loadAll();
  const day = all[date];
  state.date = date;
  state.sessionName = day?.sessionName || '';
  state.bodyweight = day?.bodyweight ?? '';
  state.updatedAt = Number(day?.updatedAt) || 0;
  state.exercises = (day?.exercises || []).map(ex => ({
    id: ex.id || uid(),
    name: ex.name || '',
    notes: ex.notes || '',
    primaryGroup: sanitizeMuscleGroup(ex.primaryGroup) || '',
    secondaryGroups: normalizeSecondaryGroups(ex.secondaryGroups ?? ex.secondaryGroup, sanitizeMuscleGroup(ex.primaryGroup) || ''),
    sets: (ex.sets || []).map(set => ({
      id: set.id || uid(),
      reps: set.reps ?? '',
      weight: set.weight ?? '',
      rpe: set.rpe ?? '',
      done: !!set.done
    }))
  }));

  sessionNameInput.value = state.sessionName;
  if (bodyweightInput) bodyweightInput.value = state.bodyweight === '' ? '' : state.bodyweight;
  updateRoutineApplyButton({ syncSelect: true });
}

function persist() {
  state.updatedAt = Date.now();
  const all = loadAll();
  all[state.date] = cloneState();
  saveAll(all);
  refreshProgress();
  if (state.date) sessionProtectedDates.add(state.date);
  syncState.dirty = true;
  syncState.lastLocalChange = Date.now();
  syncState.lastChangedDate = state.date;
  syncState.lastChangedScope = 'day';
  scheduleAutoSync();
  emitCloudChange('day');
}

function addExercise() {
  const exercise = {
    id: uid(),
    name: '',
    notes: '',
    primaryGroup: '',
    secondaryGroups: [],
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

function renderSecondaryPicker(container, selectedValues, primaryValue, inputClassName) {
  if (!container) return;
  const selected = new Set(normalizeSecondaryGroups(selectedValues, primaryValue));
  container.innerHTML = '';

  PRIMARY_GROUPS.forEach(group => {
    const chip = document.createElement('label');
    const isDisabled = group === primaryValue;
    chip.className = `secondary-chip${isDisabled ? ' disabled' : ''}`;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = inputClassName;
    input.value = group;
    input.checked = selected.has(group);
    input.disabled = isDisabled;

    const text = document.createElement('span');
    text.textContent = group;

    chip.appendChild(input);
    chip.appendChild(text);
    container.appendChild(chip);
  });

  if (!PRIMARY_GROUPS.length) {
    const empty = document.createElement('span');
    empty.className = 'secondary-empty';
    empty.textContent = 'Geen secondary muscles beschikbaar.';
    container.appendChild(empty);
  }
}

function readSecondaryPickerValues(card, inputClassName, primaryValue) {
  return normalizeSecondaryGroups(
    Array.from(card.querySelectorAll(`.${inputClassName}:checked`)).map(input => input.value),
    primaryValue
  );
}

function normalizeExerciseName(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function getCurrentDataSnapshot() {
  const all = loadAll();
  all[state.date] = cloneState();
  return all;
}

function getAutoExerciseProfile(name, catalog) {
  const cleanName = (name || '').trim();
  if (!cleanName) return null;
  const key = normalizeExerciseName(cleanName);
  const match = (catalog || []).find(item => normalizeExerciseName(item.name) === key);
  if (match) return match;

  return classifyExercise(cleanName);
}

function applyExerciseProfile(exercise, card, profile, catalog) {
  const nameInput = card?.querySelector('.exercise-name');
  const selectInput = card?.querySelector('.exercise-select');
  const primarySelect = card?.querySelector('.exercise-primary');
  const secondaryPicker = card?.querySelector('.exercise-secondary-picker');

  if (!profile) {
    exercise.primaryGroup = '';
    exercise.secondaryGroups = [];
    if (selectInput) selectInput.value = '';
    if (primarySelect) primarySelect.value = 'Automatisch';
    renderSecondaryPicker(secondaryPicker, [], '', 'exercise-secondary');
    return;
  }

  exercise.name = profile.name;
  exercise.primaryGroup = profile.primary || '';
  exercise.secondaryGroups = normalizeSecondaryGroups(profile.secondaryGroups ?? profile.secondary, exercise.primaryGroup);

  if (nameInput) nameInput.value = exercise.name;
  if (selectInput) {
    const exact = (catalog || []).find(item => normalizeExerciseName(item.name) === normalizeExerciseName(exercise.name));
    selectInput.value = exact ? exact.name : '';
  }
  if (primarySelect) primarySelect.value = exercise.primaryGroup || 'Automatisch';
  renderSecondaryPicker(secondaryPicker, exercise.secondaryGroups, exercise.primaryGroup, 'exercise-secondary');
}

function populateExerciseSelect(select, catalog, currentName) {
  if (!select) return;
  select.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Kies oefening uit lijst';
  select.appendChild(placeholder);

  catalog.forEach(item => {
    const option = document.createElement('option');
    option.value = item.name;
    option.textContent = item.name;
    select.appendChild(option);
  });

  const exact = getAutoExerciseProfile(currentName, catalog);
  select.value = exact && catalog.some(item => normalizeExerciseName(item.name) === normalizeExerciseName(currentName))
    ? exact.name
    : '';
}

function buildExerciseProfileFromExercise(exercise) {
  const name = (exercise?.name || '').trim();
  if (!name) return null;
  const { primary, secondaryGroups } = resolveExerciseMuscles(exercise);
  return normalizeExerciseProfile({ name, primary, secondaryGroups });
}

function saveExerciseProfileToLibrary(exercise) {
  const profile = buildExerciseProfileFromExercise(exercise);
  if (!profile) return false;

  const key = normalizeExerciseName(profile.name);
  const library = loadCustomExerciseLibrary()
    .filter(item => normalizeExerciseName(item.name) !== key);

  library.push(profile);
  library.sort((a, b) => a.name.localeCompare(b.name, 'nl-NL'));
  saveCustomExerciseLibrary(library);
  emitCloudChange('meta');
  return true;
}

function isBlankSet(set) {
  return !set
    || ((set.reps ?? '') === ''
      && (set.weight ?? '') === ''
      && (set.rpe ?? '') === ''
      && !set.done);
}

function applyQuickSetBuilder(exId, card) {
  const exercise = state.exercises.find(ex => ex.id === exId);
  if (!exercise || !card) return;

  const count = Number(card.querySelector('.quick-set-count')?.value || 0);
  const reps = card.querySelector('.quick-set-reps')?.value ?? '';
  const weight = card.querySelector('.quick-set-weight')?.value ?? '';
  const rpe = card.querySelector('.quick-set-rpe')?.value ?? '';

  if (!Number.isFinite(count) || count < 1) {
    alert('Vul eerst in hoeveel sets je wilt maken.');
    return;
  }

  if (`${reps}` === '' && `${weight}` === '' && `${rpe}` === '') {
    alert('Vul minstens reps, gewicht of RPE in voor je sets.');
    return;
  }

  const generatedSets = Array.from({ length: count }, () => newSet({ reps, weight, rpe }));
  const replaceBlankStarter = exercise.sets.length === 1 && isBlankSet(exercise.sets[0]);

  exercise.sets = replaceBlankStarter
    ? generatedSets
    : [...exercise.sets, ...generatedSets];

  renderExercises();
  persist();
}

function renderExercises() {
  exerciseList.innerHTML = '';
  ensureActiveExercise();
  const catalog = getExerciseCatalog(getCurrentDataSnapshot());

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
    const selectInput = card.querySelector('.exercise-select');
    const notesInput = card.querySelector('.exercise-notes');
    const primarySelect = card.querySelector('.exercise-primary');
    const secondaryPicker = card.querySelector('.exercise-secondary-picker');
    nameInput.value = exercise.name;
    populateExerciseSelect(selectInput, catalog, exercise.name);
    notesInput.value = exercise.notes;
    populateMuscleSelect(primarySelect, MUSCLE_SELECT_OPTIONS);
    const displayProfile = getAutoExerciseProfile(exercise.name, catalog);
    primarySelect.value = exercise.primaryGroup || displayProfile?.primary || 'Automatisch';
    renderSecondaryPicker(
      secondaryPicker,
      exercise.secondaryGroups?.length ? exercise.secondaryGroups : (displayProfile?.secondaryGroups || []),
      exercise.primaryGroup || displayProfile?.primary || '',
      'exercise-secondary'
    );

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

function applyRoutineProfile(item, card, profile, catalog) {
  const nameInput = card?.querySelector('.routine-name');
  const selectInput = card?.querySelector('.routine-select');
  const primarySelect = card?.querySelector('.routine-primary');
  const secondaryPicker = card?.querySelector('.routine-secondary-picker');

  if (!profile) {
    item.primaryGroup = '';
    item.secondaryGroups = [];
    if (selectInput) selectInput.value = '';
    if (primarySelect) primarySelect.value = 'Automatisch';
    renderSecondaryPicker(secondaryPicker, [], '', 'routine-secondary');
    return;
  }

  item.name = profile.name;
  item.primaryGroup = profile.primary || '';
  item.secondaryGroups = normalizeSecondaryGroups(profile.secondaryGroups ?? profile.secondary, item.primaryGroup);

  if (nameInput) nameInput.value = item.name;
  if (selectInput) {
    const exact = (catalog || []).find(entry => normalizeExerciseName(entry.name) === normalizeExerciseName(item.name));
    selectInput.value = exact ? exact.name : '';
  }
  if (primarySelect) primarySelect.value = item.primaryGroup || 'Automatisch';
  renderSecondaryPicker(secondaryPicker, item.secondaryGroups, item.primaryGroup, 'routine-secondary');
}

function getStoredRoutineDay() {
  const saved = localStorage.getItem(ROUTINE_UI_KEY);
  if (ROUTINE_DAYS.some(day => day.key === saved)) return saved;
  return getRoutineDayKeyFromDate(state.date || todayISO());
}

function persistRoutines(routines, options = {}) {
  saveRoutines(routines);
  syncState.dirty = true;
  syncState.lastLocalChange = Date.now();
  syncState.lastChangedDate = state.date;
  syncState.lastChangedScope = 'routines';
  if (options.refreshLogbook === true) renderExercises();
  if (options.rerenderRoutine !== false) renderRoutinePage();
  scheduleAutoSync();
  emitCloudChange('meta');
}

function saveRoutineDay() {
  const routines = loadRoutines();
  persistRoutines(routines, { refreshLogbook: true, rerenderRoutine: false });
  if (routineSaveHint) {
    routineSaveHint.textContent = `${getRoutineDayLabel(selectedRoutineDay)} is opgeslagen.`;
  }
  flashButtonLabel(saveRoutineDayBtn, 'Opgeslagen', 1100);
}

function setSelectedRoutineDay(dayKey, options = {}) {
  selectedRoutineDay = ROUTINE_DAYS.some(day => day.key === dayKey) ? dayKey : 'monday';
  if (!options.skipPersist) {
    localStorage.setItem(ROUTINE_UI_KEY, selectedRoutineDay);
  }
  renderRoutinePage();
}

function renderRoutinePage() {
  if (!routineDayTabs || !routineList || !routineEmpty) return;

  const routines = loadRoutines();
  const catalog = getExerciseCatalog(getCurrentDataSnapshot());
  if (routineSaveHint) {
    routineSaveHint.textContent = `Klik op opslaan om ${getRoutineDayLabel(selectedRoutineDay).toLowerCase()} te bevestigen.`;
  }

  routineDayTabs.innerHTML = '';
  ROUTINE_DAYS.forEach(day => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = day.key === selectedRoutineDay ? 'day-chip active' : 'day-chip';
    button.dataset.day = day.key;
    button.textContent = day.label;
    routineDayTabs.appendChild(button);
  });

  routineList.innerHTML = '';
  const items = routines[selectedRoutineDay] || [];
  routineEmpty.style.display = items.length ? 'none' : 'block';

  items.forEach(item => {
    const card = routineTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = item.id;

    const selectInput = card.querySelector('.routine-select');
    const nameInput = card.querySelector('.routine-name');
    const primarySelect = card.querySelector('.routine-primary');
    const secondaryPicker = card.querySelector('.routine-secondary-picker');

    populateExerciseSelect(selectInput, catalog, item.name);
    nameInput.value = item.name;
    populateMuscleSelect(primarySelect, MUSCLE_SELECT_OPTIONS);
    const profile = getAutoExerciseProfile(item.name, catalog);
    primarySelect.value = item.primaryGroup || profile?.primary || 'Automatisch';
    renderSecondaryPicker(
      secondaryPicker,
      item.secondaryGroups?.length ? item.secondaryGroups : (profile?.secondaryGroups || []),
      item.primaryGroup || profile?.primary || '',
      'routine-secondary'
    );

    routineList.appendChild(card);
  });
}

function addRoutineExercise() {
  const routines = loadRoutines();
  routines[selectedRoutineDay].push({
    id: uid(),
    name: '',
    primaryGroup: '',
    secondaryGroups: []
  });
  persistRoutines(routines);
  requestAnimationFrame(() => {
    const lastInput = routineList?.querySelector('.routine-card:last-child .routine-name');
    if (lastInput) lastInput.focus();
  });
}

function removeRoutineExercise(routineId) {
  const routines = loadRoutines();
  routines[selectedRoutineDay] = (routines[selectedRoutineDay] || []).filter(item => item.id !== routineId);
  persistRoutines(routines);
}

function handleRoutineInputChange(target) {
  const card = target.closest('.routine-card');
  if (!card) return;

  const routines = loadRoutines();
  const item = (routines[selectedRoutineDay] || []).find(entry => entry.id === card.dataset.id);
  if (!item) return;

  const catalog = getExerciseCatalog(getCurrentDataSnapshot());

  if (target.classList.contains('routine-name')) {
    const profile = getAutoExerciseProfile(target.value, catalog);
    if (profile) {
      applyRoutineProfile(item, card, profile, catalog);
    } else {
      item.name = target.value;
      applyRoutineProfile(item, card, null, catalog);
    }
  }

  if (target.classList.contains('routine-select') && target.value) {
    const profile = getAutoExerciseProfile(target.value, catalog);
    applyRoutineProfile(item, card, profile, catalog);
  }

  if (target.classList.contains('routine-primary')) {
    item.primaryGroup = target.value === 'Automatisch' ? '' : target.value;
    item.secondaryGroups = normalizeSecondaryGroups(item.secondaryGroups, item.primaryGroup);
    renderSecondaryPicker(card.querySelector('.routine-secondary-picker'), item.secondaryGroups, item.primaryGroup, 'routine-secondary');
  }

  if (target.classList.contains('routine-secondary')) {
    item.secondaryGroups = readSecondaryPickerValues(card, 'routine-secondary', item.primaryGroup);
  }

  persistRoutines(routines, { rerenderRoutine: false });
}

function addRoutineExercisesToCurrentDay() {
  const routines = loadRoutines();
  const dayKey = getSelectedRoutineSourceDay();
  const presets = routines[dayKey] || [];

  if (!presets.length) {
    alert(`Er staan nog geen vaste oefeningen voor ${getRoutineDayLabel(dayKey)}.`);
    return;
  }

  const existing = new Set(state.exercises.map(ex => normalizeExerciseName(ex.name)));
  const toAdd = presets.filter(item => !existing.has(normalizeExerciseName(item.name)));

  if (!toAdd.length) {
    alert('Alle vaste oefeningen van deze dag staan al in je logboek.');
    return;
  }

  toAdd.forEach(item => {
    state.exercises.push({
      id: uid(),
      name: item.name,
      notes: '',
      primaryGroup: item.primaryGroup || '',
      secondaryGroups: [...(item.secondaryGroups || [])],
      sets: [newSet()]
    });
  });

  activeExerciseId = state.exercises[state.exercises.length - 1]?.id || activeExerciseId;
  renderExercises();
  persist();
  flashButtonLabel(addRoutineToDayBtn, `+${toAdd.length} toegevoegd`, 1200);
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

function formatAxisDate(value) {
  const date = parseDate(value);
  if (!date) return value || '-';
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit'
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
  if (
    target.classList.contains('quick-set-count')
    || target.classList.contains('quick-set-reps')
    || target.classList.contains('quick-set-weight')
    || target.classList.contains('quick-set-rpe')
  ) return;
  const exId = card.dataset.id;
  const exercise = state.exercises.find(ex => ex.id === exId);
  if (!exercise) return;
  const catalog = getExerciseCatalog(getCurrentDataSnapshot());

  if (target.classList.contains('exercise-name')) {
    const profile = getAutoExerciseProfile(target.value, catalog);
    if (profile) {
      applyExerciseProfile(exercise, card, profile, catalog);
    } else {
      exercise.name = target.value;
      applyExerciseProfile(exercise, card, null, catalog);
    }
  }
  if (target.classList.contains('exercise-select')) {
    if (target.value) {
      const profile = getAutoExerciseProfile(target.value, catalog);
      applyExerciseProfile(exercise, card, profile, catalog);
    }
  }
  if (target.classList.contains('exercise-notes')) {
    exercise.notes = target.value;
  }
  if (target.classList.contains('exercise-primary')) {
    exercise.primaryGroup = target.value === 'Automatisch' ? '' : target.value;
    exercise.secondaryGroups = normalizeSecondaryGroups(exercise.secondaryGroups, exercise.primaryGroup);
    renderSecondaryPicker(card.querySelector('.exercise-secondary-picker'), exercise.secondaryGroups, exercise.primaryGroup, 'exercise-secondary');
  }
  if (target.classList.contains('exercise-secondary')) {
    exercise.secondaryGroups = readSecondaryPickerValues(card, 'exercise-secondary', exercise.primaryGroup);
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
  renderBodyweightTrend(all);
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
  'Anterior delts',
  'Lateral delts',
  'Rear delts',
  'Schouders',
  'Kuiten',
  'Hamstrings',
  'Quads',
  'Upper back',
  'Traps',
  'Abs',
  'Overig'
];

const EXERCISE_LIBRARY = [
  { name: 'Bench Press', primary: 'Borst', secondaryGroups: ['Triceps', 'Anterior delts'] },
  { name: 'Incline Bench Press', primary: 'Borst', secondaryGroups: ['Triceps', 'Anterior delts'] },
  { name: 'Chest Press', primary: 'Borst', secondaryGroups: ['Triceps', 'Anterior delts'] },
  { name: 'Incline Fly', primary: 'Borst', secondaryGroups: ['Anterior delts'] },
  { name: 'Cable Fly', primary: 'Borst', secondaryGroups: ['Anterior delts'] },
  { name: 'Push-Up', primary: 'Borst', secondaryGroups: ['Triceps', 'Anterior delts'] },
  { name: 'Shoulder Press', primary: 'Anterior delts', secondaryGroups: ['Triceps'] },
  { name: 'Military Press', primary: 'Anterior delts', secondaryGroups: ['Triceps'] },
  { name: 'Arnold Press', primary: 'Anterior delts', secondaryGroups: ['Triceps'] },
  { name: 'Lateral Raise', primary: 'Lateral delts', secondaryGroups: ['Traps'] },
  { name: 'Rear Delt Fly', primary: 'Rear delts', secondaryGroups: ['Upper back', 'Traps'] },
  { name: 'Face Pull', primary: 'Rear delts', secondaryGroups: ['Upper back', 'Traps'] },
  { name: 'Barbell Curl', primary: 'Biceps', secondaryGroups: [] },
  { name: 'Dumbbell Curl', primary: 'Biceps', secondaryGroups: [] },
  { name: 'Hammer Curl', primary: 'Biceps', secondaryGroups: ['Upper back'] },
  { name: 'Tricep Pushdown', primary: 'Triceps', secondaryGroups: [] },
  { name: 'Skull Crusher', primary: 'Triceps', secondaryGroups: [] },
  { name: 'Overhead Tricep Extension', primary: 'Triceps', secondaryGroups: [] },
  { name: 'Squat', primary: 'Quads', secondaryGroups: ['Hamstrings'] },
  { name: 'Hack Squat', primary: 'Quads', secondaryGroups: ['Hamstrings'] },
  { name: 'Leg Press', primary: 'Quads', secondaryGroups: ['Hamstrings'] },
  { name: 'Walking Lunge', primary: 'Quads', secondaryGroups: ['Hamstrings'] },
  { name: 'Leg Extension', primary: 'Quads', secondaryGroups: [] },
  { name: 'Romanian Deadlift', primary: 'Hamstrings', secondaryGroups: ['Upper back', 'Traps'] },
  { name: 'Deadlift', primary: 'Hamstrings', secondaryGroups: ['Upper back', 'Traps'] },
  { name: 'Leg Curl', primary: 'Hamstrings', secondaryGroups: [] },
  { name: 'Calf Raise', primary: 'Kuiten', secondaryGroups: [] },
  { name: 'Lat Pulldown', primary: 'Upper back', secondaryGroups: ['Biceps', 'Rear delts'] },
  { name: 'Pull-Up', primary: 'Upper back', secondaryGroups: ['Biceps', 'Rear delts'] },
  { name: 'Seated Cable Row', primary: 'Upper back', secondaryGroups: ['Biceps', 'Rear delts'] },
  { name: 'Barbell Row', primary: 'Upper back', secondaryGroups: ['Biceps', 'Rear delts'] },
  { name: 'Shrug', primary: 'Traps', secondaryGroups: [] },
  { name: 'Crunch', primary: 'Abs', secondaryGroups: [] },
  { name: 'Cable Crunch', primary: 'Abs', secondaryGroups: [] },
  { name: 'Hanging Leg Raise', primary: 'Abs', secondaryGroups: [] },
  { name: 'Plank', primary: 'Abs', secondaryGroups: [] }
];

const MUSCLE_SELECT_OPTIONS = ['Automatisch', ...PRIMARY_GROUPS];

const CATEGORY_COLORS = {
  Biceps: '#6c5ce7',
  Triceps: '#00b894',
  Borst: '#d63031',
  'Anterior delts': '#f08c6c',
  'Lateral delts': '#e17055',
  'Rear delts': '#b85c38',
  Schouders: '#d9822b',
  Kuiten: '#0984e3',
  Hamstrings: '#2d3436',
  Quads: '#e84393',
  'Upper back': '#00cec9',
  Traps: '#fdcb6e',
  Abs: '#636e72',
  Overig: '#b2bec3'
};

function sanitizeMuscleGroup(value) {
  const raw = String(value || '').trim();
  return PRIMARY_GROUPS.includes(raw) ? raw : '';
}

function normalizeSecondaryGroups(value, primary = '') {
  const source = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : value
        ? [value]
        : [];
  const normalized = [];
  const used = new Set();

  source.forEach(item => {
    const group = sanitizeMuscleGroup(item);
    if (!group || group === primary || used.has(group)) return;
    used.add(group);
    normalized.push(group);
  });

  return normalized;
}

function normalizeExerciseProfile(profile) {
  const name = String(profile?.name || '').trim();
  const primary = sanitizeMuscleGroup(profile?.primary) || 'Overig';
  const secondaryGroups = normalizeSecondaryGroups(
    profile?.secondaryGroups ?? profile?.secondary,
    primary
  );
  return {
    name,
    primary,
    secondaryGroups,
    secondary: secondaryGroups[0] || ''
  };
}

function classifyExercise(name) {
  const n = (name || '').toLowerCase();

  if (/(rear delt|rear raise|reverse fly|face pull)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Rear delts', secondaryGroups: ['Upper back', 'Traps'] });
  }
  if (/(lateral raise|side raise)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Lateral delts', secondaryGroups: ['Traps'] });
  }
  if (/(shoulder press|overhead|military|arnold|front raise)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Anterior delts', secondaryGroups: ['Triceps'] });
  }
  if (/(shoulder|delt)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Schouders', secondaryGroups: ['Triceps'] });
  }
  if (/(bench|chest|incline|decline|pec)/.test(n)) {
    const secondaryGroups = /fly/.test(n) ? ['Anterior delts'] : ['Triceps', 'Anterior delts'];
    return normalizeExerciseProfile({ name, primary: 'Borst', secondaryGroups });
  }
  if (/(fly)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Borst', secondaryGroups: ['Anterior delts'] });
  }
  if (/(bicep|curl)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Biceps', secondaryGroups: [] });
  }
  if (/(tricep|pushdown|skull|extension)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Triceps', secondaryGroups: [] });
  }
  if (/(squat|leg press|lunge|leg extension|hack squat)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Quads', secondaryGroups: ['Hamstrings'] });
  }
  if (/(hamstring|leg curl|rdl|romanian|deadlift|good morning)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Hamstrings', secondaryGroups: ['Upper back', 'Traps'] });
  }
  if (/(calf)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Kuiten', secondaryGroups: [] });
  }
  if (/(row|pull|pulldown|lat|chin|pullup|pull-up)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Upper back', secondaryGroups: ['Biceps', 'Rear delts'] });
  }
  if (/(shrug|trap)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Traps', secondaryGroups: [] });
  }
  if (/(abs|core|crunch|plank|sit-up|leg raise)/.test(n)) {
    return normalizeExerciseProfile({ name, primary: 'Abs', secondaryGroups: [] });
  }

  return normalizeExerciseProfile({ name, primary: 'Overig', secondaryGroups: [] });
}

function resolveExerciseMuscles(exercise) {
  const fallback = classifyExercise(exercise?.name || '');
  const primary = sanitizeMuscleGroup(exercise?.primaryGroup) || fallback.primary;
  const secondaryGroups = normalizeSecondaryGroups(
    exercise?.secondaryGroups ?? exercise?.secondaryGroup ?? fallback.secondaryGroups,
    primary
  );
  return {
    primary,
    secondaryGroups,
    secondary: secondaryGroups[0] || ''
  };
}

function getExerciseCatalog(all) {
  const byName = new Map();

  EXERCISE_LIBRARY.forEach(item => {
    const profile = normalizeExerciseProfile(item);
    byName.set(normalizeExerciseName(profile.name), profile);
  });

  loadCustomExerciseLibrary().forEach(item => {
    const profile = normalizeExerciseProfile(item);
    byName.set(normalizeExerciseName(profile.name), profile);
  });

  Object.values(loadRoutines()).flat().forEach(item => {
    if (!item?.name) return;
    const profile = normalizeExerciseProfile({
      name: item.name,
      primary: item.primaryGroup || '',
      secondaryGroups: item.secondaryGroups ?? item.secondaryGroup
    });
    byName.set(normalizeExerciseName(profile.name), profile);
  });

  Object.entries(all || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([, day]) => {
      (day?.exercises || []).forEach(exercise => {
        const name = (exercise?.name || '').trim();
        if (!name) return;
        const { primary, secondaryGroups } = resolveExerciseMuscles(exercise);
        const profile = normalizeExerciseProfile({ name, primary, secondaryGroups });
        byName.set(normalizeExerciseName(name), profile);
      });
    });

  return Array.from(byName.values())
    .filter(item => item.name)
    .sort((a, b) => a.name.localeCompare(b.name, 'nl-NL'));
}

function toIsoDateString(date) {
  const safe = new Date(date);
  safe.setHours(0, 0, 0, 0);
  const local = new Date(safe.getTime() - safe.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function getWeekStartDate(value) {
  const base = parseDate(value) || new Date();
  const date = new Date(base);
  date.setHours(0, 0, 0, 0);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return date;
}

function formatWeekInputValue(value) {
  const weekStart = getWeekStartDate(value);
  const anchor = new Date(Date.UTC(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 3));
  const weekYear = anchor.getUTCFullYear();
  const jan4 = new Date(Date.UTC(weekYear, 0, 4));
  const jan4Offset = (jan4.getUTCDay() + 6) % 7;
  const weekOneStart = new Date(jan4);
  weekOneStart.setUTCDate(jan4.getUTCDate() - jan4Offset);
  const week = 1 + Math.round((anchor - weekOneStart) / 604800000);
  return `${weekYear}-W${String(week).padStart(2, '0')}`;
}

function parseWeekInputValue(value) {
  const match = /^(\d{4})-W(\d{2})$/.exec(String(value || '').trim());
  if (!match) return getWeekStartDate(state.date || todayISO());

  const year = Number(match[1]);
  const week = Number(match[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Offset = (jan4.getUTCDay() + 6) % 7;
  const weekOneStart = new Date(jan4);
  weekOneStart.setUTCDate(jan4.getUTCDate() - jan4Offset);
  const monday = new Date(weekOneStart);
  monday.setUTCDate(weekOneStart.getUTCDate() + (week - 1) * 7);
  return new Date(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate());
}

function getWeekDates(weekValue) {
  const weekStart = parseWeekInputValue(weekValue);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return toIsoDateString(date);
  });
}

function getStoredDashboardWeek() {
  const stored = localStorage.getItem(DASHBOARD_WEEK_KEY);
  if (/^\d{4}-W\d{2}$/.test(stored || '')) return stored;
  return formatWeekInputValue(state.date || todayISO());
}

function updateDashboardWeekLabel() {
  if (!dashboardWeekLabel) return;
  const dates = getWeekDates(selectedDashboardWeek || getStoredDashboardWeek());
  dashboardWeekLabel.textContent = `Week van ${formatShortDate(dates[0])} t/m ${formatShortDate(dates[6])}`;
}

function setSelectedDashboardWeek(value, options = {}) {
  selectedDashboardWeek = /^\d{4}-W\d{2}$/.test(value || '')
    ? value
    : formatWeekInputValue(state.date || todayISO());
  if (dashboardWeekInput) dashboardWeekInput.value = selectedDashboardWeek;
  if (!options.skipPersist) localStorage.setItem(DASHBOARD_WEEK_KEY, selectedDashboardWeek);
  updateDashboardWeekLabel();
  if (!options.skipRefresh) refreshProgress();
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
      const { primary, secondaryGroups } = resolveExerciseMuscles(exercise);
      primaryTotals[primary][index] += volume;
      secondaryGroups.forEach(group => {
        if (secondaryTotals[group]) secondaryTotals[group][index] += volume;
      });
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
  const dates = getWeekDates(selectedDashboardWeek || getStoredDashboardWeek());
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
let selectedRoutineDay = 'monday';
let selectedDashboardWeek = '';

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

function getWeightAxisRange(values, ticks = 4) {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const spread = Math.max(maxValue - minValue, 1);
  const padding = Math.max(spread * 0.15, 0.5);
  const roughStep = (spread + padding * 2) / ticks;
  const stepChoices = [0.1, 0.2, 0.5, 1, 2, 5, 10];
  const step = stepChoices.find(choice => roughStep <= choice) || Math.ceil(roughStep);
  const min = Math.max(0, Math.floor((minValue - padding) / step) * step);
  const max = Math.ceil((maxValue + padding) / step) * step;
  return { min, max: max === min ? min + step : max, ticks };
}

function drawBodyweightChart(canvas, points) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const paddingLeft = 54;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 38;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  if (!points.length) {
    ctx.fillStyle = '#6a5e54';
    ctx.font = '14px Space Grotesk';
    ctx.fillText('Nog geen lichaamsgewicht ingevuld.', 14, h / 2);
    return;
  }

  const values = points.map(point => point.weight);
  const axis = getWeightAxisRange(values);
  const chartHeight = h - paddingTop - paddingBottom;
  const chartWidth = w - paddingLeft - paddingRight;
  const denominator = points.length - 1 || 1;

  ctx.strokeStyle = 'rgba(26,26,26,0.14)';
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

  for (let i = 0; i <= axis.ticks; i += 1) {
    const value = axis.min + ((axis.max - axis.min) / axis.ticks) * i;
    const y = h - paddingBottom - ((value - axis.min) / (axis.max - axis.min)) * chartHeight;
    ctx.strokeStyle = 'rgba(26,26,26,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();

    ctx.fillStyle = '#1a1a1a';
    ctx.font = '600 11px Space Grotesk';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${formatNumber(value)} kg`, paddingLeft - 6, y);
  }

  ctx.strokeStyle = '#0f6b66';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = points.length === 1
      ? paddingLeft + chartWidth / 2
      : paddingLeft + (index / denominator) * chartWidth;
    const y = h - paddingBottom - ((point.weight - axis.min) / (axis.max - axis.min)) * chartHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    const x = points.length === 1
      ? paddingLeft + chartWidth / 2
      : paddingLeft + (index / denominator) * chartWidth;
    const y = h - paddingBottom - ((point.weight - axis.min) / (axis.max - axis.min)) * chartHeight;
    ctx.fillStyle = '#c2552d';
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  const labelStep = Math.max(1, Math.ceil(points.length / 6));
  points.forEach((point, index) => {
    if (index % labelStep !== 0 && index !== points.length - 1) return;
    const x = points.length === 1
      ? paddingLeft + chartWidth / 2
      : paddingLeft + (index / denominator) * chartWidth;
    ctx.fillStyle = '#6a5e54';
    ctx.font = '11px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(formatAxisDate(point.date), x, h - 10);
  });
}

function renderBodyweightTrend(all) {
  if (!bodyweightChart) return;
  const points = Object.entries(all)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, day]) => {
      const raw = day?.bodyweight;
      if (raw === '' || raw === null || raw === undefined) return null;
      const weight = Number(raw);
      if (!Number.isFinite(weight)) return null;
      return { date, weight };
    })
    .filter(Boolean);

  drawBodyweightChart(bodyweightChart, points);
  if (bodyweightHint) {
    bodyweightHint.style.display = points.length ? 'none' : 'block';
  }
}

function flashButtonLabel(button, label, duration = 900) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, duration);
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
  const payload = {
    version: 2,
    days: all,
    routines: loadRoutines(),
    customExercises: loadCustomExerciseLibrary()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
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
      const nextDays = data?.days && typeof data.days === 'object' ? data.days : data;
      saveAll(nextDays);
      if (data?.routines) saveRoutines(data.routines);
      if (Array.isArray(data?.customExercises)) saveCustomExerciseLibrary(data.customExercises);
      loadDay(state.date);
      renderExercises();
      renderRoutinePage();
      refreshProgress();
      emitCloudChange('all');
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
  if (syncUrlInput) syncUrlInput.value = syncState.url;
  if (syncSheetIdInput) syncSheetIdInput.value = syncState.sheetId;
  if (syncTokenInput) syncTokenInput.value = syncState.token;
  if (syncAutoInput) syncAutoInput.checked = syncState.auto;
  if (syncAutoPullInput) {
    syncAutoPullInput.checked = true;
    syncAutoPullInput.disabled = true;
  }
  updateSyncStatus(isDriveCloudConfigured()
    ? 'Google Sheets-sync staat uit omdat Google Drive JSON actief is.'
    : (hasSyncConfig() ? 'Gereed om te syncen.' : 'Nog niet verbonden.'));
}

function normalizeScriptUrl(url) {
  if (!url) return '';
  return url.replace(/\/dev\s*$/i, '/exec');
}

function saveSyncConfig() {
  if (!syncUrlInput || !syncSheetIdInput || !syncTokenInput || !syncAutoInput) return;
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
  if (isDriveCloudConfigured()) return false;
  return !!(syncState.url && syncState.sheetId);
}

function buildRowsForDay(date, day) {
  const rowsSets = [];
  const totalExercises = day.exercises?.length || 0;
  let totalSets = 0;
  let totalVolume = 0;
  let best = null;
  let bestVolume = -1;
  const bodyweightValue = Number(day.bodyweight);
  const bodyweight = Number.isFinite(bodyweightValue) && `${day.bodyweight}` !== '' ? bodyweightValue : '';
  const updatedAt = Number(day.updatedAt) || 0;

  (day.exercises || []).forEach(exercise => {
    const exerciseName = (exercise.name || '').trim() || 'Oefening';
    const notes = exercise.notes || '';
    const { primary, secondaryGroups } = resolveExerciseMuscles(exercise);

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
        secondaryGroups.join(', '),
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
    bestStr,
    bodyweight,
    updatedAt
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

function buildRoutineRows(routines) {
  const rows = [];
  ROUTINE_DAYS.forEach(day => {
    (routines?.[day.key] || []).forEach(item => {
      if (!(item?.name || '').trim()) return;
      const resolved = resolveExerciseMuscles(item);
      rows.push([
        day.key,
        day.label,
        item.name.trim(),
        resolved.primary,
        resolved.secondaryGroups.join(', ')
      ]);
    });
  });
  return rows;
}

function buildRoutinesFromSheets(rows) {
  const routines = createEmptyRoutines();
  (rows || []).forEach(row => {
    const dayKey = String(row[0] || '').trim().toLowerCase();
    if (!ROUTINE_DAYS.some(day => day.key === dayKey)) return;
    const name = String(row[2] || '').trim();
    if (!name) return;
    routines[dayKey].push({
      id: uid(),
      name,
      primaryGroup: sanitizeMuscleGroup(row[3]) || '',
      secondaryGroups: normalizeSecondaryGroups(row[4], sanitizeMuscleGroup(row[3]) || '')
    });
  });
  return normalizeRoutineState(routines);
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
    syncState.lastChangedScope = 'day';
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
  const routines = buildRoutineRows(loadRoutines());

  updateSyncStatus('Alles syncen...');
  syncState.pushInFlight = true;
  const result = await postSync({
    action: 'syncAll',
    sheetId: syncState.sheetId,
    token: syncState.token,
    days,
    routines
  });
  syncState.pushInFlight = false;
  if (result.ok) {
    syncState.dirty = false;
    syncState.lastChangedScope = 'day';
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
    if (syncState.lastChangedScope === 'routines') {
      syncAll();
      return;
    }
    const targetDate = syncState.lastChangedDate || state.date;
    syncDay(targetDate, { silent: true });
  }, 1200);
}

function parseMaybeNumber(value) {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  return Number.isFinite(num) ? num : value;
}

function parseTimestamp(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
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
    && (col4 === '' || normalizeSecondaryGroups(col4).length > 0)
    && Number.isFinite(col5);

  if (looksLikeV13) {
    return {
      exerciseId: col3,
      primary: sanitizeMuscleGroup(row[4]),
      secondaryGroups: normalizeSecondaryGroups(row[5], sanitizeMuscleGroup(row[4])),
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
      secondaryGroups: normalizeSecondaryGroups(row[4], sanitizeMuscleGroup(row[3])),
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
    secondaryGroups: [],
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
    const bodyweight = parseMaybeNumber(row[6]);
    const updatedAt = parseTimestamp(row[7]);
    all[date] = { sessionName, bodyweight, updatedAt, exercises: [] };
  });

  (setsRows || []).forEach(row => {
    const date = normalizeDateValue(row[0]);
    if (!date) return;
    const sessionName = row[1] || '';
    const exerciseName = (row[2] || '').trim() || 'Oefening';
    const parsed = parseSetRow(row);
    const exerciseId = parsed.exerciseId;
    const primary = parsed.primary;
    const secondaryGroups = parsed.secondaryGroups || [];
    const setNumber = parsed.setNumber;
    const reps = parsed.reps;
    const weight = parsed.weight;
    const rpe = parsed.rpe;
    const doneRaw = parsed.doneRaw;
    const notes = parsed.notes;
    const done = doneRaw === true || doneRaw === 'yes' || doneRaw === 'true' || doneRaw === 1 || doneRaw === '1';

    if (!all[date]) {
      all[date] = { sessionName, bodyweight: '', updatedAt: 0, exercises: [] };
    } else if (!all[date].sessionName && sessionName) {
      all[date].sessionName = sessionName;
    }

    if (!exerciseIndex[date]) exerciseIndex[date] = {};
    const fallbackKey = `${exerciseName}::${primary}::${secondaryGroups.join('|')}`;
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
          secondaryGroups: [...secondaryGroups],
          sets: []
        },
        sets: []
      };
    }

    const entry = exerciseIndex[date][exerciseKey];
    if (!entry.exercise.primaryGroup && primary) entry.exercise.primaryGroup = primary;
    if ((!entry.exercise.secondaryGroups || !entry.exercise.secondaryGroups.length) && secondaryGroups.length) {
      entry.exercise.secondaryGroups = [...secondaryGroups];
    }
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
  const sessionProtected = !!(state.date && sessionProtectedDates.has(state.date));
  const focusedInsideExercises = !!(document.activeElement && exerciseList.contains(document.activeElement));
  const focusedInsideRoutines = !!(document.activeElement && routineList && routineList.contains(document.activeElement));
  const recentlyEdited = Date.now() - syncState.lastLocalChange < 30000;
  return sessionProtected || focusedInsideExercises || focusedInsideRoutines || recentlyEdited || syncState.dirty;
}

function mergeCurrentLocalDayIntoAll(all, options = {}) {
  if (!state.date) return all;
  const localDay = cloneState();
  const remoteDay = all[state.date] || null;
  const localUpdatedAt = Number(localDay.updatedAt) || 0;
  const remoteUpdatedAt = Number(remoteDay?.updatedAt) || 0;
  const shouldUseLocal = options.skipProtection !== true
    && (shouldProtectLocalDay() || localUpdatedAt >= remoteUpdatedAt);
  if (!shouldUseLocal) return all;

  all[state.date] = {
    sessionName: localDay.sessionName || '',
    bodyweight: localDay.bodyweight ?? '',
    updatedAt: localUpdatedAt,
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
  const shouldBypassProtection = !silent && confirmOverwrite;
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

  const hasRoutinesPayload = !!(result.data && Object.prototype.hasOwnProperty.call(result.data, 'routines'));
  if (hasRoutinesPayload) {
    saveRoutines(buildRoutinesFromSheets(result.data?.routines || []));
  }
  if (shouldBypassProtection && state.date) {
    sessionProtectedDates.delete(state.date);
  }
  const all = mergeCurrentLocalDayIntoAll(
    buildAllFromSheets(result.data?.days || [], result.data?.sets || []),
    { skipProtection: shouldBypassProtection }
  );
  saveAll(all);
  syncState.dirty = false;
  syncState.lastChangedScope = 'day';
  loadDay(state.date);
  renderExercises();
  renderRoutinePage();
  refreshProgress();
  syncState.lastPull = Date.now();
  if (!skipStatus) updateSyncStatus('Data opgehaald.');
}

async function maybeAutoPull(reason) {
  if (!syncState.pullOnLoad) return;
  if (!hasSyncConfig()) return;
  if (syncState.pullInFlight || syncState.pushInFlight) return;
  if (document.activeElement && exerciseList.contains(document.activeElement)) return;
  if (document.activeElement && routineList && routineList.contains(document.activeElement)) return;

  const now = Date.now();
  if (reason === 'interval' && now - syncState.lastPull < AUTO_PULL_MIN_GAP_MS) return;
  if (syncState.dirty && now - syncState.lastLocalChange < AUTO_PULL_DIRTY_GRACE_MS) return;

  if (syncState.dirty) {
    if (syncState.lastChangedScope === 'routines') {
      await syncAll();
    } else {
      const targetDate = syncState.lastChangedDate || state.date;
      await syncDay(targetDate, { silent: true });
    }
    if (syncState.dirty) {
      return;
    }
  }

  if (state.date && sessionProtectedDates.has(state.date)) {
    return;
  }

  await pullAllFromSheets({ silent: true, confirmOverwrite: false, skipStatus: true });
}


if (pageLogBtn) {
  pageLogBtn.addEventListener('click', () => {
    if (logPage && !logPage.classList.contains('active')) {
      renderExercises();
      updateRoutineApplyButton();
    }
    setActivePage('log');
  });
}

if (pageDashboardBtn) {
  pageDashboardBtn.addEventListener('click', () => {
    setActivePage('dashboard');
  });
}

if (pageRoutinesBtn) {
  pageRoutinesBtn.addEventListener('click', () => {
    setActivePage('routines');
  });
}

addExerciseBtn.addEventListener('click', addExercise);
addExerciseMiniBtn.addEventListener('click', addExercise);
addExerciseEmptyBtn.addEventListener('click', addExercise);
if (addRoutineToDayBtn) addRoutineToDayBtn.addEventListener('click', addRoutineExercisesToCurrentDay);
if (addRoutineExerciseBtn) addRoutineExerciseBtn.addEventListener('click', addRoutineExercise);
if (saveRoutineDayBtn) saveRoutineDayBtn.addEventListener('click', saveRoutineDay);

saveDayBtn.addEventListener('click', () => {
  persist();
  flashSaved();
});

sessionNameInput.addEventListener('input', () => {
  state.sessionName = sessionNameInput.value;
  persist();
});

bodyweightInput.addEventListener('input', () => {
  state.bodyweight = bodyweightInput.value;
  persist();
});

if (routineSourceDaySelect) {
  routineSourceDaySelect.addEventListener('change', () => {
    updateRoutineApplyButton();
  });
}

if (dashboardWeekInput) {
  dashboardWeekInput.addEventListener('change', () => {
    setSelectedDashboardWeek(dashboardWeekInput.value);
  });
}

if (dashboardWeekNowBtn) {
  dashboardWeekNowBtn.addEventListener('click', () => {
    setSelectedDashboardWeek(formatWeekInputValue(todayISO()));
  });
}

if (routineDayTabs) {
  routineDayTabs.addEventListener('click', event => {
    const button = event.target.closest('[data-day]');
    if (!button) return;
    setSelectedRoutineDay(button.dataset.day);
  });
}

if (routineList) {
  routineList.addEventListener('input', event => handleRoutineInputChange(event.target));
  routineList.addEventListener('change', event => handleRoutineInputChange(event.target));
  routineList.addEventListener('click', event => {
    if (event.target.classList.contains('remove-routine')) {
      const card = event.target.closest('.routine-card');
      if (card) removeRoutineExercise(card.dataset.id);
    }
  });
}

exerciseList.addEventListener('input', event => handleInputChange(event.target));
exerciseList.addEventListener('change', event => handleInputChange(event.target));

exerciseList.addEventListener('click', event => {
  const card = event.target.closest('.exercise-card');
  if (!card) return;
  const exId = card.dataset.id;
  if (exId) setActiveExercise(exId);

  if (event.target.classList.contains('save-custom-exercise')) {
    const exercise = state.exercises.find(ex => ex.id === exId);
    if (!exercise || !(exercise.name || '').trim()) {
      alert('Geef eerst een naam aan je oefening.');
      return;
    }

    const saved = saveExerciseProfileToLibrary(exercise);
    if (saved) {
      const catalog = getExerciseCatalog(getCurrentDataSnapshot());
      document.querySelectorAll('.exercise-card').forEach(currentCard => {
        const select = currentCard.querySelector('.exercise-select');
        const currentExercise = state.exercises.find(ex => ex.id === currentCard.dataset.id);
        populateExerciseSelect(select, catalog, currentExercise?.name || '');
      });
      flashButtonLabel(event.target, 'Bewaard');
    }
  }

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

  if (event.target.classList.contains('apply-quick-sets')) {
    applyQuickSetBuilder(exId, card);
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

if (syncUrlInput) syncUrlInput.addEventListener('input', saveSyncConfig);
if (syncSheetIdInput) syncSheetIdInput.addEventListener('input', saveSyncConfig);
if (syncTokenInput) syncTokenInput.addEventListener('input', saveSyncConfig);
if (syncAutoInput) {
  syncAutoInput.addEventListener('change', () => {
    saveSyncConfig();
    scheduleAutoSync();
  });
}
if (syncAutoPullInput) {
  syncAutoPullInput.addEventListener('change', () => {
    saveSyncConfig();
    maybeAutoPull('toggle');
  });
}

if (syncNowBtn) {
  syncNowBtn.addEventListener('click', () => {
    saveSyncConfig();
    syncDay();
  });
}

if (syncAllBtn) {
  syncAllBtn.addEventListener('click', () => {
    saveSyncConfig();
    syncAll();
  });
}

if (syncPullBtn) {
  syncPullBtn.addEventListener('click', () => {
    saveSyncConfig();
    pullAllFromSheets();
  });
}

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

if (syncTestBtn) {
  syncTestBtn.addEventListener('click', () => {
    saveSyncConfig();
    testSync();
  });
}

dateInput.addEventListener('change', () => {
  persist();
  loadDay(dateInput.value);
  renderExercises();
  refreshProgress();
});

function getCloudPayload() {
  const all = loadAll();
  all[state.date] = cloneState();
  return {
    days: all,
    routines: loadRoutines(),
    customExercises: loadCustomExerciseLibrary()
  };
}

function applyCloudPayload(payload, options = {}) {
  const nextDays = payload?.days && typeof payload.days === 'object' ? payload.days : {};
  const nextRoutines = payload?.routines && typeof payload.routines === 'object'
    ? payload.routines
    : createEmptyRoutines();
  const nextExercises = Array.isArray(payload?.customExercises) ? payload.customExercises : [];

  window.__fitnessApplyingRemote = true;
  try {
    saveAll(nextDays);
    saveRoutines(nextRoutines);
    saveCustomExerciseLibrary(nextExercises);
    if (options.clearSessionProtection !== false) {
      sessionProtectedDates.clear();
    }
    const activeDate = state.date || todayISO();
    if (dateInput) dateInput.value = activeDate;
    loadDay(activeDate);
    renderExercises();
    renderRoutinePage();
    refreshProgress();
  } finally {
    window.__fitnessApplyingRemote = false;
  }
}

window.__fitnessApplyingRemote = false;
window.fitnessApp = {
  getCloudPayload,
  applyCloudPayload,
  createEmptyRoutines,
  normalizeRoutineState,
  getCurrentDate: () => state.date,
  isDriveConfigured: isDriveCloudConfigured
};

function init() {
  loadSyncConfig();
  setActivePage(getPreferredPage(), { skipScroll: true });
  selectedRoutineDay = getStoredRoutineDay();
  selectedDashboardWeek = getStoredDashboardWeek();
  const today = todayISO();
  dateInput.value = today;
  loadDay(today);
  setSelectedDashboardWeek(selectedDashboardWeek, { skipRefresh: true, skipPersist: true });
  renderExercises();
  renderRoutinePage();
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







