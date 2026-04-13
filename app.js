const STORAGE_KEY = 'fitnessLog.v1';
const SYNC_KEY = 'fitnessLog.sync.v1';
const DB_CONFIG_KEY = 'fitnessLog.dbConfig.v1';
const EXERCISE_LIBRARY_KEY = 'fitnessLog.exerciseLibrary.v1';
const ROUTINES_KEY = 'fitnessLog.routines.v1';
const UI_PAGE_KEY = 'fitnessLog.uiPage.v1';
const ROUTINE_UI_KEY = 'fitnessLog.routineDay.v1';
const ROUTINE_OPTION_UI_KEY = 'fitnessLog.routineOption.v1';
const DASHBOARD_WEEK_KEY = 'fitnessLog.dashboardWeek.v1';
const VISIT_GRANULARITY_KEY = 'fitnessLog.visitGranularity.v1';
const PROGRESS_ENTRIES_KEY = 'fitnessLog.progressEntries.v1';
const VISION_SETTINGS_KEY = 'fitnessLog.visionSettings.v1';

const dateInput = document.getElementById('dateInput');
const sessionNameInput = document.getElementById('sessionName');
const bodyweightInput = document.getElementById('bodyweightInput');
const startTimeInput = document.getElementById('startTimeInput');
const endTimeInput = document.getElementById('endTimeInput');
const routineSourceDaySelect = document.getElementById('routineSourceDay');
const routineSourceOptionSelect = document.getElementById('routineSourceOption');
const pageStoryBtn = document.getElementById('pageStoryBtn');
const pageLogBtn = document.getElementById('pageLogBtn');
const pageDashboardBtn = document.getElementById('pageDashboardBtn');
const pageProgressBtn = document.getElementById('pageProgressBtn');
const pageRoutinesBtn = document.getElementById('pageRoutinesBtn');
const storyPage = document.getElementById('storyPage');
const logPage = document.getElementById('logPage');
const dashboardPage = document.getElementById('dashboardPage');
const progressPage = document.getElementById('progressPage');
const routinesPage = document.getElementById('routinesPage');
const addExerciseBtn = document.getElementById('addExercise');
const addRoutineToDayBtn = document.getElementById('addRoutineToDayBtn');
const addExerciseMiniBtn = document.getElementById('addExerciseMini');
const addExerciseEmptyBtn = document.getElementById('addExerciseEmpty');
const saveDayBtn = document.getElementById('saveDay');
const exportExcelLogBtn = document.getElementById('exportExcelLogBtn');
const exerciseList = document.getElementById('exerciseList');
const emptyState = document.getElementById('emptyState');
const dayBadge = document.getElementById('dayBadge');
const dayExerciseSummary = document.getElementById('dayExerciseSummary');
const dayEmpty = document.getElementById('dayEmpty');
const primarySummary = document.getElementById('primarySummary');
const weekPrimaryChart = document.getElementById('weekPrimaryChart');
const weekSecondaryChart = document.getElementById('weekSecondaryChart');
const durationChart = document.getElementById('durationChart');
const visitCountChart = document.getElementById('visitCountChart');
const weekPrimaryReadout = document.getElementById('weekPrimaryReadout');
const weekSecondaryReadout = document.getElementById('weekSecondaryReadout');
const durationReadout = document.getElementById('durationReadout');
const visitCountReadout = document.getElementById('visitCountReadout');
const weekPrimaryLegend = document.getElementById('weekPrimaryLegend');
const weekSecondaryLegend = document.getElementById('weekSecondaryLegend');
const dashboardWeekInput = document.getElementById('dashboardWeek');
const dashboardWeekNowBtn = document.getElementById('dashboardWeekNow');
const dashboardWeekLabel = document.getElementById('dashboardWeekLabel');
const visitCountGranularitySelect = document.getElementById('visitCountGranularity');
const focusName = document.getElementById('focusName');
const focusExerciseSelect = document.getElementById('focusExerciseSelect');
const focusChart = document.getElementById('focusChart');
const focusMetrics = document.getElementById('focusMetrics');
const focusStartNow = document.getElementById('focusStartNow');
const focusTable = document.getElementById('focusTable');
const focusEmpty = document.getElementById('focusEmpty');
const bodyweightChart = document.getElementById('bodyweightChart');
const bodyweightHint = document.getElementById('bodyweightHint');
const exportWeekPrimaryBtn = document.getElementById('exportWeekPrimaryBtn');
const exportWeekSecondaryBtn = document.getElementById('exportWeekSecondaryBtn');
const exportDurationBtn = document.getElementById('exportDurationBtn');
const exportFocusBtn = document.getElementById('exportFocusBtn');
const exportBodyweightBtn = document.getElementById('exportBodyweightBtn');
const progressDateInput = document.getElementById('progressDateInput');
const progressWeightInput = document.getElementById('progressWeightInput');
const progressPhotoInput = document.getElementById('progressPhotoInput');
const progressPhotoPreview = document.getElementById('progressPhotoPreview');
const progressWeekBadge = document.getElementById('progressWeekBadge');
const progressEntryTitle = document.getElementById('progressEntryTitle');
const progressEntryMeta = document.getElementById('progressEntryMeta');
const progressTimeline = document.getElementById('progressTimeline');
const progressEmpty = document.getElementById('progressEmpty');
const saveProgressEntryBtn = document.getElementById('saveProgressEntryBtn');
const analyzeProgressBtn = document.getElementById('analyzeProgressBtn');
const visionApiKeyInput = document.getElementById('visionApiKeyInput');
const visionModelSelect = document.getElementById('visionModelSelect');
const saveVisionSettingsBtn = document.getElementById('saveVisionSettingsBtn');
const visionStatus = document.getElementById('visionStatus');
const routineDayTabs = document.getElementById('routineDayTabs');
const routineOptionSelect = document.getElementById('routineOptionSelect');
const routineOptionNameInput = document.getElementById('routineOptionName');
const routineList = document.getElementById('routineList');
const routineEmpty = document.getElementById('routineEmpty');
const addRoutineExerciseBtn = document.getElementById('addRoutineExerciseBtn');
const addRoutineOptionBtn = document.getElementById('addRoutineOptionBtn');
const removeRoutineOptionBtn = document.getElementById('removeRoutineOptionBtn');
const saveRoutineDayBtn = document.getElementById('saveRoutineDayBtn');
const downloadRoutinesBtn = document.getElementById('downloadRoutinesBtn');
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
const targetSetRowTemplate = document.getElementById('targetSetRowTemplate');
const routineTemplate = document.getElementById('routineTemplate');

const state = {
  date: '',
  sessionName: '',
  bodyweight: '',
  startTime: '',
  endTime: '',
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

function createRoutineOption(dayKey = '', index = 1) {
  const label = getRoutineDayLabel(dayKey);
  return {
    id: uid(),
    name: dayKey ? `${label} - optie ${index}` : `Optie ${index}`,
    exercises: []
  };
}

function normalizeRoutineExercise(item) {
  return {
    id: item?.id || uid(),
    name: String(item?.name || '').trim(),
    notes: String(item?.notes || '').trim(),
    primaryGroup: sanitizeMuscleGroup(item?.primaryGroup) || sanitizeMuscleGroup(item?.primary) || '',
    secondaryGroups: normalizeSecondaryGroups(
      item?.secondaryGroups ?? item?.secondaryGroup ?? item?.secondary,
      sanitizeMuscleGroup(item?.primaryGroup) || sanitizeMuscleGroup(item?.primary) || ''
    )
  };
}

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
  const nextPage = page === 'log' || page === 'dashboard' || page === 'routines' || page === 'progress' || page === 'story' ? page : 'story';
  if (storyPage) storyPage.classList.toggle('active', nextPage === 'story');
  if (logPage) logPage.classList.toggle('active', nextPage === 'log');
  if (dashboardPage) dashboardPage.classList.toggle('active', nextPage === 'dashboard');
  if (progressPage) progressPage.classList.toggle('active', nextPage === 'progress');
  if (routinesPage) routinesPage.classList.toggle('active', nextPage === 'routines');
  if (pageStoryBtn) pageStoryBtn.classList.toggle('active', nextPage === 'story');
  if (pageLogBtn) pageLogBtn.classList.toggle('active', nextPage === 'log');
  if (pageDashboardBtn) pageDashboardBtn.classList.toggle('active', nextPage === 'dashboard');
  if (pageProgressBtn) pageProgressBtn.classList.toggle('active', nextPage === 'progress');
  if (pageRoutinesBtn) pageRoutinesBtn.classList.toggle('active', nextPage === 'routines');
  if (!options.skipPersist) {
    localStorage.setItem(UI_PAGE_KEY, nextPage);
  }
  if (!options.skipScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function getPreferredPage() {
  return 'story';
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
        secondaryGroups: item?.secondaryGroups ?? item?.secondary,
        nextTarget: item?.nextTarget
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

function persistCustomExerciseLibrary(items) {
  saveCustomExerciseLibrary(items);
  syncState.dirty = true;
  syncState.lastLocalChange = Date.now();
  syncState.lastChangedDate = state.date;
  syncState.lastChangedScope = 'meta';
  scheduleAutoSync();
  emitCloudChange('meta');
}

function normalizeProgressEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map(entry => {
      const date = normalizeDateValue(entry?.date);
      if (!date) return null;
      return {
        id: String(entry?.id || uid()),
        date,
        bodyweight: entry?.bodyweight ?? '',
        imageData: typeof entry?.imageData === 'string' ? entry.imageData : '',
        aiSummary: typeof entry?.aiSummary === 'string' ? entry.aiSummary : '',
        aiHeadline: typeof entry?.aiHeadline === 'string' ? entry.aiHeadline : '',
        aiObservations: Array.isArray(entry?.aiObservations) ? entry.aiObservations.map(item => String(item || '').trim()).filter(Boolean) : [],
        aiVerdict: typeof entry?.aiVerdict === 'string' ? entry.aiVerdict : '',
        analyzedAt: Number(entry?.analyzedAt) || 0,
        updatedAt: Number(entry?.updatedAt) || 0
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function loadProgressEntries() {
  const raw = localStorage.getItem(PROGRESS_ENTRIES_KEY);
  if (!raw) return [];
  try {
    return normalizeProgressEntries(JSON.parse(raw));
  } catch {
    return [];
  }
}

function saveProgressEntries(entries) {
  localStorage.setItem(PROGRESS_ENTRIES_KEY, JSON.stringify(normalizeProgressEntries(entries)));
}

function loadVisionSettings() {
  const raw = localStorage.getItem(VISION_SETTINGS_KEY);
  if (!raw) return { apiKey: '', model: 'gpt-4.1-mini' };
  try {
    const parsed = JSON.parse(raw);
    return {
      apiKey: String(parsed?.apiKey || '').trim(),
      model: String(parsed?.model || 'gpt-4.1-mini').trim() || 'gpt-4.1-mini'
    };
  } catch {
    return { apiKey: '', model: 'gpt-4.1-mini' };
  }
}

function saveVisionSettings(settings) {
  localStorage.setItem(VISION_SETTINGS_KEY, JSON.stringify({
    apiKey: String(settings?.apiKey || '').trim(),
    model: String(settings?.model || 'gpt-4.1-mini').trim() || 'gpt-4.1-mini'
  }));
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
    const rawValue = data[day.key];
    const list = Array.isArray(rawValue) ? rawValue : [];
    const isOptionShape = list.some(item => Array.isArray(item?.exercises));

    if (isOptionShape) {
      normalized[day.key] = list.map((option, index) => ({
        id: option?.id || uid(),
        name: String(option?.name || '').trim() || createRoutineOption(day.key, index + 1).name,
        exercises: Array.isArray(option?.exercises)
          ? option.exercises.map(normalizeRoutineExercise)
          : []
      }));
      return;
    }

    if (list.length) {
      normalized[day.key] = [{
        id: uid(),
        name: createRoutineOption(day.key, 1).name,
        exercises: list.map(normalizeRoutineExercise)
      }];
    }
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

function loadRoutineOptionSelectionMap() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ROUTINE_OPTION_UI_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveRoutineOptionSelectionMap(map) {
  localStorage.setItem(ROUTINE_OPTION_UI_KEY, JSON.stringify(map || {}));
}

function getStoredRoutineOptionId(dayKey, routines = loadRoutines()) {
  const options = routines?.[dayKey] || [];
  if (!options.length) return '';
  const selectionMap = loadRoutineOptionSelectionMap();
  const selected = selectionMap?.[dayKey] || '';
  if (options.some(option => option.id === selected)) return selected;
  return options[0]?.id || '';
}

function setStoredRoutineOptionId(dayKey, optionId) {
  const selectionMap = loadRoutineOptionSelectionMap();
  if (!optionId) delete selectionMap[dayKey];
  else selectionMap[dayKey] = optionId;
  saveRoutineOptionSelectionMap(selectionMap);
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

function populateRoutineSourceOptionSelect(routines, dayKey, preferredOptionId = '') {
  if (!routineSourceOptionSelect) return '';
  const options = routines?.[dayKey] || [];
  routineSourceOptionSelect.innerHTML = '';

  if (!options.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Geen vaste optie';
    routineSourceOptionSelect.appendChild(option);
    routineSourceOptionSelect.disabled = true;
    routineSourceOptionSelect.value = '';
    return '';
  }

  options.forEach(optionData => {
    const option = document.createElement('option');
    option.value = optionData.id;
    option.textContent = optionData.name || 'Optie';
    routineSourceOptionSelect.appendChild(option);
  });

  routineSourceOptionSelect.disabled = false;
  const selected = options.some(option => option.id === preferredOptionId)
    ? preferredOptionId
    : options[0]?.id || '';
  routineSourceOptionSelect.value = selected;
  return selected;
}

function getSelectedRoutineSourceOptionId(routines = loadRoutines(), dayKey = getSelectedRoutineSourceDay()) {
  const options = routines?.[dayKey] || [];
  if (!options.length) return '';
  const selected = routineSourceOptionSelect?.value || '';
  if (options.some(option => option.id === selected)) return selected;
  return options[0]?.id || '';
}

function updateRoutineApplyButton(options = {}) {
  populateRoutineSourceDaySelect();
  const routines = options.routines || loadRoutines();
  const targetKey = options.syncSelect === true
    ? getRoutineDayKeyFromDate(state.date || todayISO())
    : getSelectedRoutineSourceDay();

  if (routineSourceDaySelect) {
    routineSourceDaySelect.value = targetKey;
  }
  const selectedOptionId = populateRoutineSourceOptionSelect(
    routines,
    targetKey,
    options.optionId || getSelectedRoutineSourceOptionId(routines, targetKey)
  );
  if (!addRoutineToDayBtn) return;
  const label = getRoutineDayLabel(targetKey).toLowerCase();
  const optionName = (routines[targetKey] || []).find(option => option.id === selectedOptionId)?.name || '';
  addRoutineToDayBtn.textContent = optionName
    ? `Voeg ${optionName} van ${label} toe`
    : `Voeg vaste oefeningen van ${label} toe`;
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
      splitWeightMode: !!ex?.splitWeightMode || (Array.isArray(ex?.sets) && ex.sets.some(set => (set?.weightMode === 'split') || (set?.leftWeight ?? '') !== '' || (set?.rightWeight ?? '') !== '')),
      sets: Array.isArray(ex?.sets)
        ? ex.sets.map(set => ({
          id: set?.id || uid(),
          reps: set?.reps ?? '',
          leftReps: set?.leftReps ?? '',
          rightReps: set?.rightReps ?? '',
          weight: set?.weight ?? '',
          leftWeight: set?.leftWeight ?? '',
          rightWeight: set?.rightWeight ?? '',
          weightMode: set?.weightMode || (((set?.leftWeight ?? '') !== '' || (set?.rightWeight ?? '') !== '') ? 'split' : 'single'),
          rpe: set?.rpe ?? '',
          done: !!set?.done
        }))
        : []
    }));

    if (!normalized[date]) {
      normalized[date] = {
        sessionName: day.sessionName || '',
        bodyweight: day.bodyweight ?? '',
        startTime: typeof day.startTime === 'string' ? day.startTime : '',
        endTime: typeof day.endTime === 'string' ? day.endTime : '',
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
    if (!normalized[date].startTime && day.startTime) {
      normalized[date].startTime = day.startTime;
    }
    if (!normalized[date].endTime && day.endTime) {
      normalized[date].endTime = day.endTime;
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
    startTime: state.startTime,
    endTime: state.endTime,
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
  state.startTime = day?.startTime || '';
  state.endTime = day?.endTime || '';
  state.updatedAt = Number(day?.updatedAt) || 0;
  state.exercises = (day?.exercises || []).map(ex => ({
    id: ex.id || uid(),
    name: ex.name || '',
    notes: ex.notes || '',
    primaryGroup: sanitizeMuscleGroup(ex.primaryGroup) || '',
    secondaryGroups: normalizeSecondaryGroups(ex.secondaryGroups ?? ex.secondaryGroup, sanitizeMuscleGroup(ex.primaryGroup) || ''),
    splitWeightMode: !!ex.splitWeightMode || (Array.isArray(ex.sets) && ex.sets.some(set => (set?.weightMode === 'split') || (set?.leftWeight ?? '') !== '' || (set?.rightWeight ?? '') !== '')),
    sets: (ex.sets || []).map(set => ({
      id: set.id || uid(),
      reps: set.reps ?? '',
      leftReps: set.leftReps ?? '',
      rightReps: set.rightReps ?? '',
      weight: set.weight ?? '',
      leftWeight: set.leftWeight ?? '',
      rightWeight: set.rightWeight ?? '',
      weightMode: set.weightMode || (((set.leftWeight ?? '') !== '' || (set.rightWeight ?? '') !== '') ? 'split' : 'single'),
      rpe: set.rpe ?? '',
      done: !!set.done
    }))
  }));

  sessionNameInput.value = state.sessionName;
  if (bodyweightInput) bodyweightInput.value = state.bodyweight === '' ? '' : state.bodyweight;
  if (startTimeInput) startTimeInput.value = state.startTime || '';
  if (endTimeInput) endTimeInput.value = state.endTime || '';
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
    splitWeightMode: false,
    sets: [newSet()]
  };
  state.exercises.push(exercise);
  activeExerciseId = exercise.id;
  renderExercises();
  persist();
}

function newSet(seed) {
  const inferredMode = seed?.weightMode === 'split'
    || (seed?.weightMode !== 'single' && ((seed?.leftWeight ?? '') !== '' || (seed?.rightWeight ?? '') !== ''))
    ? 'split'
    : 'single';
  return {
    id: uid(),
    reps: seed?.reps ?? '',
    leftReps: seed?.leftReps ?? '',
    rightReps: seed?.rightReps ?? '',
    weight: seed?.weight ?? '',
    leftWeight: seed?.leftWeight ?? '',
    rightWeight: seed?.rightWeight ?? '',
    weightMode: inferredMode,
    rpe: seed?.rpe ?? '',
    done: false
  };
}

function normalizeTargetSet(seed) {
  const inferredMode = seed?.weightMode === 'split'
    || (seed?.weightMode !== 'single' && (
      (seed?.leftWeight ?? '') !== ''
      || (seed?.rightWeight ?? '') !== ''
      || (seed?.leftReps ?? '') !== ''
      || (seed?.rightReps ?? '') !== ''
    ))
    ? 'split'
    : 'single';
  return {
    id: String(seed?.id || uid()),
    reps: seed?.reps ?? '',
    leftReps: seed?.leftReps ?? '',
    rightReps: seed?.rightReps ?? '',
    weight: seed?.weight ?? '',
    leftWeight: seed?.leftWeight ?? '',
    rightWeight: seed?.rightWeight ?? '',
    weightMode: inferredMode
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
  const nextTarget = normalizeExerciseTarget(profile?.nextTarget);

  if (!profile) {
    exercise.primaryGroup = '';
    exercise.secondaryGroups = [];
    if (selectInput) selectInput.value = '';
    if (primarySelect) primarySelect.value = 'Automatisch';
    renderSecondaryPicker(secondaryPicker, [], '', 'exercise-secondary');
    renderNextTargetInputs(card, null);
    return { didPrefill: false };
  }

  exercise.name = profile.name;
  exercise.primaryGroup = profile.primary || '';
  exercise.secondaryGroups = normalizeSecondaryGroups(profile.secondaryGroups ?? profile.secondary, exercise.primaryGroup);
  const didPrefill = applyExerciseTargetIfNeeded(exercise, nextTarget);

  if (nameInput) nameInput.value = exercise.name;
  if (selectInput) {
    const exact = (catalog || []).find(item => normalizeExerciseName(item.name) === normalizeExerciseName(exercise.name));
    selectInput.value = exact ? exact.name : '';
  }
  if (primarySelect) primarySelect.value = exercise.primaryGroup || 'Automatisch';
  renderSecondaryPicker(secondaryPicker, exercise.secondaryGroups, exercise.primaryGroup, 'exercise-secondary');
  renderNextTargetInputs(card, nextTarget);
  return { didPrefill };
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
  const currentLibrary = loadCustomExerciseLibrary();
  const existing = currentLibrary.find(item => normalizeExerciseName(item.name) === key);
  if (existing?.nextTarget) {
    profile.nextTarget = normalizeExerciseTarget(existing.nextTarget);
  }
  const library = currentLibrary.filter(item => normalizeExerciseName(item.name) !== key);

  library.push(profile);
  library.sort((a, b) => a.name.localeCompare(b.name, 'nl-NL'));
  persistCustomExerciseLibrary(library);
  return true;
}

function upsertExerciseLibraryProfile(profile) {
  const normalized = normalizeExerciseProfile(profile);
  if (!normalized.name) return false;
  const key = normalizeExerciseName(normalized.name);
  const library = loadCustomExerciseLibrary().filter(item => normalizeExerciseName(item.name) !== key);
  library.push(normalized);
  library.sort((a, b) => a.name.localeCompare(b.name, 'nl-NL'));
  persistCustomExerciseLibrary(library);
  return true;
}

function saveExerciseNextTarget(exercise, card) {
  if (!exercise || !card) return { ok: false, message: 'Geen oefening gevonden.' };
  const name = String(exercise.name || '').trim();
  if (!name) return { ok: false, message: 'Geef eerst een naam aan je oefening.' };

  const target = readNextTargetFromCard(card, !!exercise.splitWeightMode);
  if (!hasExerciseTarget(target)) {
    return { ok: false, message: 'Vul voor je volgende keer minstens sets en reps of gewicht in.' };
  }

  const baseProfile = getAutoExerciseProfile(name, getExerciseCatalog(getCurrentDataSnapshot())) || buildExerciseProfileFromExercise(exercise) || {
    name,
    primary: resolveExerciseMuscles(exercise).primary,
    secondaryGroups: resolveExerciseMuscles(exercise).secondaryGroups
  };

  const saved = upsertExerciseLibraryProfile({
    ...baseProfile,
    name,
    primary: resolveExerciseMuscles(exercise).primary,
    secondaryGroups: resolveExerciseMuscles(exercise).secondaryGroups,
    nextTarget: target
  });

  return saved
    ? { ok: true, message: 'Target opgeslagen.' }
    : { ok: false, message: 'Kon je target niet opslaan.' };
}

function hasInputValue(value) {
  return value !== '' && value !== null && value !== undefined;
}

function getNumericField(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && `${value}` !== '' ? numeric : null;
}

function usesSplitWeight(set, exerciseOrMode = null) {
  if (typeof exerciseOrMode === 'boolean') return exerciseOrMode;
  if (typeof exerciseOrMode === 'string') return exerciseOrMode === 'split';
  if (exerciseOrMode && typeof exerciseOrMode === 'object' && 'splitWeightMode' in exerciseOrMode) {
    return !!exerciseOrMode.splitWeightMode;
  }
  if (set?.weightMode) return set.weightMode === 'split';
  return hasInputValue(set?.leftWeight) || hasInputValue(set?.rightWeight);
}

function getSetWeightData(set, exerciseOrMode = null) {
  const splitMode = usesSplitWeight(set, exerciseOrMode);
  if (splitMode) {
    const left = getNumericField(set?.leftWeight);
    const right = getNumericField(set?.rightWeight);
    return {
      splitMode: true,
      left,
      right,
      total: (left || 0) + (right || 0),
      hasWeight: left !== null || right !== null
    };
  }

  const weight = getNumericField(set?.weight);
  return {
    splitMode: false,
    weight,
    total: weight || 0,
    hasWeight: weight !== null
  };
}

function getSetRepData(set, exerciseOrMode = null) {
  const splitMode = usesSplitWeight(set, exerciseOrMode);
  if (splitMode) {
    const left = getNumericField(set?.leftReps);
    const right = getNumericField(set?.rightReps);
    return {
      splitMode: true,
      left,
      right,
      total: (left || 0) + (right || 0),
      hasReps: left !== null || right !== null
    };
  }

  const reps = getNumericField(set?.reps);
  return {
    splitMode: false,
    reps,
    total: reps || 0,
    hasReps: reps !== null
  };
}

function formatSetLoad(set, exerciseOrMode = null, includeUnit = false) {
  const weightData = getSetWeightData(set, exerciseOrMode);
  if (!weightData.hasWeight) return '';

  let label = '';
  if (weightData.splitMode) {
    const left = weightData.left !== null ? `${formatNumber(weightData.left)}L` : '-L';
    const right = weightData.right !== null ? `${formatNumber(weightData.right)}R` : '-R';
    label = `${left}/${right}`;
  } else {
    label = formatNumber(weightData.weight);
  }

  return includeUnit ? `${label} kg` : label;
}

function syncExerciseSplitMode(exercise, splitMode) {
  exercise.splitWeightMode = !!splitMode;
  (exercise.sets || []).forEach(set => {
    set.weightMode = exercise.splitWeightMode ? 'split' : 'single';
    if (exercise.splitWeightMode && hasInputValue(set.weight)) {
      if (!hasInputValue(set.leftWeight)) set.leftWeight = set.weight;
      if (!hasInputValue(set.rightWeight)) set.rightWeight = set.weight;
    }
    if (exercise.splitWeightMode && hasInputValue(set.reps)) {
      if (!hasInputValue(set.leftReps)) set.leftReps = set.reps;
      if (!hasInputValue(set.rightReps)) set.rightReps = set.reps;
    }
    if (!exercise.splitWeightMode) {
      if (!hasInputValue(set.weight)) set.weight = set.leftWeight || set.rightWeight || '';
      if (!hasInputValue(set.reps)) set.reps = set.leftReps || set.rightReps || '';
    }
  });
}

function renderNextTargetInputs(card, target = null) {
  if (!card) return;
  const normalized = normalizeExerciseTarget(target);
  const fieldMap = {
    '.next-target-count': normalized.count,
    '.next-target-left-count': normalized.leftCount,
    '.next-target-right-count': normalized.rightCount,
    '.next-target-reps': normalized.reps,
    '.next-target-left-reps': normalized.leftReps,
    '.next-target-right-reps': normalized.rightReps,
    '.next-target-weight': normalized.weight,
    '.next-target-left-weight': normalized.leftWeight,
    '.next-target-right-weight': normalized.rightWeight
  };

  Object.entries(fieldMap).forEach(([selector, value]) => {
    const input = card.querySelector(selector);
    if (input) input.value = value ?? '';
  });

  const detailedToggle = card.querySelector('.next-target-detailed-toggle');
  if (detailedToggle) detailedToggle.checked = isDetailedExerciseTarget(normalized);
  card.classList.toggle('is-target-detailed', isDetailedExerciseTarget(normalized));
  renderTargetSetRows(card, normalized.targetSets, normalized.splitMode, isDetailedExerciseTarget(normalized));
}

function appendTargetSetRow(card, set, index) {
  const body = card?.querySelector('.target-sets-body');
  if (!body || !targetSetRowTemplate) return;
  const row = targetSetRowTemplate.content.firstElementChild.cloneNode(true);
  row.dataset.id = set.id || uid();
  row.querySelector('.target-set-index').textContent = index + 1;
  row.querySelector('.target-set-reps').value = set.reps ?? '';
  row.querySelector('.target-set-left-reps').value = set.leftReps ?? '';
  row.querySelector('.target-set-weight').value = set.weight ?? '';
  row.querySelector('.target-set-right-reps').value = set.rightReps ?? '';
  row.querySelector('.target-set-left-weight').value = set.leftWeight ?? '';
  row.querySelector('.target-set-right-weight').value = set.rightWeight ?? '';
  body.appendChild(row);
}

function getTargetSetRows(card) {
  return Array.from(card?.querySelectorAll('.target-set-row') || []);
}

function renumberTargetSetRows(card) {
  getTargetSetRows(card).forEach((row, index) => {
    const label = row.querySelector('.target-set-index');
    if (label) label.textContent = index + 1;
  });
}

function renderTargetSetRows(card, sets = [], splitMode = false, ensureRow = false) {
  const body = card?.querySelector('.target-sets-body');
  if (!body) return;
  body.innerHTML = '';
  const normalizedSets = (sets || []).map(normalizeTargetSet).filter(set => !isBlankSet(set));
  const rowsToRender = normalizedSets.length
    ? normalizedSets
    : (ensureRow ? [normalizeTargetSet({ weightMode: splitMode ? 'split' : 'single' })] : []);
  rowsToRender.forEach((set, index) => appendTargetSetRow(card, set, index));
  renumberTargetSetRows(card);
}

function readTargetSetsFromCard(card, splitMode = false) {
  return getTargetSetRows(card)
    .map(row => normalizeTargetSet({
      id: row.dataset.id || uid(),
      reps: row.querySelector('.target-set-reps')?.value ?? '',
      leftReps: row.querySelector('.target-set-left-reps')?.value ?? '',
      rightReps: row.querySelector('.target-set-right-reps')?.value ?? '',
      weight: row.querySelector('.target-set-weight')?.value ?? '',
      leftWeight: row.querySelector('.target-set-left-weight')?.value ?? '',
      rightWeight: row.querySelector('.target-set-right-weight')?.value ?? '',
      weightMode: splitMode
        ? 'split'
        : (`${row.querySelector('.target-set-left-weight')?.value ?? ''}` !== '' || `${row.querySelector('.target-set-right-weight')?.value ?? ''}` !== ''
          ? 'split'
          : 'single')
    }))
    .filter(set => !isBlankSet(set));
}

function readNextTargetFromCard(card, splitMode) {
  const detailed = !!card.querySelector('.next-target-detailed-toggle')?.checked;
  if (detailed) {
    return normalizeExerciseTarget({
      mode: 'detailed',
      splitMode,
      targetSets: readTargetSetsFromCard(card, splitMode)
    });
  }

  return normalizeExerciseTarget({
    mode: 'simple',
    splitMode,
    count: card.querySelector('.next-target-count')?.value ?? '',
    leftCount: card.querySelector('.next-target-left-count')?.value ?? '',
    rightCount: card.querySelector('.next-target-right-count')?.value ?? '',
    reps: card.querySelector('.next-target-reps')?.value ?? '',
    leftReps: card.querySelector('.next-target-left-reps')?.value ?? '',
    rightReps: card.querySelector('.next-target-right-reps')?.value ?? '',
    weight: card.querySelector('.next-target-weight')?.value ?? '',
    leftWeight: card.querySelector('.next-target-left-weight')?.value ?? '',
    rightWeight: card.querySelector('.next-target-right-weight')?.value ?? ''
  });
}

function buildSetsFromExerciseTarget(target) {
  const normalized = normalizeExerciseTarget(target);
  if (!hasExerciseTarget(normalized)) return [];

  if (normalized.targetSets.length) {
    return normalized.targetSets
      .filter(set => !isBlankSet(set))
      .map(set => newSet({
        reps: set.reps ?? '',
        leftReps: set.leftReps ?? '',
        rightReps: set.rightReps ?? '',
        weight: set.weight ?? '',
        leftWeight: set.leftWeight ?? '',
        rightWeight: set.rightWeight ?? '',
        weightMode: usesSplitWeight(set, set.weightMode) ? 'split' : 'single'
      }));
  }

  if (normalized.splitMode) {
    const leftCount = Number(normalized.leftCount || 0);
    const rightCount = Number(normalized.rightCount || 0);
    return Array.from({ length: Math.max(leftCount, rightCount) }, (_, index) => newSet({
      leftReps: index < leftCount ? normalized.leftReps : '',
      rightReps: index < rightCount ? normalized.rightReps : '',
      leftWeight: index < leftCount ? normalized.leftWeight : '',
      rightWeight: index < rightCount ? normalized.rightWeight : '',
      weightMode: 'split'
    }));
  }

  const count = Number(normalized.count || 0);
  return Array.from({ length: count }, () => newSet({
    reps: normalized.reps,
    weight: normalized.weight,
    weightMode: 'single'
  }));
}

function shouldPrefillExerciseTarget(exercise) {
  return !exercise
    || !Array.isArray(exercise.sets)
    || exercise.sets.length === 0
    || (exercise.sets.length === 1 && isBlankSet(exercise.sets[0]));
}

function applyExerciseTargetIfNeeded(exercise, target) {
  const normalized = normalizeExerciseTarget(target);
  if (!exercise || !hasExerciseTarget(normalized) || !shouldPrefillExerciseTarget(exercise)) return false;
  const generatedSets = buildSetsFromExerciseTarget(normalized);
  if (!generatedSets.length) return false;
  exercise.splitWeightMode = !!normalized.splitMode;
  exercise.sets = generatedSets;
  return true;
}

function isBlankSet(set) {
  return !set
    || ((set.reps ?? '') === ''
      && (set.leftReps ?? '') === ''
      && (set.rightReps ?? '') === ''
      && (set.weight ?? '') === ''
      && (set.leftWeight ?? '') === ''
      && (set.rightWeight ?? '') === ''
      && (set.rpe ?? '') === ''
      && !set.done);
}

function applyQuickSetBuilder(exId, card) {
  const exercise = state.exercises.find(ex => ex.id === exId);
  if (!exercise || !card) return;

  const count = Number(card.querySelector('.quick-set-count')?.value || 0);
  const leftCount = Number(card.querySelector('.quick-set-left-count')?.value || 0);
  const rightCount = Number(card.querySelector('.quick-set-right-count')?.value || 0);
  const reps = card.querySelector('.quick-set-reps')?.value ?? '';
  const leftReps = card.querySelector('.quick-set-left-reps')?.value ?? '';
  const rightReps = card.querySelector('.quick-set-right-reps')?.value ?? '';
  const weight = card.querySelector('.quick-set-weight')?.value ?? '';
  const leftWeight = card.querySelector('.quick-set-left-weight')?.value ?? '';
  const rightWeight = card.querySelector('.quick-set-right-weight')?.value ?? '';
  const rpe = card.querySelector('.quick-set-rpe')?.value ?? '';
  const splitMode = !!exercise.splitWeightMode;

  if (!splitMode && (!Number.isFinite(count) || count < 1)) {
    alert('Vul eerst in hoeveel sets je wilt maken.');
    return;
  }

  if (splitMode && (!Number.isFinite(leftCount) || leftCount < 0 || !Number.isFinite(rightCount) || rightCount < 0 || (leftCount < 1 && rightCount < 1))) {
    alert('Vul in split-modus minstens 1 set links of rechts in.');
    return;
  }

  const hasWeightInput = splitMode
    ? `${leftWeight}` !== '' || `${rightWeight}` !== ''
    : `${weight}` !== '';
  const hasRepsInput = splitMode
    ? `${leftReps}` !== '' || `${rightReps}` !== ''
    : `${reps}` !== '';

  if (!hasRepsInput && !hasWeightInput && `${rpe}` === '') {
    alert('Vul minstens reps, gewicht of RPE in voor je sets.');
    return;
  }

  const generatedSets = splitMode
    ? Array.from({ length: Math.max(leftCount, rightCount) }, (_, index) => newSet({
      leftReps: index < leftCount ? leftReps : '',
      rightReps: index < rightCount ? rightReps : '',
      leftWeight: index < leftCount ? leftWeight : '',
      rightWeight: index < rightCount ? rightWeight : '',
      weightMode: 'split',
      rpe
    }))
    : Array.from({ length: count }, () => newSet({
      reps,
      weight,
      leftWeight,
      rightWeight,
      weightMode: 'single',
      rpe
    }));
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
  const all = loadAll();
  all[state.date] = cloneState();

  if (!state.exercises.length) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  state.exercises.forEach(exercise => {
    const card = exerciseTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = exercise.id;
    if (exercise.id === activeExerciseId) card.classList.add('active');
    card.classList.toggle('is-split-mode', !!exercise.splitWeightMode);

    const nameInput = card.querySelector('.exercise-name');
    const selectInput = card.querySelector('.exercise-select');
    const notesInput = card.querySelector('.exercise-notes');
    const primarySelect = card.querySelector('.exercise-primary');
    const secondaryPicker = card.querySelector('.exercise-secondary-picker');
    const previousSessionEl = card.querySelector('.exercise-last-session');
    const splitModeInput = card.querySelector('.exercise-split-mode');
    nameInput.value = exercise.name;
    populateExerciseSelect(selectInput, catalog, exercise.name);
    notesInput.value = exercise.notes;
    if (splitModeInput) splitModeInput.checked = !!exercise.splitWeightMode;
    populateMuscleSelect(primarySelect, MUSCLE_SELECT_OPTIONS);
    const displayProfile = getAutoExerciseProfile(exercise.name, catalog);
    primarySelect.value = exercise.primaryGroup || displayProfile?.primary || 'Automatisch';
    renderSecondaryPicker(
      secondaryPicker,
      exercise.secondaryGroups?.length ? exercise.secondaryGroups : (displayProfile?.secondaryGroups || []),
      exercise.primaryGroup || displayProfile?.primary || '',
      'exercise-secondary'
    );
    card.classList.toggle('is-target-detailed', isDetailedExerciseTarget(displayProfile?.nextTarget));
    renderNextTargetInputs(card, displayProfile?.nextTarget || null);

    const previousSession = findLatestPreviousExerciseSession(exercise.name, state.date, all);
    if (previousSessionEl) {
      if (previousSession) {
        previousSessionEl.innerHTML = `
          <span class="label">Laatste keer</span>
          <span class="date">${formatLongDate(previousSession.date)}</span>
          <span class="sets">${formatFocusSetsDetail(previousSession.sets)}</span>
          <span class="sub">Totaal volume: ${formatNumber(previousSession.volume)} kg</span>
        `;
      } else {
        previousSessionEl.innerHTML = `
          <span class="label">Laatste keer</span>
          <span class="sub">Nog geen eerdere sessie gevonden.</span>
        `;
      }
    }

    const setsBody = card.querySelector('.sets-body');
    exercise.sets.forEach((set, index) => {
      const row = setRowTemplate.content.firstElementChild.cloneNode(true);
      row.dataset.id = set.id;
      row.querySelector('.set-index').textContent = index + 1;
      row.querySelector('.set-reps').value = set.reps;
      row.querySelector('.set-left-reps').value = set.leftReps ?? '';
      row.querySelector('.set-weight').value = set.weight;
      row.querySelector('.set-right-reps').value = set.rightReps ?? '';
      row.querySelector('.set-left-weight').value = set.leftWeight ?? '';
      row.querySelector('.set-right-weight').value = set.rightWeight ?? '';
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
    const savedName = (routines[selectedRoutineDay] || []).find(option => option.id === selectedRoutineOptionId)?.name || 'deze optie';
    routineSaveHint.textContent = `${savedName} voor ${getRoutineDayLabel(selectedRoutineDay).toLowerCase()} is opgeslagen.`;
  }
  flashButtonLabel(saveRoutineDayBtn, 'Opgeslagen', 1100);
}

function setSelectedRoutineDay(dayKey, options = {}) {
  selectedRoutineDay = ROUTINE_DAYS.some(day => day.key === dayKey) ? dayKey : 'monday';
  if (!options.skipPersist) {
    localStorage.setItem(ROUTINE_UI_KEY, selectedRoutineDay);
  }
  const routines = loadRoutines();
  selectedRoutineOptionId = getStoredRoutineOptionId(selectedRoutineDay, routines);
  renderRoutinePage();
}

function setSelectedRoutineOption(optionId, options = {}) {
  selectedRoutineOptionId = optionId || '';
  setStoredRoutineOptionId(selectedRoutineDay, selectedRoutineOptionId);
  if (!options.skipRender) renderRoutinePage();
}

function ensureRoutineOption(routines, dayKey, options = {}) {
  const dayOptions = routines[dayKey] || (routines[dayKey] = []);
  let option = dayOptions.find(entry => entry.id === selectedRoutineOptionId);

  if (!option && dayOptions.length) {
    option = dayOptions[0];
  }

  if (!option && options.createIfMissing) {
    option = createRoutineOption(dayKey, dayOptions.length + 1);
    dayOptions.push(option);
  }

  if (option) {
    selectedRoutineOptionId = option.id;
    setStoredRoutineOptionId(dayKey, option.id);
  }

  return option || null;
}

function renderRoutinePage() {
  if (!routineDayTabs || !routineList || !routineEmpty) return;

  const routines = loadRoutines();
  const catalog = getExerciseCatalog(getCurrentDataSnapshot());

  routineDayTabs.innerHTML = '';
  ROUTINE_DAYS.forEach(day => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = day.key === selectedRoutineDay ? 'day-chip active' : 'day-chip';
    button.dataset.day = day.key;
    button.textContent = day.label;
    routineDayTabs.appendChild(button);
  });

  const dayOptions = routines[selectedRoutineDay] || [];
  selectedRoutineOptionId = getStoredRoutineOptionId(selectedRoutineDay, routines);
  const currentOption = dayOptions.find(option => option.id === selectedRoutineOptionId) || null;

  if (routineOptionSelect) {
    routineOptionSelect.innerHTML = '';
    if (!dayOptions.length) {
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = 'Nog geen opties';
      routineOptionSelect.appendChild(emptyOption);
      routineOptionSelect.disabled = true;
    } else {
      dayOptions.forEach(option => {
        const optionEl = document.createElement('option');
        optionEl.value = option.id;
        optionEl.textContent = option.name || 'Optie';
        routineOptionSelect.appendChild(optionEl);
      });
      routineOptionSelect.disabled = false;
      routineOptionSelect.value = currentOption?.id || dayOptions[0]?.id || '';
    }
  }

  if (routineOptionNameInput) {
    routineOptionNameInput.disabled = !currentOption;
    routineOptionNameInput.value = currentOption?.name || '';
  }
  if (removeRoutineOptionBtn) {
    removeRoutineOptionBtn.disabled = !currentOption;
  }

  routineList.innerHTML = '';
  const items = currentOption?.exercises || [];
  routineEmpty.style.display = items.length ? 'none' : 'block';
  if (routineEmpty) {
    routineEmpty.innerHTML = currentOption
      ? '<p>Deze optie heeft nog geen vaste oefeningen ingesteld.</p>'
      : '<p>Voor deze dag heb je nog geen routine-opties ingesteld.</p>';
  }

  if (routineSaveHint) {
    if (!currentOption) {
      routineSaveHint.textContent = `Voeg eerst een routine-optie toe voor ${getRoutineDayLabel(selectedRoutineDay).toLowerCase()}.`;
    } else {
      routineSaveHint.textContent = `Klik op opslaan om ${currentOption.name} voor ${getRoutineDayLabel(selectedRoutineDay).toLowerCase()} te bevestigen.`;
    }
  }

  items.forEach(item => {
    const card = routineTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = item.id;

    const selectInput = card.querySelector('.routine-select');
    const nameInput = card.querySelector('.routine-name');
    const notesInput = card.querySelector('.routine-notes');
    const primarySelect = card.querySelector('.routine-primary');
    const secondaryPicker = card.querySelector('.routine-secondary-picker');

    populateExerciseSelect(selectInput, catalog, item.name);
    nameInput.value = item.name;
    if (notesInput) notesInput.value = item.notes || '';
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

  updateRoutineApplyButton({
    routines,
    optionId: getSelectedRoutineSourceDay() === selectedRoutineDay ? getSelectedRoutineSourceOptionId(routines, selectedRoutineDay) : undefined
  });
}

function addRoutineExercise() {
  const routines = loadRoutines();
  const option = ensureRoutineOption(routines, selectedRoutineDay, { createIfMissing: true });
  option.exercises.push({
    id: uid(),
    name: '',
    notes: '',
    primaryGroup: '',
    secondaryGroups: []
  });
  persistRoutines(routines);
  requestAnimationFrame(() => {
    const lastInput = routineList?.querySelector('.routine-card:last-child .routine-name');
    if (lastInput) lastInput.focus();
  });
}

function addRoutineOption() {
  const routines = loadRoutines();
  const nextOption = createRoutineOption(selectedRoutineDay, (routines[selectedRoutineDay] || []).length + 1);
  routines[selectedRoutineDay].push(nextOption);
  selectedRoutineOptionId = nextOption.id;
  setStoredRoutineOptionId(selectedRoutineDay, nextOption.id);
  persistRoutines(routines);
  requestAnimationFrame(() => {
    if (routineOptionNameInput) routineOptionNameInput.focus();
  });
}

function removeRoutineOption() {
  const routines = loadRoutines();
  const dayOptions = routines[selectedRoutineDay] || [];
  if (!selectedRoutineOptionId || !dayOptions.some(option => option.id === selectedRoutineOptionId)) return;

  const nextOptions = dayOptions.filter(option => option.id !== selectedRoutineOptionId);
  routines[selectedRoutineDay] = nextOptions;
  const fallbackId = nextOptions[0]?.id || '';
  selectedRoutineOptionId = fallbackId;
  setStoredRoutineOptionId(selectedRoutineDay, fallbackId);
  persistRoutines(routines);
}

function removeRoutineExercise(routineId) {
  const routines = loadRoutines();
  const option = ensureRoutineOption(routines, selectedRoutineDay);
  if (!option) return;
  option.exercises = (option.exercises || []).filter(item => item.id !== routineId);
  persistRoutines(routines);
}

function handleRoutineInputChange(target) {
  const card = target.closest('.routine-card');
  const routines = loadRoutines();
  const option = ensureRoutineOption(routines, selectedRoutineDay);

  if (target === routineOptionNameInput && option) {
    option.name = String(target.value || '').trim();
    if (!option.name) {
      option.name = createRoutineOption(selectedRoutineDay, 1).name;
      target.value = option.name;
    }
    persistRoutines(routines, { rerenderRoutine: false });
    if (routineOptionSelect) {
      const selectedOption = Array.from(routineOptionSelect.options).find(entry => entry.value === option.id);
      if (selectedOption) selectedOption.textContent = option.name;
    }
    if (routineSaveHint) {
      routineSaveHint.textContent = `Klik op opslaan om ${option.name} voor ${getRoutineDayLabel(selectedRoutineDay).toLowerCase()} te bevestigen.`;
    }
    if (routineSourceDaySelect && getSelectedRoutineSourceDay() === selectedRoutineDay) {
      updateRoutineApplyButton({ routines, optionId: option.id });
    }
    return;
  }

  if (!card || !option) return;

  const item = (option.exercises || []).find(entry => entry.id === card.dataset.id);
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

  if (target.classList.contains('routine-notes')) {
    item.notes = target.value;
  }

  persistRoutines(routines, { rerenderRoutine: false });
}

function addRoutineExercisesToCurrentDay() {
  const routines = loadRoutines();
  const catalog = getExerciseCatalog(getCurrentDataSnapshot());
  const dayKey = getSelectedRoutineSourceDay();
  const optionId = getSelectedRoutineSourceOptionId(routines, dayKey);
  const option = (routines[dayKey] || []).find(entry => entry.id === optionId) || null;
  const presets = option?.exercises || [];

  if (!presets.length) {
    alert(`Er staan nog geen vaste oefeningen klaar voor ${getRoutineDayLabel(dayKey)}.`);
    return;
  }

  const existing = new Set(state.exercises.map(ex => normalizeExerciseName(ex.name)));
  const toAdd = presets.filter(item => !existing.has(normalizeExerciseName(item.name)));

  if (!toAdd.length) {
    alert('Alle vaste oefeningen van deze dag staan al in je logboek.');
    return;
  }

  toAdd.forEach(item => {
    const exercise = {
      id: uid(),
      name: item.name,
      notes: item.notes || '',
      primaryGroup: item.primaryGroup || '',
      secondaryGroups: [...(item.secondaryGroups || [])],
      splitWeightMode: false,
      sets: [newSet()]
    };
    const profile = getAutoExerciseProfile(item.name, catalog);
    applyExerciseTargetIfNeeded(exercise, profile?.nextTarget);
    state.exercises.push(exercise);
  });

  activeExerciseId = state.exercises[state.exercises.length - 1]?.id || activeExerciseId;
  renderExercises();
  persist();
  flashButtonLabel(addRoutineToDayBtn, `+${toAdd.length} toegevoegd`, 1200);
}

function updateExerciseStats(exerciseId, cardEl) {
  const exercise = state.exercises.find(ex => ex.id === exerciseId);
  if (!exercise) return;

  const volume = exercise.sets.reduce((sum, set) => sum + setVolume(set, exercise), 0);
  const best = findBestSet(exercise.sets);

  const volumeEl = cardEl.querySelector('.volume');
  const bestEl = cardEl.querySelector('.best');
  volumeEl.textContent = formatNumber(volume);
  bestEl.textContent = best ? formatBestSet(best) : '-';
}

function updateSummary() {
  const totalExercises = state.exercises.length;
  const totalSets = state.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalVolume = state.exercises.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + setVolume(set, ex), 0), 0);

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
    const volume = (exercise.sets || []).reduce((sum, set) => sum + setVolume(set, exercise), 0);
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
  const repData = getSetRepData(set);
  const weightData = getSetWeightData(set);

  if (repData.splitMode || weightData.splitMode) {
    const parts = [];
    const leftUsed = repData.left !== null || weightData.left !== null;
    const rightUsed = repData.right !== null || weightData.right !== null;
    if (leftUsed) parts.push(`L ${repData.left ?? '-'}x${weightData.left !== null ? formatNumber(weightData.left) : '-'}`);
    if (rightUsed) parts.push(`R ${repData.right ?? '-'}x${weightData.right !== null ? formatNumber(weightData.right) : '-'}`);
    return parts.length ? parts.join(' · ') : '-';
  }

  const hasReps = repData.reps !== null;
  const hasWeight = weightData.weight !== null;
  if (hasReps && hasWeight) return `${repData.reps}x${formatNumber(weightData.weight)}`;
  if (hasReps) return `${repData.reps} reps`;
  if (hasWeight) return `${formatNumber(weightData.weight)} kg`;
  return '-';
}

function formatSetsSummary(sets) {
  if (!sets || !sets.length) return '-';
  return sets
    .map((set, index) => `S${index + 1} ${formatSetTag(set)}`)
    .join(', ');
}

function formatMuscleList(groups) {
  if (!groups || !groups.length) return '-';
  return groups.join(', ');
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
    card.dataset.id = exercise.id;

    const name = (exercise.name || '').trim() || 'Oefening';
    const volume = exercise.sets.reduce((sum, set) => sum + setVolume(set, exercise), 0);
    const { primary, secondaryGroups } = resolveExerciseMuscles(exercise);
    const previousSession = findLatestPreviousExerciseSession(exercise.name, state.date);

    const head = document.createElement('div');
    head.className = 'day-exercise-head';
    head.innerHTML = `<span class="day-exercise-name">${name}</span><span class="day-exercise-volume">${formatNumber(volume)} kg</span>`;

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

    const muscles = document.createElement('div');
    muscles.className = 'day-exercise-muscles';
    muscles.innerHTML = `
      <div><span class="label">Primary:</span> <span>${primary || '-'}</span></div>
      <div><span class="label">Secondary:</span> <span>${formatMuscleList(secondaryGroups)}</span></div>
      <div><span class="label">Laatste keer:</span> <span>${previousSession ? formatShortDate(previousSession.date) : '-'}</span></div>
      <div><span class="label">Vorige sets:</span> <span>${previousSession ? formatFocusSetsDetail(previousSession.sets) : 'Nog geen eerdere sessie'}</span></div>
      <div><span class="label">Vorig volume:</span> <span>${previousSession ? `${formatNumber(previousSession.volume)} kg` : '-'}</span></div>
    `;

    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'day-exercise-link';
    link.dataset.id = exercise.id;
    link.textContent = 'Ga naar oefening';

    card.appendChild(head);
    card.appendChild(tags);
    card.appendChild(muscles);
    card.appendChild(link);
    dayExerciseSummary.appendChild(card);
  });
}

function setVolume(set, exerciseOrMode = null) {
  const repData = getSetRepData(set, exerciseOrMode);
  const weightData = getSetWeightData(set, exerciseOrMode);
  if (repData.splitMode || weightData.splitMode) {
    return (repData.left || 0) * (weightData.left || 0) + (repData.right || 0) * (weightData.right || 0);
  }
  return (repData.reps || 0) * (weightData.weight || 0);
}

function formatBestSet(set) {
  const repData = getSetRepData(set);
  const weightData = getSetWeightData(set);
  if (repData.splitMode || weightData.splitMode) {
    const parts = [];
    if (repData.left !== null || weightData.left !== null) parts.push(`L ${repData.left ?? '-'}x${weightData.left !== null ? formatNumber(weightData.left) : '-'} kg`);
    if (repData.right !== null || weightData.right !== null) parts.push(`R ${repData.right ?? '-'}x${weightData.right !== null ? formatNumber(weightData.right) : '-'} kg`);
    return parts.length ? parts.join(' · ') : '-';
  }

  const reps = repData.reps;
  const load = formatSetLoad(set, null, true);
  if (reps !== null && load) return `${load} x ${reps}`;
  if (reps !== null) return `${reps} reps`;
  if (load) return load;
  return '-';
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

function parseTimeToMinutes(value) {
  const raw = String(value || '').trim();
  if (!/^\d{2}:\d{2}$/.test(raw)) return null;
  const [hours, minutes] = raw.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function computeTrainingDurationMinutes(day) {
  const start = parseTimeToMinutes(day?.startTime);
  const end = parseTimeToMinutes(day?.endTime);
  if (start === null || end === null) return 0;
  if (end >= start) return end - start;
  return (24 * 60 - start) + end;
}

function formatTrainingWindow(startTime, endTime) {
  const start = startTime || '-';
  const end = endTime || '-';
  return `${start} - ${end}`;
}

function hasMeaningfulSetData(set) {
  if (!set || typeof set !== 'object') return false;
  return [
    set.reps,
    set.leftReps,
    set.rightReps,
    set.weight,
    set.leftWeight,
    set.rightWeight,
    set.rpe
  ].some(value => String(value ?? '').trim() !== '') || !!set.done;
}

function isWorkoutDay(day) {
  if (!day || typeof day !== 'object') return false;
  if (String(day.startTime || '').trim() || String(day.endTime || '').trim()) return true;
  return (day.exercises || []).some(exercise => (exercise.sets || []).some(hasMeaningfulSetData));
}

function handleInputChange(target) {
  const card = target.closest('.exercise-card');
  if (!card) return;
  if (
    target.classList.contains('quick-set-count')
    || target.classList.contains('quick-set-left-count')
    || target.classList.contains('quick-set-right-count')
    || target.classList.contains('quick-set-reps')
    || target.classList.contains('quick-set-left-reps')
    || target.classList.contains('quick-set-right-reps')
    || target.classList.contains('quick-set-weight')
    || target.classList.contains('quick-set-left-weight')
    || target.classList.contains('quick-set-right-weight')
    || target.classList.contains('quick-set-rpe')
    || target.classList.contains('next-target-count')
    || target.classList.contains('next-target-left-count')
    || target.classList.contains('next-target-right-count')
    || target.classList.contains('next-target-reps')
    || target.classList.contains('next-target-left-reps')
    || target.classList.contains('next-target-right-reps')
    || target.classList.contains('next-target-weight')
    || target.classList.contains('next-target-left-weight')
    || target.classList.contains('next-target-right-weight')
    || target.classList.contains('target-set-reps')
    || target.classList.contains('target-set-left-reps')
    || target.classList.contains('target-set-right-reps')
    || target.classList.contains('target-set-weight')
    || target.classList.contains('target-set-left-weight')
    || target.classList.contains('target-set-right-weight')
  ) return;
  const exId = card.dataset.id;
  const exercise = state.exercises.find(ex => ex.id === exId);
  if (!exercise) return;
  const catalog = getExerciseCatalog(getCurrentDataSnapshot());

  if (target.classList.contains('exercise-name')) {
    const profile = getAutoExerciseProfile(target.value, catalog);
    if (profile) {
      const result = applyExerciseProfile(exercise, card, profile, catalog);
      if (result?.didPrefill) {
        renderExercises();
        persist();
        return;
      }
    } else {
      exercise.name = target.value;
      applyExerciseProfile(exercise, card, null, catalog);
    }
  }
  if (target.classList.contains('exercise-select')) {
    if (target.value) {
      const profile = getAutoExerciseProfile(target.value, catalog);
      const result = applyExerciseProfile(exercise, card, profile, catalog);
      if (result?.didPrefill) {
        renderExercises();
        persist();
        return;
      }
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
  if (target.classList.contains('exercise-split-mode')) {
    syncExerciseSplitMode(exercise, target.checked);
    renderExercises();
    persist();
    return;
  }
  if (target.classList.contains('next-target-detailed-toggle')) {
    card.classList.toggle('is-target-detailed', target.checked);
    if (target.checked) {
      renderTargetSetRows(card, readTargetSetsFromCard(card, !!exercise.splitWeightMode), !!exercise.splitWeightMode, true);
    }
    return;
  }

  const setRow = target.closest('.set-row');
  if (setRow) {
    const setId = setRow.dataset.id;
    const set = exercise.sets.find(s => s.id === setId);
    if (!set) return;

    if (target.classList.contains('set-reps')) set.reps = target.value;
    if (target.classList.contains('set-left-reps')) {
      set.leftReps = target.value;
      set.weightMode = 'split';
    }
    if (target.classList.contains('set-weight')) {
      set.weight = target.value;
      if (!exercise.splitWeightMode) set.weightMode = 'single';
    }
    if (target.classList.contains('set-right-reps')) {
      set.rightReps = target.value;
      set.weightMode = 'split';
    }
    if (target.classList.contains('set-left-weight')) {
      set.leftWeight = target.value;
      set.weightMode = 'split';
    }
    if (target.classList.contains('set-right-weight')) {
      set.rightWeight = target.value;
      set.weightMode = 'split';
    }
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
  exercise.sets.push(newSet({
    ...seed,
    weightMode: exercise.splitWeightMode ? 'split' : (seed?.weightMode || 'single')
  }));
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
  renderTrainingDurationTrend(all);
  renderVisitCountTrend(all);
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

function formatFocusSetsDetail(sets) {
  if (!sets || !sets.length) return '-';
  return sets
    .map((set, index) => {
      const repData = getSetRepData(set);
      const weightData = getSetWeightData(set);
      if (repData.splitMode || weightData.splitMode) {
        const parts = [];
        if (repData.left !== null || weightData.left !== null) {
          parts.push(`L ${repData.left ?? '-'}x${weightData.left !== null ? formatNumber(weightData.left) : '-'} kg`);
        }
        if (repData.right !== null || weightData.right !== null) {
          parts.push(`R ${repData.right ?? '-'}x${weightData.right !== null ? formatNumber(weightData.right) : '-'} kg`);
        }
        return `S${index + 1} ${parts.length ? parts.join(' · ') : '-'}`;
      }

      const label = formatSetTag(set);
      if (label === '-') return `S${index + 1} -`;
      const suffix = getSetWeightData(set).hasWeight && !label.endsWith('kg') ? ' kg' : '';
      return `S${index + 1} ${label}${suffix}`;
    })
    .join(', ');
}

function findLatestPreviousExerciseSession(name, currentDate, all = loadAll()) {
  const normalizedName = normalizeExerciseName(name);
  if (!normalizedName) return null;

  let latest = null;

  Object.entries(all)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, day]) => {
      if (!date || date >= currentDate) return;
      const matches = (day.exercises || []).filter(ex => normalizeExerciseName(ex.name) === normalizedName);
      if (!matches.length) return;
      const sets = matches.flatMap(ex => ex.sets || []);
      latest = {
        date,
        sets,
        volume: sets.reduce((sum, set) => sum + setVolume(set), 0)
      };
    });

  return latest;
}

function formatMetricValue(point) {
  if (!point) {
    return {
      date: '-',
      bullets: ['Totaal volume: <strong>-</strong>', 'Sets: -']
    };
  }

  return {
    date: formatShortDate(point.date),
    bullets: [
      `Totaal volume: <strong>${formatNumber(point.volume)} kg</strong>`,
      `Sets: ${point.setsDetail || '-'}`
    ]
  };
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
    { label: 'Start', value: '-', bullets: ['Totaal volume: -', 'Sets: -'] },
    { label: 'Vorige week', value: '-', bullets: ['Totaal volume: -', 'Sets: -'] },
    { label: 'Vorige sessie', value: '-', bullets: ['Totaal volume: -', 'Sets: -'] },
    { label: 'Laatste', value: '-', bullets: ['Totaal volume: -', 'Sets: -'] }
  ];

  if (!points.length) return metrics;

  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const lastDate = parseDate(last.date);
  const weekAgoTarget = lastDate ? new Date(lastDate.getTime() - 7 * 24 * 60 * 60 * 1000) : null;
  const weekAgo = weekAgoTarget ? getPointAtOrBefore(sorted, weekAgoTarget) : null;

  const nextValues = [
    formatMetricValue(first),
    formatMetricValue(weekAgo),
    formatMetricValue(prev),
    formatMetricValue(last)
  ];

  nextValues.forEach((entry, index) => {
    metrics[index].value = entry.date;
    metrics[index].bullets = entry.bullets;
  });
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
    const bullets = Array.isArray(metric.bullets)
      ? `<ul class="metric-bullets">${metric.bullets.map(entry => `<li>${entry}</li>`).join('')}</ul>`
      : '';
    item.innerHTML = `<span class="label">${metric.label}</span><span class="value">${metric.value}</span>${bullets}`;
    container.appendChild(item);
  });
}

function renderStartNow(container, points, currentExercise) {
  if (!container) return;
  container.innerHTML = '';
  container.style.display = 'none';
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
    secondary: secondaryGroups[0] || '',
    nextTarget: normalizeExerciseTarget(profile?.nextTarget)
  };
}

function normalizeExerciseTarget(target) {
  const targetSets = Array.isArray(target?.targetSets)
    ? target.targetSets.map(normalizeTargetSet)
    : [];
  const splitMode = !!target?.splitMode
    || ((target?.leftCount ?? '') !== '')
    || ((target?.rightCount ?? '') !== '')
    || ((target?.leftReps ?? '') !== '')
    || ((target?.rightReps ?? '') !== '')
    || ((target?.leftWeight ?? '') !== '')
    || ((target?.rightWeight ?? '') !== '')
    || targetSets.some(set =>
      usesSplitWeight(set, set?.weightMode)
      || (set?.leftReps ?? '') !== ''
      || (set?.rightReps ?? '') !== ''
    );
  const mode = (target?.mode === 'detailed' || targetSets.length) ? 'detailed' : 'simple';

  return {
    mode,
    splitMode,
    count: target?.count ?? '',
    leftCount: target?.leftCount ?? '',
    rightCount: target?.rightCount ?? '',
    reps: target?.reps ?? '',
    leftReps: target?.leftReps ?? '',
    rightReps: target?.rightReps ?? '',
    weight: target?.weight ?? '',
    leftWeight: target?.leftWeight ?? '',
    rightWeight: target?.rightWeight ?? '',
    targetSets
  };
}

function hasExerciseTarget(target) {
  const normalized = normalizeExerciseTarget(target);
  if (normalized.targetSets.some(set => !isBlankSet(set))) return true;
  const countReady = normalized.splitMode
    ? Number(normalized.leftCount || 0) > 0 || Number(normalized.rightCount || 0) > 0
    : Number(normalized.count || 0) > 0;
  const detailReady = normalized.splitMode
    ? [normalized.leftReps, normalized.rightReps, normalized.leftWeight, normalized.rightWeight].some(value => `${value}` !== '')
    : [normalized.reps, normalized.weight].some(value => `${value}` !== '');
  return countReady && detailReady;
}

function isDetailedExerciseTarget(target) {
  const normalized = normalizeExerciseTarget(target);
  return normalized.mode === 'detailed';
}

function mergeExerciseProfiles(current, incoming) {
  const base = normalizeExerciseProfile(incoming);
  if (hasExerciseTarget(base.nextTarget)) return base;
  if (current && hasExerciseTarget(current.nextTarget)) {
    return {
      ...base,
      nextTarget: normalizeExerciseTarget(current.nextTarget)
    };
  }
  return base;
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
  const addToCatalog = profile => {
    const normalized = normalizeExerciseProfile(profile);
    const key = normalizeExerciseName(normalized.name);
    const current = byName.get(key);
    byName.set(key, mergeExerciseProfiles(current, normalized));
  };

  EXERCISE_LIBRARY.forEach(item => {
    addToCatalog(item);
  });

  loadCustomExerciseLibrary().forEach(item => {
    addToCatalog(item);
  });

  Object.values(loadRoutines()).flat().forEach(item => {
    if (!item?.name) return;
    addToCatalog({
      name: item.name,
      primary: item.primaryGroup || '',
      secondaryGroups: item.secondaryGroups ?? item.secondaryGroup
    });
  });

  Object.entries(all || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([, day]) => {
      (day?.exercises || []).forEach(exercise => {
        const name = (exercise?.name || '').trim();
        if (!name) return;
        const { primary, secondaryGroups } = resolveExerciseMuscles(exercise);
        addToCatalog({ name, primary, secondaryGroups });
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

function getStoredVisitGranularity() {
  const stored = String(localStorage.getItem(VISIT_GRANULARITY_KEY) || '').trim().toLowerCase();
  return ['day', 'week', 'month', 'year'].includes(stored) ? stored : 'week';
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

function setSelectedVisitGranularity(value, options = {}) {
  selectedVisitGranularity = ['day', 'week', 'month', 'year'].includes(String(value || '').toLowerCase())
    ? String(value).toLowerCase()
    : 'week';
  if (visitCountGranularitySelect) visitCountGranularitySelect.value = selectedVisitGranularity;
  if (!options.skipPersist) localStorage.setItem(VISIT_GRANULARITY_KEY, selectedVisitGranularity);
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
      const volume = (exercise.sets || []).reduce((sum, set) => sum + setVolume(set, exercise), 0);
      const { primary, secondaryGroups } = resolveExerciseMuscles(exercise);
      primaryTotals[primary][index] += volume;
      secondaryGroups.forEach(group => {
        if (secondaryTotals[group]) secondaryTotals[group][index] += volume;
      });
    });
  });

  return { primaryTotals, secondaryTotals };
}

function renderLegend(container, groups, activeGroup = '', chartKey = '') {
  if (!container) return;
  container.innerHTML = '';

  if (!groups.length) return;

  const allItem = document.createElement('button');
  allItem.type = 'button';
  allItem.className = `legend-item ${!activeGroup ? 'is-active' : 'is-muted'}`.trim();
  allItem.dataset.chartFilter = chartKey;
  allItem.dataset.group = '';
  allItem.textContent = 'Alles';
  container.appendChild(allItem);

  groups.forEach(group => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `legend-item ${activeGroup === group ? 'is-active' : activeGroup ? 'is-muted' : ''}`.trim();
    item.dataset.chartFilter = chartKey;
    item.dataset.group = group;
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

function getCanvasPointer(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = event.clientX ?? event.touches?.[0]?.clientX;
  const clientY = event.clientY ?? event.touches?.[0]?.clientY;
  if (clientX == null || clientY == null) return null;

  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  return {
    x,
    y,
    clientX,
    clientY
  };
}

function getCanvasHit(canvas, event) {
  const position = getCanvasPointer(canvas, event);
  if (!position) return null;

  const hit = (canvas._stackedHitboxes || []).find(box =>
    position.x >= box.x && position.x <= box.x + box.width && position.y >= box.y && position.y <= box.y + box.height
  );

  return {
    hit,
    clientX: position.clientX,
    clientY: position.clientY
  };
}

function setChartGroupFilter(chartKey, group) {
  if (chartKey === 'primary') {
    selectedPrimaryChartGroup = selectedPrimaryChartGroup === group ? '' : group;
  }
  if (chartKey === 'secondary') {
    selectedSecondaryChartGroup = selectedSecondaryChartGroup === group ? '' : group;
  }
  refreshProgress();
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

function bindLineChartHover(canvas, hitboxes) {
  if (!canvas) return;
  canvas._lineHitboxes = hitboxes;
  canvas.classList.toggle('chart-hover', hitboxes.length > 0);

  if (canvas._lineHoverBound) return;
  canvas._lineHoverBound = true;

  const moveHandler = event => {
    const position = getCanvasPointer(canvas, event);
    if (!position) return false;

    const hit = (canvas._lineHitboxes || []).find(point =>
      Math.hypot(position.x - point.x, position.y - point.y) <= point.radius
    );

    if (!hit) {
      hideChartTooltip();
      return false;
    }

    showChartTooltip(
      `<span class="title">${formatShortDate(hit.date)}</span><span class="value">Totaal volume: ${formatNumber(hit.volume)} kg</span><span class="title">Sets x reps x gewicht</span><span class="value">${hit.setsDetail || '-'}</span>`,
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

  const leaveHandler = () => hideChartTooltip();
  canvas.addEventListener('mouseleave', leaveHandler);
  canvas.addEventListener('pointerleave', leaveHandler);
  canvas.addEventListener('touchend', leaveHandler, { passive: true });
}

function updateDurationReadout(readoutEl, hit) {
  if (!readoutEl) return;
  if (!hit) {
    readoutEl.textContent = 'Beweeg over de chart voor details.';
    return;
  }
  readoutEl.textContent = `${formatShortDate(hit.date)} • ${formatNumber(hit.minutes)} min • ${formatTrainingWindow(hit.startTime, hit.endTime)}`;
}

function bindDurationChartHover(canvas, hitboxes, readoutEl) {
  if (!canvas) return;
  canvas._durationHitboxes = hitboxes;
  canvas._durationReadout = readoutEl || null;
  canvas.classList.toggle('chart-hover', hitboxes.length > 0);
  updateDurationReadout(canvas._durationReadout, null);

  if (canvas._durationHoverBound) return;
  canvas._durationHoverBound = true;

  const moveHandler = event => {
    const position = getCanvasPointer(canvas, event);
    if (!position) return false;

    const hit = (canvas._durationHitboxes || []).find(box =>
      position.x >= box.x && position.x <= box.x + box.width && position.y >= box.y && position.y <= box.y + box.height
    );

    if (!hit) {
      hideChartTooltip();
      updateDurationReadout(canvas._durationReadout, null);
      return false;
    }

    updateDurationReadout(canvas._durationReadout, hit);
    showChartTooltip(
      `<span class="title">${formatShortDate(hit.date)}</span><span class="value">${formatNumber(hit.minutes)} minuten</span><span class="title">Start: ${hit.startTime || '-'}</span><span class="title">Einde: ${hit.endTime || '-'}</span>`,
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
    updateDurationReadout(canvas._durationReadout, null);
  };

  canvas.addEventListener('mouseleave', leaveHandler);
  canvas.addEventListener('pointerleave', leaveHandler);
  canvas.addEventListener('touchend', leaveHandler, { passive: true });
}

function formatVisitPeriodLabel(row) {
  if (!row) return '-';
  if (row.granularity === 'day') return formatLongDate(row.date);
  if (row.granularity === 'week') return `Week ${row.code.slice(-2)} (${formatShortDate(row.startDate)} t/m ${formatShortDate(row.endDate)})`;
  if (row.granularity === 'month') {
    return new Intl.DateTimeFormat('nl-NL', {
      month: 'long',
      year: 'numeric'
    }).format(parseDate(row.startDate) || new Date());
  }
  return row.label;
}

function getVisitAxisLabel(row) {
  if (!row) return '-';
  if (row.granularity === 'day') return formatAxisDate(row.date);
  if (row.granularity === 'week') return `W${row.code.slice(-2)}`;
  if (row.granularity === 'month') {
    return new Intl.DateTimeFormat('nl-NL', {
      month: 'short',
      year: '2-digit'
    }).format(parseDate(row.startDate) || new Date());
  }
  return row.label;
}

function getCountAxisScale(maxValue) {
  const safeValue = Math.max(Number(maxValue) || 0, 1);
  const stepChoices = [1, 2, 5, 10, 20, 25, 50, 100];
  const roughStep = safeValue / 4;
  const step = stepChoices.find(choice => roughStep <= choice) || Math.ceil(roughStep);
  const max = Math.ceil(safeValue / step) * step;
  return {
    max,
    step,
    ticks: Math.max(1, Math.round(max / step))
  };
}

function updateVisitCountReadout(readoutEl, hit) {
  if (!readoutEl) return;
  if (!hit) {
    readoutEl.textContent = 'Beweeg over de chart voor details.';
    return;
  }
  readoutEl.textContent = `${formatVisitPeriodLabel(hit)} • ${hit.count}x fitness`;
}

function bindVisitCountChartHover(canvas, hitboxes, readoutEl) {
  if (!canvas) return;
  canvas._visitHitboxes = hitboxes;
  canvas._visitReadout = readoutEl || null;
  canvas.classList.toggle('chart-hover', hitboxes.length > 0);
  updateVisitCountReadout(canvas._visitReadout, null);

  if (canvas._visitHoverBound) return;
  canvas._visitHoverBound = true;

  const moveHandler = event => {
    const position = getCanvasPointer(canvas, event);
    if (!position) return false;

    const hit = (canvas._visitHitboxes || []).find(box =>
      position.x >= box.x && position.x <= box.x + box.width && position.y >= box.y && position.y <= box.y + box.height
    );

    if (!hit) {
      hideChartTooltip();
      updateVisitCountReadout(canvas._visitReadout, null);
      return false;
    }

    updateVisitCountReadout(canvas._visitReadout, hit);
    showChartTooltip(
      `<span class="title">${formatVisitPeriodLabel(hit)}</span><span class="value">${hit.count}x fitness</span>`,
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
    updateVisitCountReadout(canvas._visitReadout, null);
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

function drawDurationBarChart(canvas, rows, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const paddingLeft = 64;
  const paddingRight = 14;
  const paddingTop = 14;
  const paddingBottom = 30;
  const hitboxes = [];

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  const hasData = rows.some(row => row.minutes > 0);
  if (!rows.length || !hasData) {
    ctx.fillStyle = '#6a5e54';
    ctx.font = '14px Space Grotesk';
    ctx.fillText('Nog geen trainingstijden ingevuld.', 14, h / 2);
    bindDurationChartHover(canvas, [], options.readoutEl);
    return;
  }

  const ticks = 4;
  const maxMinutes = getNiceAxisMax(Math.max(...rows.map(row => row.minutes), 10), ticks);
  const chartHeight = h - paddingTop - paddingBottom;
  const chartWidth = w - paddingLeft - paddingRight;
  const barGap = 8;
  const barWidth = (chartWidth - barGap * (rows.length - 1)) / rows.length;

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
  ctx.fillText('minuten', 0, 0);
  ctx.restore();

  for (let i = 0; i <= ticks; i += 1) {
    const value = (maxMinutes / ticks) * i;
    const y = h - paddingBottom - (value / maxMinutes) * chartHeight;
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
    ctx.fillText(`${formatNumber(value)} min`, paddingLeft - 6, y);
  }

  rows.forEach((row, index) => {
    const x = paddingLeft + index * (barWidth + barGap);
    const height = (row.minutes / maxMinutes) * chartHeight;
    const y = h - paddingBottom - height;
    ctx.fillStyle = '#0f6b66';
    ctx.fillRect(x, y, barWidth, height);
    hitboxes.push({
      x,
      y,
      width: barWidth,
      height: Math.max(height, 4),
      date: row.date,
      minutes: row.minutes,
      startTime: row.startTime,
      endTime: row.endTime
    });

    ctx.fillStyle = '#6a5e54';
    ctx.font = '11px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(formatTinyDate(row.date), x + barWidth / 2, h - 10);
  });

  bindDurationChartHover(canvas, hitboxes, options.readoutEl);
}

function drawVisitCountBarChart(canvas, rows, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const paddingLeft = 64;
  const paddingRight = 14;
  const paddingTop = 14;
  const paddingBottom = 30;
  const hitboxes = [];

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  const hasData = rows.some(row => row.count > 0);
  if (!rows.length || !hasData) {
    ctx.fillStyle = '#6a5e54';
    ctx.font = '14px Space Grotesk';
    ctx.fillText('Nog geen fitnessbezoeken gevonden.', 14, h / 2);
    bindVisitCountChartHover(canvas, [], options.readoutEl);
    return;
  }

  const axis = getCountAxisScale(Math.max(...rows.map(row => row.count), 1));
  const chartHeight = h - paddingTop - paddingBottom;
  const chartWidth = w - paddingLeft - paddingRight;
  const barGap = rows.length > 40 ? 0 : rows.length > 18 ? 2 : 8;
  const barWidth = rows.length > 1
    ? Math.max(0.5, (chartWidth - barGap * (rows.length - 1)) / rows.length)
    : Math.min(56, chartWidth);

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
  ctx.fillText('bezoeken', 0, 0);
  ctx.restore();

  for (let tick = 0; tick <= axis.ticks; tick += 1) {
    const value = tick * axis.step;
    const y = h - paddingBottom - (value / axis.max) * chartHeight;
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
    ctx.fillText(String(value), paddingLeft - 6, y);
  }

  const labelStep = Math.max(1, Math.ceil(rows.length / 6));
  rows.forEach((row, index) => {
    const x = paddingLeft + index * (barWidth + barGap);
    const height = axis.max ? (row.count / axis.max) * chartHeight : 0;
    const y = h - paddingBottom - height;
    ctx.fillStyle = '#c2552d';
    ctx.fillRect(x, y, barWidth, height);
    hitboxes.push({
      ...row,
      x,
      y: height > 0 ? y : h - paddingBottom - 4,
      width: barWidth,
      height: Math.max(height, 4)
    });

    if (index % labelStep === 0 || index === rows.length - 1) {
      ctx.fillStyle = '#6a5e54';
      ctx.font = '11px Space Grotesk';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(getVisitAxisLabel(row), x + barWidth / 2, h - 10);
    }
  });

  bindVisitCountChartHover(canvas, hitboxes, options.readoutEl);
}

function getMonthStartDate(value) {
  const base = parseDate(value) || new Date();
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

function getYearStartDate(value) {
  const base = parseDate(value) || new Date();
  return new Date(base.getFullYear(), 0, 1);
}

function buildVisitCountRows(all, granularity = 'week') {
  const workoutDates = Object.entries(all)
    .filter(([, day]) => isWorkoutDay(day))
    .map(([date]) => date)
    .sort((a, b) => a.localeCompare(b));

  if (!workoutDates.length) return [];

  const workoutSet = new Set(workoutDates);
  const first = workoutDates[0];
  const last = workoutDates[workoutDates.length - 1];
  const rows = [];

  if (granularity === 'day') {
    for (let cursor = parseDate(first); cursor && cursor <= parseDate(last); cursor.setDate(cursor.getDate() + 1)) {
      const date = toIsoDateString(cursor);
      rows.push({
        granularity: 'day',
        date,
        startDate: date,
        endDate: date,
        label: formatLongDate(date),
        count: workoutSet.has(date) ? 1 : 0
      });
    }
    return rows;
  }

  if (granularity === 'week') {
    for (let cursor = getWeekStartDate(first); cursor <= getWeekStartDate(last); cursor.setDate(cursor.getDate() + 7)) {
      const startDate = toIsoDateString(cursor);
      const dates = Array.from({ length: 7 }, (_, index) => {
        const next = new Date(cursor);
        next.setDate(cursor.getDate() + index);
        return toIsoDateString(next);
      });
      const endDate = dates[dates.length - 1];
      rows.push({
        granularity: 'week',
        code: formatWeekInputValue(startDate),
        startDate,
        endDate,
        label: `Week ${formatWeekInputValue(startDate).slice(-2)}`,
        count: dates.reduce((sum, date) => sum + (workoutSet.has(date) ? 1 : 0), 0)
      });
    }
    return rows;
  }

  if (granularity === 'month') {
    for (let cursor = getMonthStartDate(first); cursor <= getMonthStartDate(last); cursor.setMonth(cursor.getMonth() + 1)) {
      const startDate = toIsoDateString(cursor);
      const endDate = toIsoDateString(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0));
      const year = cursor.getFullYear();
      const month = cursor.getMonth();
      const count = workoutDates.filter(date => {
        const parsed = parseDate(date);
        return parsed && parsed.getFullYear() === year && parsed.getMonth() === month;
      }).length;
      rows.push({
        granularity: 'month',
        startDate,
        endDate,
        label: new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(cursor),
        count
      });
    }
    return rows;
  }

  for (let cursor = getYearStartDate(first); cursor <= getYearStartDate(last); cursor.setFullYear(cursor.getFullYear() + 1)) {
    const startDate = toIsoDateString(cursor);
    const endDate = toIsoDateString(new Date(cursor.getFullYear(), 11, 31));
    const year = cursor.getFullYear();
    const count = workoutDates.filter(date => {
      const parsed = parseDate(date);
      return parsed && parsed.getFullYear() === year;
    }).length;
    rows.push({
      granularity: 'year',
      startDate,
      endDate,
      label: String(year),
      count
    });
  }

  return rows;
}

function renderWeekCharts(all) {
  const dates = getWeekDates(selectedDashboardWeek || getStoredDashboardWeek());
  const { primaryTotals, secondaryTotals } = computeWeekTotals(all, dates);

  const primaryGroups = PRIMARY_GROUPS.filter(group => primaryTotals[group].some(value => value > 0));
  const secondaryGroups = PRIMARY_GROUPS.filter(group => secondaryTotals[group].some(value => value > 0));

  if (selectedPrimaryChartGroup && !primaryGroups.includes(selectedPrimaryChartGroup)) {
    selectedPrimaryChartGroup = '';
  }
  if (selectedSecondaryChartGroup && !secondaryGroups.includes(selectedSecondaryChartGroup)) {
    selectedSecondaryChartGroup = '';
  }

  const visiblePrimaryGroups = selectedPrimaryChartGroup ? [selectedPrimaryChartGroup] : primaryGroups;
  const visibleSecondaryGroups = selectedSecondaryChartGroup ? [selectedSecondaryChartGroup] : secondaryGroups;

  drawStackedBarChart(weekPrimaryChart, dates, primaryTotals, {
    groups: visiblePrimaryGroups,
    readoutEl: weekPrimaryReadout
  });
  drawStackedBarChart(weekSecondaryChart, dates, secondaryTotals, {
    groups: visibleSecondaryGroups,
    readoutEl: weekSecondaryReadout
  });

  renderLegend(weekPrimaryLegend, primaryGroups, selectedPrimaryChartGroup, 'primary');
  renderLegend(weekSecondaryLegend, secondaryGroups, selectedSecondaryChartGroup, 'secondary');
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
let selectedRoutineOptionId = '';
let selectedDashboardWeek = '';
let selectedPrimaryChartGroup = '';
let selectedSecondaryChartGroup = '';
let selectedVisitGranularity = 'week';
let progressDraftImage = '';

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
  if (!exerciseId) return;
  if (exerciseId === activeExerciseId) {
    const all = loadAll();
    all[state.date] = cloneState();
    renderExerciseFocus(all);
    return;
  }
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

function jumpToExerciseInLogbook(exerciseId) {
  if (!exerciseId) return;
  setActiveExercise(exerciseId);
  requestAnimationFrame(() => {
    const card = exerciseList?.querySelector(`.exercise-card[data-id="${exerciseId}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    card.classList.add('jump-highlight');
    window.setTimeout(() => card.classList.remove('jump-highlight'), 1600);
  });
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
      const bestStr = best ? formatBestSet(best) : '-';
      const bestWeight = best ? getSetWeightData(best).total : 0;
      const bestReps = best ? Number(best.reps) || 0 : 0;
      const setsLabel = formatSetsSummary(sets);
      const setsDetail = formatFocusSetsDetail(sets);

      points.push({ date, volume, best: bestStr, bestWeight, bestReps, setsLabel, setsDetail });
      rows.push({
        date,
        volume,
        best: bestStr,
        setsDetail
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
    el.innerHTML = `
      <div class="progress-row-head">${formatShortDate(row.date)}</div>
      <ul class="progress-row-list">
        <li>Totaal volume: <strong>${formatNumber(row.volume)} kg</strong></li>
        <li>Sets: ${row.setsDetail || '-'}</li>
      </ul>
    `;
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

function getBodyweightPoints(all) {
  return Object.entries(all)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, day]) => {
      const raw = day?.bodyweight;
      if (raw === '' || raw === null || raw === undefined) return null;
      const weight = Number(raw);
      if (!Number.isFinite(weight)) return null;
      return { date, weight };
    })
    .filter(Boolean);
}

function getDurationRows(all, dates = null) {
  const entries = dates
    ? dates.map(date => [date, all[date] || {}])
    : Object.entries(all).sort(([a], [b]) => a.localeCompare(b));

  return entries.map(([date, day]) => ({
    date,
    startTime: day?.startTime || '',
    endTime: day?.endTime || '',
    minutes: computeTrainingDurationMinutes(day)
  }));
}

function renderBodyweightTrend(all) {
  if (!bodyweightChart) return;
  const points = getBodyweightPoints(all);
  drawBodyweightChart(bodyweightChart, points);
  if (bodyweightHint) {
    bodyweightHint.style.display = points.length ? 'none' : 'block';
  }
}

function renderTrainingDurationTrend(all) {
  if (!durationChart) return;
  const dates = getWeekDates(selectedDashboardWeek || getStoredDashboardWeek());
  const rows = getDurationRows(all, dates);
  drawDurationBarChart(durationChart, rows, { readoutEl: durationReadout });
}

function renderVisitCountTrend(all) {
  if (!visitCountChart) return;
  const rows = buildVisitCountRows(all, selectedVisitGranularity || getStoredVisitGranularity());
  drawVisitCountBarChart(visitCountChart, rows, { readoutEl: visitCountReadout });
}

function setVisionStatus(message) {
  if (visionStatus) visionStatus.textContent = message;
}

function formatWeekBadge(value) {
  const weekCode = formatWeekInputValue(value);
  return weekCode.replace('-W', ' · week ');
}

function getProgressEntryByDate(date) {
  return loadProgressEntries().find(entry => entry.date === date) || null;
}

function getDefaultBodyweightForDate(date) {
  const all = loadAll();
  const day = all[date];
  if (day?.bodyweight !== '' && day?.bodyweight !== undefined && day?.bodyweight !== null) {
    return day.bodyweight;
  }
  return '';
}

function fillProgressDraft(date) {
  const normalizedDate = normalizeDateValue(date) || todayISO();
  const existing = getProgressEntryByDate(normalizedDate);
  progressDraftImage = existing?.imageData || '';

  if (progressDateInput) progressDateInput.value = normalizedDate;
  if (progressWeightInput) {
    const weight = existing?.bodyweight ?? getDefaultBodyweightForDate(normalizedDate);
    progressWeightInput.value = weight === '' ? '' : weight;
  }

  renderProgressDraft(existing || {
    date: normalizedDate,
    bodyweight: getDefaultBodyweightForDate(normalizedDate),
    imageData: progressDraftImage,
    aiSummary: '',
    aiHeadline: '',
    aiObservations: [],
    aiVerdict: ''
  });
}

function renderProgressDraft(entry) {
  const date = normalizeDateValue(entry?.date) || todayISO();
  const bodyweight = entry?.bodyweight ?? '';
  const imageData = entry?.imageData || progressDraftImage || '';

  if (progressWeekBadge) progressWeekBadge.textContent = formatWeekBadge(date);
  if (progressEntryTitle) progressEntryTitle.textContent = entry?.id ? `Check-in ${formatShortDate(date)}` : 'Nieuwe check-in';
  if (progressEntryMeta) {
    progressEntryMeta.textContent = `${formatLongDate(date)}${bodyweight !== '' ? ` · ${formatNumber(Number(bodyweight) || bodyweight)} kg` : ' · nog geen gewicht ingevuld'}`;
  }

  if (progressPhotoPreview) {
    progressPhotoPreview.innerHTML = '';
    progressPhotoPreview.classList.toggle('empty', !imageData);
    if (imageData) {
      const img = document.createElement('img');
      img.src = imageData;
      img.alt = `Progressiefoto ${date}`;
      progressPhotoPreview.appendChild(img);
    } else {
      progressPhotoPreview.textContent = 'Nog geen foto gekozen.';
    }
  }
}

function getProgressDraftEntry() {
  const date = normalizeDateValue(progressDateInput?.value || todayISO()) || todayISO();
  const existing = getProgressEntryByDate(date);
  return {
    id: existing?.id || uid(),
    date,
    bodyweight: progressWeightInput?.value ?? '',
    imageData: progressDraftImage || existing?.imageData || '',
    aiSummary: existing?.aiSummary || '',
    aiHeadline: existing?.aiHeadline || '',
    aiObservations: existing?.aiObservations || [],
    aiVerdict: existing?.aiVerdict || '',
    analyzedAt: existing?.analyzedAt || 0,
    updatedAt: Date.now()
  };
}

function upsertProgressEntry(entry) {
  const entries = loadProgressEntries().filter(item => item.date !== entry.date);
  entries.push({
    ...entry,
    updatedAt: Date.now()
  });
  saveProgressEntries(entries);
  emitCloudChange('meta');
  renderProgressTimeline();
}

function deleteProgressEntry(entryDate) {
  const entries = loadProgressEntries().filter(entry => entry.date !== entryDate);
  saveProgressEntries(entries);
  emitCloudChange('meta');
  renderProgressTimeline();
  fillProgressDraft(progressDateInput?.value || todayISO());
}

function loadVisionSettingsIntoForm() {
  const settings = loadVisionSettings();
  if (visionApiKeyInput) visionApiKeyInput.value = settings.apiKey;
  if (visionModelSelect) visionModelSelect.value = settings.model;
  setVisionStatus(settings.apiKey
    ? 'OpenAI key staat lokaal klaar op dit apparaat.'
    : 'Je API key blijft lokaal op dit apparaat opgeslagen.');
}

function saveVisionSettingsFromForm() {
  saveVisionSettings({
    apiKey: visionApiKeyInput?.value || '',
    model: visionModelSelect?.value || 'gpt-4.1-mini'
  });
  setVisionStatus('AI-instellingen lokaal opgeslagen op dit apparaat.');
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Kon de foto niet lezen.'));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Kon de foto niet laden.'));
    img.src = src;
  });
}

async function compressImageFile(file) {
  const source = await fileToDataUrl(file);
  const image = await loadImageElement(source);
  const maxWidth = 1280;
  const scale = Math.min(1, maxWidth / image.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

function getPreviousProgressEntry(date) {
  const entries = loadProgressEntries()
    .filter(entry => entry.date < date && entry.imageData)
    .sort((a, b) => a.date.localeCompare(b.date));
  return entries[entries.length - 1] || null;
}

function extractResponseText(response) {
  const parts = [];
  (response?.output || []).forEach(item => {
    if (item?.type !== 'message') return;
    (item.content || []).forEach(content => {
      if (content?.type === 'output_text' && content.text) {
        parts.push(content.text);
      }
    });
  });
  return parts.join('\n').trim();
}

async function analyzeProgressEntry() {
  const entry = getProgressDraftEntry();
  if (!entry.imageData) {
    alert('Voeg eerst een weekfoto toe voordat je AI-analyse start.');
    return;
  }

  const liveSettings = {
    apiKey: String(visionApiKeyInput?.value || '').trim(),
    model: String(visionModelSelect?.value || 'gpt-4.1-mini').trim() || 'gpt-4.1-mini'
  };
  if (liveSettings.apiKey) {
    saveVisionSettings(liveSettings);
  }
  const settings = liveSettings.apiKey ? liveSettings : loadVisionSettings();
  if (!settings.apiKey) {
    alert('Vul eerst je OpenAI API key in en sla die op.');
    return;
  }

  const previous = getPreviousProgressEntry(entry.date);
  const comparisonLine = previous
    ? `Vergelijk de huidige foto met de vorige check-in van ${formatShortDate(previous.date)} (${previous.bodyweight || '?'} kg).`
    : 'Er is nog geen eerdere foto beschikbaar, beoordeel alleen de huidige vorm.';

  setVisionStatus('AI bekijkt je foto en schrijft een eerlijke samenvatting...');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.model || 'gpt-4.1-mini',
      input: [{
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `Je bent een eerlijke physique coach. Beoordeel in het Nederlands uitsluitend zichtbare spieropbouw, spiermassa, spierverhoudingen en lichaamsopbouw/lichaamssamenstelling. Negeer expliciet gezicht, huid, kleding, stijl, aantrekkelijkheid, achtergrond en alle andere niet-relevante factoren. Noem alleen kort onzekerheid als de foto door hoek, belichting of pose de beoordeling van spieropbouw belemmert. ${comparisonLine} Huidige datum: ${entry.date}. Huidig gewicht: ${entry.bodyweight || 'onbekend'} kg. Geef JSON met headline, verdict, summary en observations (max 4 korte bullets).`
          },
          ...(previous ? [
            { type: 'input_text', text: `Vorige foto (${previous.date}, ${previous.bodyweight || 'onbekend'} kg):` },
            { type: 'input_image', image_url: previous.imageData, detail: 'high' }
          ] : []),
          { type: 'input_text', text: `Huidige foto (${entry.date}, ${entry.bodyweight || 'onbekend'} kg):` },
          { type: 'input_image', image_url: entry.imageData, detail: 'high' }
        ]
      }],
      text: {
        format: {
          type: 'json_schema',
          name: 'physique_progress_review',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              headline: { type: 'string' },
              verdict: { type: 'string' },
              summary: { type: 'string' },
              observations: {
                type: 'array',
                items: { type: 'string' },
                maxItems: 4
              }
            },
            required: ['headline', 'verdict', 'summary', 'observations']
          }
        }
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `OpenAI fout ${response.status}`);
  }

  const data = await response.json();
  const text = extractResponseText(data);
  const parsed = JSON.parse(text);

  const updated = {
    ...entry,
    aiHeadline: parsed.headline || '',
    aiVerdict: parsed.verdict || '',
    aiSummary: parsed.summary || '',
    aiObservations: Array.isArray(parsed.observations) ? parsed.observations : [],
    analyzedAt: Date.now(),
    updatedAt: Date.now()
  };

  upsertProgressEntry(updated);
  fillProgressDraft(updated.date);
  setVisionStatus('AI-samenvatting opgeslagen.');
}

function renderProgressTimeline() {
  if (!progressTimeline || !progressEmpty) return;
  const entries = loadProgressEntries().sort((a, b) => b.date.localeCompare(a.date));
  progressTimeline.innerHTML = '';
  progressEmpty.style.display = entries.length ? 'none' : 'block';

  entries.forEach(entry => {
    const article = document.createElement('article');
    article.className = 'timeline-card';
    article.innerHTML = `
      <div class="timeline-media">${entry.imageData ? `<img src="${entry.imageData}" alt="Progressiefoto ${entry.date}" />` : ''}</div>
      <div class="timeline-content">
        <div class="timeline-head">
          <span class="timeline-week">${formatWeekBadge(entry.date)}</span>
          <span class="badge">${formatShortDate(entry.date)}</span>
        </div>
        <div class="timeline-meta">
          <span>Datum: ${formatLongDate(entry.date)}</span>
          <span>Gewicht: ${entry.bodyweight !== '' ? `${formatNumber(Number(entry.bodyweight) || entry.bodyweight)} kg` : 'niet ingevuld'}</span>
        </div>
        <div class="timeline-ai">
          <h4>${entry.aiHeadline || 'Nog geen AI-analyse'}</h4>
          <p>${entry.aiSummary || 'Voeg een foto toe en klik op "Analyseer met AI" om een eerlijke samenvatting te laten schrijven.'}</p>
          ${entry.aiVerdict ? `<strong>${entry.aiVerdict}</strong>` : '<span class="timeline-placeholder">Nog geen verdict</span>'}
          ${entry.aiObservations?.length ? `<ul class="timeline-observations">${entry.aiObservations.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
        </div>
        <div class="timeline-actions">
          <button class="ghost timeline-edit" type="button" data-date="${entry.date}">Bewerk</button>
          <button class="ghost timeline-analyze" type="button" data-date="${entry.date}">Analyseer opnieuw</button>
          <button class="danger timeline-delete" type="button" data-date="${entry.date}">Verwijder</button>
        </div>
      </div>
    `;
    progressTimeline.appendChild(article);
  });
}

function saveProgressEntry() {
  const entry = getProgressDraftEntry();
  if (!entry.imageData) {
    alert('Voeg eerst een weekfoto toe voordat je deze week opslaat.');
    return;
  }
  upsertProgressEntry(entry);
  fillProgressDraft(entry.date);
  flashButtonLabel(saveProgressEntryBtn, 'Opgeslagen', 1100);
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
    bindLineChartHover(canvas, []);
    return;
  }

  const paddingLeft = 64;
  const paddingRight = 16;
  const paddingTop = 18;
  const paddingBottom = 42;
  const chartWidth = w - paddingLeft - paddingRight;
  const chartHeight = h - paddingTop - paddingBottom;
  const maxValue = getNiceAxisMax(Math.max(...points.map(p => p.volume), 10), 4);
  const minValue = 0;
  const ticks = 4;
  const xStep = chartWidth / (points.length - 1 || 1);
  const hitboxes = [];

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
  ctx.fillText('Totaal volume (kg)', 0, 0);
  ctx.restore();

  ctx.fillStyle = '#6a5e54';
  ctx.font = '700 11px Space Grotesk';
  ctx.textAlign = 'center';
  ctx.fillText('Datum', paddingLeft + chartWidth / 2, h - 8);

  for (let i = 0; i <= ticks; i += 1) {
    const value = (maxValue / ticks) * i;
    const y = h - paddingBottom - ((value - minValue) / (maxValue - minValue)) * chartHeight;
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
    ctx.fillText(`${formatNumber(value)} kg`, paddingLeft - 8, y);
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = paddingLeft + index * xStep;
    const y = h - paddingBottom - ((point.volume - minValue) / (maxValue - minValue)) * chartHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = dotColor;
  points.forEach((point, index) => {
    const x = paddingLeft + index * xStep;
    const y = h - paddingBottom - ((point.volume - minValue) / (maxValue - minValue)) * chartHeight;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    hitboxes.push({
      x,
      y,
      radius: 12,
      date: point.date,
      volume: point.volume,
      setsDetail: point.setsDetail
    });
  });

  const labelStep = Math.max(1, Math.ceil(points.length / 5));
  points.forEach((point, index) => {
    const isVisible = index === 0 || index === points.length - 1 || index % labelStep === 0;
    if (!isVisible) return;
    const x = paddingLeft + index * xStep;
    ctx.fillStyle = '#6a5e54';
    ctx.font = '11px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(formatAxisDate(point.date), x, h - 22);
  });

  if (annotations.length) {
    ctx.font = '12px Space Grotesk';
    annotations.forEach(annotation => {
      const idx = annotation.index;
      if (idx < 0 || idx >= points.length) return;
      const point = points[idx];
      const x = paddingLeft + idx * xStep;
      const y = h - paddingBottom - ((point.volume - minValue) / (maxValue - minValue)) * chartHeight;
      ctx.fillStyle = annotation.color || '#1a1a1a';
      ctx.fillText(annotation.label, x + 6, y - 8);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = annotation.color || '#1a1a1a';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  bindLineChartHover(canvas, hitboxes);
}

function flashSaved() {
  const original = saveDayBtn.textContent;
  saveDayBtn.textContent = 'Opgeslagen';
  setTimeout(() => {
    saveDayBtn.textContent = original;
  }, 800);
}

function escapeSpreadsheetXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const textEncoder = new TextEncoder();
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let crc = i;
    for (let j = 0; j < 8; j += 1) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[i] = crc >>> 0;
  }
  return table;
})();

function encodeUtf8(value) {
  return textEncoder.encode(String(value));
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getZipDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | Math.floor(date.getSeconds() / 2),
    date: (((year - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0x0f) << 5) | (date.getDate() & 0x1f)
  };
}

function toSpreadsheetColumnName(index) {
  let column = '';
  let current = index + 1;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    current = Math.floor((current - 1) / 26);
  }
  return column;
}

function sanitizeSheetNames(sheets) {
  const used = new Set();
  return sheets.map((sheet, index) => {
    const base = String(sheet?.name || `Sheet ${index + 1}`)
      .replace(/[\\/*?:[\]]/g, ' ')
      .trim() || `Sheet ${index + 1}`;
    let candidate = base.slice(0, 31);
    let suffix = 2;
    while (used.has(candidate)) {
      const token = ` ${suffix}`;
      candidate = `${base.slice(0, Math.max(1, 31 - token.length))}${token}`;
      suffix += 1;
    }
    used.add(candidate);
    return {
      name: candidate,
      rows: Array.isArray(sheet?.rows) ? sheet.rows : []
    };
  });
}

function createXlsxCell(value, rowIndex, cellIndex) {
  const ref = `${toSpreadsheetColumnName(cellIndex)}${rowIndex + 1}`;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${ref}"><v>${value}</v></c>`;
  }
  const text = value === null || value === undefined ? '' : String(value);
  const preserve = /^\s|\s$/.test(text) ? ' xml:space="preserve"' : '';
  return `<c r="${ref}" t="inlineStr"><is><t${preserve}>${escapeSpreadsheetXml(text)}</t></is></c>`;
}

function buildWorksheetXml(rows) {
  const sheetRows = (rows || []).map((row, rowIndex) => {
    const cells = (row || []).map((cell, cellIndex) => createXlsxCell(cell, rowIndex, cellIndex)).join('');
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetRows}</sheetData>
</worksheet>`;
}

function buildWorkbookFiles(sheets) {
  const safeSheets = sanitizeSheetNames(sheets);
  const workbookSheets = safeSheets.map((sheet, index) =>
    `<sheet name="${escapeSpreadsheetXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
  ).join('');
  const workbookRels = safeSheets.map((_, index) =>
    `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
  ).join('');
  const worksheetOverrides = safeSheets.map((_, index) =>
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  ).join('');

  const files = [
    {
      name: '[Content_Types].xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  ${worksheetOverrides}
</Types>`
    },
    {
      name: '_rels/.rels',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
    },
    {
      name: 'docProps/core.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Fitness Daglog</dc:creator>
  <cp:lastModifiedBy>Fitness Daglog</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`
    },
    {
      name: 'docProps/app.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Fitness Daglog</Application>
  <TitlesOfParts>
    <vt:vector size="${safeSheets.length}" baseType="lpstr">${safeSheets.map(sheet => `<vt:lpstr>${escapeSpreadsheetXml(sheet.name)}</vt:lpstr>`).join('')}</vt:vector>
  </TitlesOfParts>
</Properties>`
    },
    {
      name: 'xl/workbook.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>${workbookSheets}</sheets>
</workbook>`
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${workbookRels}
  <Relationship Id="rId${safeSheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
    },
    {
      name: 'xl/styles.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Aptos"/></font></fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`
    }
  ];

  safeSheets.forEach((sheet, index) => {
    files.push({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      data: buildWorksheetXml(sheet.rows)
    });
  });

  return files;
}

function createZipBlob(files) {
  const fileEntries = files.map(file => ({
    nameBytes: encodeUtf8(file.name),
    dataBytes: typeof file.data === 'string' ? encodeUtf8(file.data) : file.data
  }));
  const parts = [];
  const centralDirectory = [];
  let offset = 0;
  const timestamp = getZipDosDateTime();

  fileEntries.forEach(file => {
    const crc = crc32(file.dataBytes);
    const localHeader = new Uint8Array(30 + file.nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, timestamp.time, true);
    localView.setUint16(12, timestamp.date, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, file.dataBytes.length, true);
    localView.setUint32(22, file.dataBytes.length, true);
    localView.setUint16(26, file.nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(file.nameBytes, 30);
    parts.push(localHeader, file.dataBytes);

    const centralHeader = new Uint8Array(46 + file.nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, timestamp.time, true);
    centralView.setUint16(14, timestamp.date, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, file.dataBytes.length, true);
    centralView.setUint32(24, file.dataBytes.length, true);
    centralView.setUint16(28, file.nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(file.nameBytes, 46);
    centralDirectory.push(centralHeader);

    offset += localHeader.length + file.dataBytes.length;
  });

  const centralSize = centralDirectory.reduce((sum, entry) => sum + entry.length, 0);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, fileEntries.length, true);
  endView.setUint16(10, fileEntries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  endView.setUint16(20, 0, true);

  return new Blob([...parts, ...centralDirectory, endRecord], { type: XLSX_MIME });
}

function downloadWorkbookXml(filename, sheets) {
  const blob = createZipBlob(buildWorkbookFiles(sheets));
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportCurrentDayExcel() {
  const day = cloneState();
  const rows = [[
    'Datum',
    'Sessie',
    'Lichaamsgewicht (kg)',
    'Starttijd',
    'Eindtijd',
    'Trainingsduur (min)',
    'Oefeningen',
    'Sets',
    'Totaal volume (kg)'
  ], [
    state.date,
    day.sessionName || '',
    day.bodyweight === '' ? '' : Number(day.bodyweight) || day.bodyweight,
    day.startTime || '',
    day.endTime || '',
    computeTrainingDurationMinutes(day),
    day.exercises.length,
    day.exercises.reduce((sum, exercise) => sum + (exercise.sets || []).length, 0),
    day.exercises.reduce((sum, exercise) => sum + (exercise.sets || []).reduce((setSum, set) => setSum + setVolume(set, exercise), 0), 0)
  ]];

  const setRows = [[
    'Datum',
    'Sessie',
    'Oefening',
    'Primary',
    'Secondary',
    'Notities',
    'Set',
    'Modus',
    'Starttijd',
    'Eindtijd',
    'Reps',
    'Gewicht',
    'Reps links',
    'Gewicht links',
    'Reps rechts',
    'Gewicht rechts',
    'RPE',
    'Afgevinkt',
    'Volume (kg)'
  ]];

  day.exercises.forEach(exercise => {
    const { primary, secondaryGroups } = resolveExerciseMuscles(exercise);
    (exercise.sets || []).forEach((set, index) => {
      const repData = getSetRepData(set, exercise);
      const weightData = getSetWeightData(set, exercise);
      const splitMode = repData.splitMode || weightData.splitMode;
      setRows.push([
        state.date,
        day.sessionName || '',
        exercise.name || '',
        primary,
        secondaryGroups.join(', '),
        exercise.notes || '',
        index + 1,
        splitMode ? 'Alternating' : 'Standaard',
        day.startTime || '',
        day.endTime || '',
        splitMode ? '' : (repData.reps ?? ''),
        splitMode ? '' : (weightData.weight ?? ''),
        splitMode ? (repData.left ?? '') : '',
        splitMode ? (weightData.left ?? '') : '',
        splitMode ? (repData.right ?? '') : '',
        splitMode ? (weightData.right ?? '') : '',
        set.rpe ?? '',
        set.done ? 'Ja' : '',
        setVolume(set, exercise)
      ]);
    });
  });

  downloadWorkbookXml(`fitness-logboek-${state.date || todayISO()}.xlsx`, [
    { name: 'Samenvatting', rows },
    { name: 'Sets', rows: setRows }
  ]);
}

function getCurrentAllData() {
  const all = loadAll();
  all[state.date] = cloneState();
  return all;
}

function exportWeekPrimaryData() {
  const all = getCurrentAllData();
  const dates = getWeekDates(selectedDashboardWeek || getStoredDashboardWeek());
  const { primaryTotals } = computeWeekTotals(all, dates);
  const groups = PRIMARY_GROUPS.filter(group => primaryTotals[group].some(value => value > 0));
  const visibleGroups = selectedPrimaryChartGroup ? [selectedPrimaryChartGroup] : groups;
  const rows = [['Datum', 'Primary muscle', 'Totaal volume (kg)']];

  dates.forEach((date, index) => {
    visibleGroups.forEach(group => {
      const volume = primaryTotals[group]?.[index] || 0;
      if (!volume) return;
      rows.push([date, group, volume]);
    });
  });

  downloadWorkbookXml(`weekvolume-primair-${selectedDashboardWeek || formatWeekInputValue(todayISO())}.xlsx`, [
    { name: 'Weekvolume primair', rows }
  ]);
}

function exportWeekSecondaryData() {
  const all = getCurrentAllData();
  const dates = getWeekDates(selectedDashboardWeek || getStoredDashboardWeek());
  const { secondaryTotals } = computeWeekTotals(all, dates);
  const groups = PRIMARY_GROUPS.filter(group => secondaryTotals[group].some(value => value > 0));
  const visibleGroups = selectedSecondaryChartGroup ? [selectedSecondaryChartGroup] : groups;
  const rows = [['Datum', 'Secondary muscle', 'Totaal volume (kg)']];

  dates.forEach((date, index) => {
    visibleGroups.forEach(group => {
      const volume = secondaryTotals[group]?.[index] || 0;
      if (!volume) return;
      rows.push([date, group, volume]);
    });
  });

  downloadWorkbookXml(`weekvolume-secundair-${selectedDashboardWeek || formatWeekInputValue(todayISO())}.xlsx`, [
    { name: 'Weekvolume secundair', rows }
  ]);
}

function exportDurationData() {
  const all = getCurrentAllData();
  const dates = getWeekDates(selectedDashboardWeek || getStoredDashboardWeek());
  const rows = [['Datum', 'Starttijd', 'Eindtijd', 'Trainingsduur (min)']];
  getDurationRows(all, dates).forEach(row => {
    rows.push([row.date, row.startTime || '', row.endTime || '', row.minutes]);
  });

  downloadWorkbookXml(`trainingsduur-${selectedDashboardWeek || formatWeekInputValue(todayISO())}.xlsx`, [
    { name: 'Trainingsduur', rows }
  ]);
}

function exportFocusData() {
  const all = getCurrentAllData();
  const selectedName = (focusExerciseName || '').trim() || (state.exercises.find(ex => ex.id === activeExerciseId)?.name || '').trim();
  if (!selectedName) {
    alert('Kies eerst een oefening op het dashboard.');
    return;
  }

  const { rows: progressRows } = buildExerciseProgress(selectedName, all);
  const rows = [['Datum', 'Oefening', 'Totaal volume (kg)', 'Sets x reps x gewicht']];
  progressRows.forEach(row => {
    rows.push([row.date, selectedName, row.volume, row.setsDetail || '-']);
  });

  downloadWorkbookXml(`oefening-focus-${selectedName.toLowerCase().replace(/[^a-z0-9]+/gi, '-') || 'oefening'}.xlsx`, [
    { name: 'Oefening focus', rows }
  ]);
}

function exportBodyweightData() {
  const rows = [['Datum', 'Lichaamsgewicht (kg)']];
  getBodyweightPoints(getCurrentAllData()).forEach(point => {
    rows.push([point.date, point.weight]);
  });

  downloadWorkbookXml('lichaamsgewicht-trend.xlsx', [
    { name: 'Lichaamsgewicht', rows }
  ]);
}

function exportData() {
  const all = loadAll();
  all[state.date] = cloneState();
  const payload = {
    version: 2,
    days: all,
    routines: loadRoutines(),
    customExercises: loadCustomExerciseLibrary(),
    progressEntries: loadProgressEntries()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `fitness-log-${todayISO()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportRoutinesFile() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    routines: loadRoutines()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `vaste-dagen-${todayISO()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  flashButtonLabel(downloadRoutinesBtn, 'Gedownload', 1100);
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
      if (Array.isArray(data?.progressEntries)) saveProgressEntries(data.progressEntries);
      loadDay(state.date);
      renderExercises();
      renderRoutinePage();
      refreshProgress();
      renderProgressTimeline();
      fillProgressDraft(progressDateInput?.value || state.date || todayISO());
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
      const weightData = getSetWeightData(set, exercise);
      const weightValue = weightData.total;
      const reps = Number.isFinite(repsValue) && set.reps !== '' ? repsValue : '';
      const weight = Number.isFinite(weightValue) && weightData.hasWeight ? weightValue : '';
      const rpe = set.rpe ?? '';
      const done = set.done ? 'yes' : '';
      const volume = setVolume(set, exercise);

      totalSets += 1;
      totalVolume += volume;

      if (volume > bestVolume) {
        bestVolume = volume;
        best = set;
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

  const bestStr = best && bestVolume > 0 ? formatBestSet(best) : '-';
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
    (routines?.[day.key] || []).forEach(option => {
      (option?.exercises || []).forEach(item => {
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
    if (!routines[dayKey].length) {
      routines[dayKey].push(createRoutineOption(dayKey, 1));
    }
    routines[dayKey][0].exercises.push({
      id: uid(),
      name,
      notes: '',
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
    startTime: localDay.startTime || '',
    endTime: localDay.endTime || '',
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

if (pageStoryBtn) {
  pageStoryBtn.addEventListener('click', () => {
    renderProgressTimeline();
    setActivePage('story');
  });
}

if (pageDashboardBtn) {
  pageDashboardBtn.addEventListener('click', () => {
    setActivePage('dashboard');
  });
}

if (pageProgressBtn) {
  pageProgressBtn.addEventListener('click', () => {
    setActivePage('progress');
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
if (exportExcelLogBtn) exportExcelLogBtn.addEventListener('click', exportCurrentDayExcel);
if (addRoutineToDayBtn) addRoutineToDayBtn.addEventListener('click', addRoutineExercisesToCurrentDay);
if (addRoutineExerciseBtn) addRoutineExerciseBtn.addEventListener('click', addRoutineExercise);
if (addRoutineOptionBtn) addRoutineOptionBtn.addEventListener('click', addRoutineOption);
if (removeRoutineOptionBtn) removeRoutineOptionBtn.addEventListener('click', removeRoutineOption);
if (saveRoutineDayBtn) saveRoutineDayBtn.addEventListener('click', saveRoutineDay);
if (downloadRoutinesBtn) downloadRoutinesBtn.addEventListener('click', exportRoutinesFile);

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

if (startTimeInput) {
  startTimeInput.addEventListener('input', () => {
    state.startTime = startTimeInput.value;
    persist();
  });
}

if (endTimeInput) {
  endTimeInput.addEventListener('input', () => {
    state.endTime = endTimeInput.value;
    persist();
  });
}

if (routineSourceDaySelect) {
  routineSourceDaySelect.addEventListener('change', () => {
    updateRoutineApplyButton();
  });
}

if (routineSourceOptionSelect) {
  routineSourceOptionSelect.addEventListener('change', () => {
    updateRoutineApplyButton();
  });
}

if (dashboardWeekInput) {
  dashboardWeekInput.addEventListener('change', () => {
    setSelectedDashboardWeek(dashboardWeekInput.value);
  });
}

if (visitCountGranularitySelect) {
  visitCountGranularitySelect.addEventListener('change', () => {
    setSelectedVisitGranularity(visitCountGranularitySelect.value);
  });
}

[weekPrimaryLegend, weekSecondaryLegend].forEach(legend => {
  if (!legend) return;
  legend.addEventListener('click', event => {
    const button = event.target.closest('[data-chart-filter]');
    if (!button) return;
    setChartGroupFilter(button.dataset.chartFilter || '', button.dataset.group || '');
  });
});

if (dashboardWeekNowBtn) {
  dashboardWeekNowBtn.addEventListener('click', () => {
    setSelectedDashboardWeek(formatWeekInputValue(todayISO()));
  });
}

if (exportWeekPrimaryBtn) exportWeekPrimaryBtn.addEventListener('click', exportWeekPrimaryData);
if (exportWeekSecondaryBtn) exportWeekSecondaryBtn.addEventListener('click', exportWeekSecondaryData);
if (exportDurationBtn) exportDurationBtn.addEventListener('click', exportDurationData);
if (exportFocusBtn) exportFocusBtn.addEventListener('click', exportFocusData);
if (exportBodyweightBtn) exportBodyweightBtn.addEventListener('click', exportBodyweightData);

if (progressDateInput) {
  progressDateInput.addEventListener('change', () => {
    fillProgressDraft(progressDateInput.value || todayISO());
  });
}

if (progressWeightInput) {
  progressWeightInput.addEventListener('input', () => {
    renderProgressDraft(getProgressDraftEntry());
  });
}

if (progressPhotoInput) {
  progressPhotoInput.addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      progressDraftImage = await compressImageFile(file);
      renderProgressDraft(getProgressDraftEntry());
      setVisionStatus('Weekfoto geladen. Sla hem op of laat AI direct meekijken.');
    } catch (error) {
      alert(error.message || 'Kon de foto niet verwerken.');
    } finally {
      event.target.value = '';
    }
  });
}

if (saveProgressEntryBtn) saveProgressEntryBtn.addEventListener('click', saveProgressEntry);
if (saveVisionSettingsBtn) saveVisionSettingsBtn.addEventListener('click', saveVisionSettingsFromForm);
if (analyzeProgressBtn) {
  analyzeProgressBtn.addEventListener('click', async () => {
    try {
      await analyzeProgressEntry();
    } catch (error) {
      setVisionStatus(`AI-fout: ${error.message}`);
    }
  });
}

if (routineDayTabs) {
  routineDayTabs.addEventListener('click', event => {
    const button = event.target.closest('[data-day]');
    if (!button) return;
    setSelectedRoutineDay(button.dataset.day);
  });
}

if (routineOptionSelect) {
  routineOptionSelect.addEventListener('change', () => {
    setSelectedRoutineOption(routineOptionSelect.value);
  });
}

if (routineOptionNameInput) {
  routineOptionNameInput.addEventListener('input', event => handleRoutineInputChange(event.target));
  routineOptionNameInput.addEventListener('change', event => handleRoutineInputChange(event.target));
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

if (dayExerciseSummary) {
  dayExerciseSummary.addEventListener('click', event => {
    const trigger = event.target.closest('.day-exercise-link, .day-exercise');
    if (!trigger) return;
    const targetId = trigger.dataset.id || trigger.closest('.day-exercise')?.dataset.id || '';
    if (!targetId) return;
    jumpToExerciseInLogbook(targetId);
  });
}

if (progressTimeline) {
  progressTimeline.addEventListener('click', async event => {
    const editBtn = event.target.closest('.timeline-edit');
    if (editBtn) {
      fillProgressDraft(editBtn.dataset.date);
      setActivePage('progress');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const analyzeBtn = event.target.closest('.timeline-analyze');
    if (analyzeBtn) {
      fillProgressDraft(analyzeBtn.dataset.date);
      setActivePage('progress');
      try {
        await analyzeProgressEntry();
      } catch (error) {
        setVisionStatus(`AI-fout: ${error.message}`);
      }
      return;
    }

    const deleteBtn = event.target.closest('.timeline-delete');
    if (deleteBtn) {
      const targetDate = deleteBtn.dataset.date;
      if (confirm(`Weet je zeker dat je de progressie-entry van ${formatShortDate(targetDate)} wilt verwijderen?`)) {
        deleteProgressEntry(targetDate);
      }
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

  if (event.target.classList.contains('save-next-target')) {
    const exercise = state.exercises.find(ex => ex.id === exId);
    const result = saveExerciseNextTarget(exercise, card);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    const catalog = getExerciseCatalog(getCurrentDataSnapshot());
    document.querySelectorAll('.exercise-card').forEach(currentCard => {
      const select = currentCard.querySelector('.exercise-select');
      const currentExercise = state.exercises.find(ex => ex.id === currentCard.dataset.id);
      populateExerciseSelect(select, catalog, currentExercise?.name || '');
    });
    flashButtonLabel(event.target, 'Target bewaard', 1100);
    return;
  }

  if (event.target.classList.contains('add-target-set')) {
    appendTargetSetRow(card, normalizeTargetSet({
      weightMode: state.exercises.find(ex => ex.id === exId)?.splitWeightMode ? 'split' : 'single'
    }), getTargetSetRows(card).length);
    renumberTargetSetRows(card);
    return;
  }

  if (event.target.classList.contains('remove-target-set')) {
    const row = event.target.closest('.target-set-row');
    if (row) {
      row.remove();
      renumberTargetSetRows(card);
    }
    return;
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
    customExercises: loadCustomExerciseLibrary(),
    progressEntries: loadProgressEntries()
  };
}

function applyCloudPayload(payload, options = {}) {
  const nextDays = payload?.days && typeof payload.days === 'object' ? payload.days : {};
  const nextRoutines = payload?.routines && typeof payload.routines === 'object'
    ? payload.routines
    : createEmptyRoutines();
  const nextExercises = Array.isArray(payload?.customExercises) ? payload.customExercises : [];
  const nextProgressEntries = Array.isArray(payload?.progressEntries) ? payload.progressEntries : [];

  window.__fitnessApplyingRemote = true;
  try {
    saveAll(nextDays);
    saveRoutines(nextRoutines);
    saveCustomExerciseLibrary(nextExercises);
    saveProgressEntries(nextProgressEntries);
    if (options.clearSessionProtection !== false) {
      sessionProtectedDates.clear();
    }
    const activeDate = state.date || todayISO();
    if (dateInput) dateInput.value = activeDate;
    loadDay(activeDate);
    renderExercises();
    renderRoutinePage();
    refreshProgress();
    renderProgressTimeline();
    fillProgressDraft(progressDateInput?.value || activeDate);
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
  selectedVisitGranularity = getStoredVisitGranularity();
  const today = todayISO();
  dateInput.value = today;
  loadDay(today);
  setSelectedDashboardWeek(selectedDashboardWeek, { skipRefresh: true, skipPersist: true });
  setSelectedVisitGranularity(selectedVisitGranularity, { skipRefresh: true, skipPersist: true });
  loadVisionSettingsIntoForm();
  fillProgressDraft(today);
  renderExercises();
  renderRoutinePage();
  renderProgressTimeline();
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







