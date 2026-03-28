import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  collection,
  deleteDoc,
  doc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const DB_CONFIG_KEY = 'fitnessLog.dbConfig.v1';
const APP_NAME = 'fitness-log-cloud';

const configInput = document.getElementById('dbConfigJson');
const saveConfigBtn = document.getElementById('dbSaveConfig');
const signInBtn = document.getElementById('dbSignIn');
const signOutBtn = document.getElementById('dbSignOut');
const statusEl = document.getElementById('dbStatus');
const userEl = document.getElementById('dbUser');

const appApi = window.fitnessApp;

const dbState = {
  config: null,
  configSignature: '',
  app: null,
  auth: null,
  db: null,
  uid: '',
  authReady: false,
  daysReady: false,
  metaReady: false,
  remoteDays: {},
  remoteMeta: null,
  unsubAuth: null,
  unsubDays: null,
  unsubMeta: null,
  pendingDayDates: new Set(),
  metaDirty: false,
  syncTimer: null,
  writeInFlight: false,
  didBootstrapCloud: false
};

function setStatus(message) {
  if (statusEl) statusEl.textContent = message;
}

function setUserMessage(message) {
  if (userEl) userEl.textContent = message;
}

function normalizeFirebaseConfig(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const source = raw.config && typeof raw.config === 'object' ? raw.config : raw;
  const config = {
    apiKey: String(source.apiKey || '').trim(),
    authDomain: String(source.authDomain || '').trim(),
    projectId: String(source.projectId || '').trim(),
    appId: String(source.appId || '').trim(),
    storageBucket: String(source.storageBucket || '').trim(),
    messagingSenderId: String(source.messagingSenderId || '').trim()
  };

  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    return null;
  }

  return config;
}

function configSignature(config) {
  return JSON.stringify({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    appId: config.appId,
    storageBucket: config.storageBucket || '',
    messagingSenderId: config.messagingSenderId || ''
  });
}

function loadStoredConfig() {
  const raw = localStorage.getItem(DB_CONFIG_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const config = normalizeFirebaseConfig(parsed);
    return config ? { provider: 'firebase', config } : null;
  } catch {
    return null;
  }
}

function saveStoredConfig(config) {
  localStorage.setItem(DB_CONFIG_KEY, JSON.stringify({
    provider: 'firebase',
    config
  }));
}

function fillConfigInput(config) {
  if (!configInput || !config) return;
  configInput.value = JSON.stringify(config, null, 2);
}

function hasAnyRoutineData(routines) {
  return Object.values(routines || {}).some(items => Array.isArray(items) && items.length > 0);
}

function dayHasContent(day) {
  return !!(
    (day?.sessionName || '').trim()
    || `${day?.bodyweight ?? ''}` !== ''
    || (Array.isArray(day?.exercises) && day.exercises.length)
  );
}

function hasAnyLocalData(payload) {
  return Object.values(payload?.days || {}).some(dayHasContent)
    || hasAnyRoutineData(payload?.routines)
    || (payload?.customExercises || []).length > 0;
}

function isRemotePayloadEmpty(payload) {
  return !Object.keys(payload?.days || {}).length
    && !hasAnyRoutineData(payload?.routines)
    && !(payload?.customExercises || []).length;
}

function buildRemotePayload() {
  return {
    days: dbState.remoteDays || {},
    routines: appApi.normalizeRoutineState(
      dbState.remoteMeta?.routines || appApi.createEmptyRoutines()
    ),
    customExercises: Array.isArray(dbState.remoteMeta?.customExercises)
      ? dbState.remoteMeta.customExercises
      : []
  };
}

function isCoarsePointer() {
  return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
}

function cleanUpSubscriptions() {
  if (dbState.unsubDays) dbState.unsubDays();
  if (dbState.unsubMeta) dbState.unsubMeta();
  dbState.unsubDays = null;
  dbState.unsubMeta = null;
  dbState.daysReady = false;
  dbState.metaReady = false;
}

async function uploadPayloadToCloud(payload, options = {}) {
  if (!dbState.db || !dbState.uid) return;

  const tasks = [];
  const days = payload?.days || {};

  Object.entries(days).forEach(([date, day]) => {
    if (!dayHasContent(day)) return;
    const ref = doc(dbState.db, 'users', dbState.uid, 'days', date);
    tasks.push(setDoc(ref, day || {
      sessionName: '',
      bodyweight: '',
      updatedAt: Date.now(),
      exercises: []
    }));
  });

  if (options.includeMeta !== false) {
    const metaRef = doc(dbState.db, 'users', dbState.uid, 'meta', 'config');
    tasks.push(setDoc(metaRef, {
      routines: payload?.routines || appApi.createEmptyRoutines(),
      customExercises: payload?.customExercises || [],
      updatedAt: Date.now()
    }));
  }

  if (!tasks.length) return;
  await Promise.all(tasks);
}

async function flushPendingWrites() {
  if (!dbState.db || !dbState.uid || dbState.writeInFlight) return;

  const payload = appApi.getCloudPayload();
  const dayDates = Array.from(dbState.pendingDayDates);
  const shouldWriteMeta = dbState.metaDirty;

  dbState.pendingDayDates.clear();
  dbState.metaDirty = false;

  const tasks = [];
  dayDates.forEach(date => {
    const day = payload.days?.[date];
    const ref = doc(dbState.db, 'users', dbState.uid, 'days', date);
    if (!day || !dayHasContent(day)) {
      tasks.push(deleteDoc(ref));
      return;
    }
    tasks.push(setDoc(ref, day));
  });

  if (shouldWriteMeta) {
    tasks.push(setDoc(doc(dbState.db, 'users', dbState.uid, 'meta', 'config'), {
      routines: payload.routines || appApi.createEmptyRoutines(),
      customExercises: payload.customExercises || [],
      updatedAt: Date.now()
    }));
  }

  if (!tasks.length) return;

  dbState.writeInFlight = true;
  setStatus('Database sync bezig...');

  try {
    await Promise.all(tasks);
    setStatus('Database live en gesynchroniseerd.');
  } catch (error) {
    setStatus(`Database fout: ${error.message}`);
  } finally {
    dbState.writeInFlight = false;
    if (dbState.pendingDayDates.size || dbState.metaDirty) {
      scheduleWriteFlush();
    }
  }
}

function scheduleWriteFlush() {
  if (dbState.syncTimer) clearTimeout(dbState.syncTimer);
  dbState.syncTimer = setTimeout(() => {
    dbState.syncTimer = null;
    flushPendingWrites();
  }, 500);
}

function handleLocalDataChange(event) {
  if (!dbState.db || !dbState.uid || window.__fitnessApplyingRemote) return;

  const scope = event.detail?.scope || 'all';
  const date = event.detail?.date || appApi.getCurrentDate();

  if (scope === 'day' || scope === 'all') {
    if (date) dbState.pendingDayDates.add(date);
  }
  if (scope === 'meta' || scope === 'all') {
    dbState.metaDirty = true;
  }

  scheduleWriteFlush();
}

async function applyRemotePayload() {
  if (!dbState.daysReady || !dbState.metaReady) return;

  const remotePayload = buildRemotePayload();

  if (!dbState.didBootstrapCloud) {
    dbState.didBootstrapCloud = true;
    const localPayload = appApi.getCloudPayload();
    if (isRemotePayloadEmpty(remotePayload) && hasAnyLocalData(localPayload)) {
      setStatus('Lokale data wordt eenmalig naar de database gezet...');
      try {
        await uploadPayloadToCloud(localPayload);
        setStatus('Lokale data staat nu in de database.');
      } catch (error) {
        setStatus(`Database fout: ${error.message}`);
      }
      return;
    }
  }

  appApi.applyCloudPayload(remotePayload);
  setStatus('Database live en gesynchroniseerd.');
}

function normalizeRemoteDay(data) {
  return {
    sessionName: String(data?.sessionName || ''),
    bodyweight: data?.bodyweight ?? '',
    updatedAt: Number(data?.updatedAt) || 0,
    exercises: Array.isArray(data?.exercises) ? data.exercises : []
  };
}

function subscribeToUserData(user) {
  cleanUpSubscriptions();
  dbState.remoteDays = {};
  dbState.remoteMeta = null;
  dbState.daysReady = false;
  dbState.metaReady = false;

  dbState.unsubDays = onSnapshot(
    collection(dbState.db, 'users', user.uid, 'days'),
    snapshot => {
      const nextDays = {};
      snapshot.forEach(item => {
        nextDays[item.id] = normalizeRemoteDay(item.data());
      });
      dbState.remoteDays = nextDays;
      dbState.daysReady = true;
      applyRemotePayload();
    },
    error => setStatus(`Database fout: ${error.message}`)
  );

  dbState.unsubMeta = onSnapshot(
    doc(dbState.db, 'users', user.uid, 'meta', 'config'),
    snapshot => {
      dbState.remoteMeta = snapshot.exists() ? snapshot.data() : {
        routines: appApi.createEmptyRoutines(),
        customExercises: []
      };
      dbState.metaReady = true;
      applyRemotePayload();
    },
    error => setStatus(`Database fout: ${error.message}`)
  );
}

function setSignedOutState() {
  dbState.uid = '';
  cleanUpSubscriptions();
  setUserMessage('Nog niet ingelogd.');
  if (dbState.config) {
    setStatus('Database klaar. Log in met Google om telefoon en pc gelijk te houden.');
  } else {
    setStatus('Plak je Firebase config om je database te activeren.');
  }
}

async function handleAuthState(user) {
  if (!user) {
    setSignedOutState();
    return;
  }

  dbState.uid = user.uid;
  const label = user.displayName || user.email || 'Ingelogd';
  setUserMessage(`Ingelogd als ${label}`);
  setStatus('Database wordt verbonden...');
  subscribeToUserData(user);
}

async function bootstrapFirebase() {
  const stored = loadStoredConfig();
  if (!stored) {
    setStatus('Plak je Firebase config om je database te activeren.');
    return;
  }

  const nextSignature = configSignature(stored.config);
  if (dbState.app && dbState.configSignature === nextSignature) {
    return;
  }

  if (dbState.app && dbState.configSignature !== nextSignature) {
    setStatus('Nieuwe config opgeslagen. Herlaad de pagina om die te gebruiken.');
    return;
  }

  dbState.config = stored.config;
  dbState.configSignature = nextSignature;
  fillConfigInput(stored.config);

  const existingApp = getApps().find(app => app.name === APP_NAME);
  dbState.app = existingApp || initializeApp(stored.config, APP_NAME);
  dbState.auth = getAuth(dbState.app);
  try {
    dbState.db = initializeFirestore(dbState.app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
  } catch {
    dbState.db = initializeFirestore(dbState.app, {});
  }

  try {
    await setPersistence(dbState.auth, browserLocalPersistence);
  } catch {
    // Keep default persistence if explicit local persistence fails.
  }

  if (!dbState.unsubAuth) {
    dbState.unsubAuth = onAuthStateChanged(dbState.auth, handleAuthState);
  }

  try {
    await getRedirectResult(dbState.auth);
  } catch (error) {
    setStatus(`Login fout: ${error.message}`);
  }

  if (!dbState.auth.currentUser) {
    setStatus('Database klaar. Log in met Google om telefoon en pc gelijk te houden.');
  }
}

function parseConfigFromInput() {
  const raw = configInput?.value?.trim();
  if (!raw) return null;
  try {
    return normalizeFirebaseConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function handleSaveConfig() {
  const config = parseConfigFromInput();
  if (!config) {
    setStatus('De Firebase config JSON is niet geldig of mist verplichte velden.');
    return;
  }

  saveStoredConfig(config);
  dbState.config = config;
  dbState.configSignature = configSignature(config);
  setStatus('Databaseconfig opgeslagen.');
  await bootstrapFirebase();
}

async function handleSignIn() {
  if (!dbState.auth) {
    await bootstrapFirebase();
  }
  if (!dbState.auth) {
    setStatus('Stel eerst je Firebase database in.');
    return;
  }

  const provider = new GoogleAuthProvider();

  try {
    if (isCoarsePointer()) {
      await signInWithRedirect(dbState.auth, provider);
      return;
    }
    await signInWithPopup(dbState.auth, provider);
  } catch (error) {
    setStatus(`Login fout: ${error.message}`);
  }
}

async function handleSignOut() {
  if (!dbState.auth) return;
  try {
    await signOut(dbState.auth);
    setStatus('Uitgelogd. Je data blijft veilig in de database staan.');
  } catch (error) {
    setStatus(`Uitloggen mislukt: ${error.message}`);
  }
}

window.addEventListener('fitness:data-changed', handleLocalDataChange);

if (saveConfigBtn) saveConfigBtn.addEventListener('click', handleSaveConfig);
if (signInBtn) signInBtn.addEventListener('click', handleSignIn);
if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);

const stored = loadStoredConfig();
if (stored?.config) {
  fillConfigInput(stored.config);
}
bootstrapFirebase();
