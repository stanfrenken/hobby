const DB_CONFIG_KEY = 'fitnessLog.dbConfig.v1';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
const DRIVE_FILE_NAME = 'fitness-log.json';
const DRIVE_REFRESH_INTERVAL_MS = 15000;
const LOCAL_PROTECT_MS = 5000;

const configInput = document.getElementById('dbConfigJson');
const saveConfigBtn = document.getElementById('dbSaveConfig');
const signInBtn = document.getElementById('dbSignIn');
const signOutBtn = document.getElementById('dbSignOut');
const statusEl = document.getElementById('dbStatus');
const userEl = document.getElementById('dbUser');

const appApi = window.fitnessApp;

const driveState = {
  clientId: '',
  tokenClient: null,
  accessToken: '',
  tokenExpiresAt: 0,
  fileId: '',
  syncTimer: null,
  refreshTimer: null,
  writeInFlight: false,
  refreshInFlight: false,
  signedIn: false,
  bootstrapped: false,
  lastRemoteModifiedAt: 0,
  lastRemoteEnvelopeAt: 0,
  lastLocalChangeAt: 0
};

function setStatus(message) {
  if (statusEl) statusEl.textContent = message;
}

function setUserMessage(message) {
  if (userEl) userEl.textContent = message;
}

function normalizeDriveConfig(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.clientId === 'string' && raw.clientId.trim()) {
    return { clientId: raw.clientId.trim() };
  }
  return null;
}

function loadStoredConfig() {
  const raw = localStorage.getItem(DB_CONFIG_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.provider !== 'drive') return null;
    return normalizeDriveConfig(parsed);
  } catch {
    return null;
  }
}

function saveStoredConfig(config) {
  localStorage.setItem(DB_CONFIG_KEY, JSON.stringify({
    provider: 'drive',
    clientId: config.clientId
  }));
}

function fillConfigInput(config) {
  if (!configInput || !config) return;
  configInput.value = JSON.stringify(config, null, 2);
}

function dayHasContent(day) {
  return !!(
    (day?.sessionName || '').trim()
    || `${day?.bodyweight ?? ''}` !== ''
    || (Array.isArray(day?.exercises) && day.exercises.length)
  );
}

function hasAnyRoutineData(routines) {
  return Object.values(routines || {}).some(items => Array.isArray(items) && items.length > 0);
}

function hasAnyLocalData(payload) {
  return Object.values(payload?.days || {}).some(dayHasContent)
    || hasAnyRoutineData(payload?.routines)
    || (payload?.customExercises || []).length > 0;
}

function buildEnvelope(payload) {
  const payloadUpdatedAt = getPayloadUpdatedAt(payload);
  return {
    version: 1,
    updatedAt: Math.max(Date.now(), payloadUpdatedAt, driveState.lastLocalChangeAt || 0),
    days: payload?.days || {},
    routines: payload?.routines || appApi.createEmptyRoutines(),
    customExercises: payload?.customExercises || []
  };
}

function getPayloadUpdatedAt(payload) {
  const dayStamp = Object.values(payload?.days || {}).reduce((max, day) => {
    return Math.max(max, Number(day?.updatedAt) || 0);
  }, 0);
  return Math.max(dayStamp, driveState.lastLocalChangeAt || 0);
}

function normalizeRemoteEnvelope(payload) {
  return {
    days: payload?.days && typeof payload.days === 'object' ? payload.days : {},
    routines: appApi.normalizeRoutineState(
      payload?.routines && typeof payload.routines === 'object'
        ? payload.routines
        : appApi.createEmptyRoutines()
    ),
    customExercises: Array.isArray(payload?.customExercises) ? payload.customExercises : []
  };
}

async function waitForGoogleIdentity() {
  if (window.google?.accounts?.oauth2) return;
  await new Promise((resolve, reject) => {
    const started = Date.now();
    const timer = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        clearInterval(timer);
        resolve();
        return;
      }
      if (Date.now() - started > 8000) {
        clearInterval(timer);
        reject(new Error('Google Identity Services niet geladen'));
      }
    }, 120);
  });
}

function ensureTokenClient() {
  if (driveState.tokenClient || !driveState.clientId) return;
  driveState.tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: driveState.clientId,
    scope: DRIVE_SCOPE,
    callback: () => {}
  });
}

async function requestAccessToken(interactive) {
  await waitForGoogleIdentity();
  ensureTokenClient();
  if (!driveState.tokenClient) throw new Error('Geen geldige Google OAuth Client ID');

  return new Promise((resolve, reject) => {
    driveState.tokenClient.callback = response => {
      if (response?.error) {
        reject(new Error(response.error));
        return;
      }
      driveState.accessToken = response.access_token || '';
      driveState.tokenExpiresAt = Date.now() + ((Number(response.expires_in) || 3600) - 60) * 1000;
      driveState.signedIn = true;
      resolve(driveState.accessToken);
    };

    try {
      driveState.tokenClient.requestAccessToken({ prompt: interactive ? 'consent' : '' });
    } catch (error) {
      reject(error);
    }
  });
}

async function ensureAccessToken(options = {}) {
  const interactive = !!options.interactive;

  if (driveState.accessToken && Date.now() < driveState.tokenExpiresAt) {
    return driveState.accessToken;
  }

  if (!driveState.clientId) {
    throw new Error('Stel eerst je Google OAuth Client ID in');
  }

  try {
    return await requestAccessToken(interactive);
  } catch (error) {
    if (interactive) {
      setStatus(`Login fout: ${error.message}`);
    } else {
      setStatus('Klik op Login met Google om Drive te koppelen.');
    }
    throw error;
  }
}

async function authorizedFetch(url, options = {}, authOptions = {}) {
  const attempt = async retryAllowed => {
    const token = await ensureAccessToken(authOptions);
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(url, { ...options, headers });
    if ((response.status === 401 || response.status === 403) && retryAllowed) {
      driveState.accessToken = '';
      driveState.tokenExpiresAt = 0;
      return attempt(false);
    }
    if (!response.ok) {
      throw new Error(`Drive API ${response.status}`);
    }
    return response;
  };

  return attempt(true);
}

async function fetchDriveUserLabel() {
  try {
    const response = await authorizedFetch(
      'https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress)',
      {},
      { interactive: false }
    );
    const data = await response.json();
    const email = data?.user?.emailAddress;
    const displayName = data?.user?.displayName;
    if (email || displayName) {
      setUserMessage(`Ingelogd als ${displayName || email}`);
      return;
    }
  } catch {
    // Ignore user info errors.
  }
  setUserMessage('Google Drive verbonden.');
}

async function findDriveFile() {
  const query = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and 'appDataFolder' in parents and trashed=false`);
  const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,name,modifiedTime)&pageSize=1`;
  const response = await authorizedFetch(url, {}, { interactive: false });
  const data = await response.json();
  return data?.files?.[0] || null;
}

async function createDriveFile(envelope) {
  const metadata = {
    name: DRIVE_FILE_NAME,
    parents: ['appDataFolder'],
    mimeType: 'application/json'
  };
  const boundary = `drive-boundary-${Date.now()}`;
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(envelope),
    `--${boundary}--`
  ].join('\r\n');

  const response = await authorizedFetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,modifiedTime',
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body
    },
    { interactive: false }
  );
  const data = await response.json();
  driveState.fileId = data.id || '';
  driveState.lastRemoteModifiedAt = Date.parse(data.modifiedTime || '') || Date.now();
  driveState.lastRemoteEnvelopeAt = Number(envelope.updatedAt) || Date.now();
  return data;
}

async function loadDriveEnvelope(fileId) {
  const response = await authorizedFetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {},
    { interactive: false }
  );
  return response.json();
}

async function saveDriveEnvelope(envelope) {
  if (!driveState.fileId) {
    await createDriveFile(envelope);
    return;
  }

  const response = await authorizedFetch(
    `https://www.googleapis.com/upload/drive/v3/files/${driveState.fileId}?uploadType=media&fields=id,modifiedTime`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(envelope)
    },
    { interactive: false }
  );
  const data = await response.json();
  driveState.lastRemoteModifiedAt = Date.parse(data.modifiedTime || '') || Date.now();
  driveState.lastRemoteEnvelopeAt = Number(envelope.updatedAt) || Date.now();
}

async function bootstrapFromDrive() {
  const file = await findDriveFile();
  const localPayload = appApi.getCloudPayload();
  const localStamp = getPayloadUpdatedAt(localPayload);

  if (!file) {
    driveState.fileId = '';
    if (hasAnyLocalData(localPayload)) {
      setStatus('Lokale data wordt eenmalig naar Google Drive geschreven...');
      await saveDriveEnvelope(buildEnvelope(localPayload));
      setStatus('Lokale data staat nu in Google Drive.');
    } else {
      setStatus('Drive gekoppeld. Het JSON-bestand wordt aangemaakt zodra je iets opslaat.');
    }
    driveState.bootstrapped = true;
    return;
  }

  driveState.fileId = file.id || '';
  const remoteEnvelope = await loadDriveEnvelope(driveState.fileId);
  const remoteStamp = Number(remoteEnvelope?.updatedAt) || 0;
  const remoteModifiedAt = Date.parse(file.modifiedTime || '') || Date.now();

  if (hasAnyLocalData(localPayload) && localStamp > remoteStamp) {
    setStatus('Lokale data is nieuwer en wordt naar Google Drive geschreven...');
    await saveDriveEnvelope(buildEnvelope(localPayload));
    driveState.bootstrapped = true;
    setStatus('Lokale data heeft Google Drive bijgewerkt.');
    return;
  }

  const normalized = normalizeRemoteEnvelope(remoteEnvelope);
  driveState.lastRemoteModifiedAt = remoteModifiedAt;
  driveState.lastRemoteEnvelopeAt = remoteStamp;
  appApi.applyCloudPayload(normalized, { clearSessionProtection: true });
  driveState.bootstrapped = true;
  setStatus('Google Drive JSON is geladen.');
}

async function flushPendingWrite() {
  if (!driveState.signedIn || driveState.writeInFlight) return;

  driveState.writeInFlight = true;
  setStatus('Drive sync bezig...');

  try {
    const payload = appApi.getCloudPayload();
    await saveDriveEnvelope(buildEnvelope(payload));
    setStatus('Google Drive gesynchroniseerd.');
  } catch (error) {
    setStatus(`Drive fout: ${error.message}`);
  } finally {
    driveState.writeInFlight = false;
  }
}

function scheduleWrite() {
  if (driveState.syncTimer) clearTimeout(driveState.syncTimer);
  driveState.syncTimer = setTimeout(() => {
    driveState.syncTimer = null;
    flushPendingWrite();
  }, 700);
}

function shouldProtectLocalState() {
  return driveState.writeInFlight
    || !!driveState.syncTimer
    || (Date.now() - driveState.lastLocalChangeAt) < LOCAL_PROTECT_MS;
}

async function refreshFromDrive(reason = 'manual') {
  if (!driveState.signedIn || !driveState.bootstrapped || driveState.refreshInFlight) return;
  if (shouldProtectLocalState()) return;
  if (document.hidden && reason === 'interval') return;

  driveState.refreshInFlight = true;
  try {
    const file = await findDriveFile();
    if (!file?.id) return;

    const remoteModifiedAt = Date.parse(file.modifiedTime || '') || 0;
    if (remoteModifiedAt <= driveState.lastRemoteModifiedAt) return;

    const remoteEnvelope = await loadDriveEnvelope(file.id);
    const remoteStamp = Number(remoteEnvelope?.updatedAt) || 0;
    const localStamp = getPayloadUpdatedAt(appApi.getCloudPayload());
    if (shouldProtectLocalState() || remoteStamp <= localStamp) {
      driveState.lastRemoteModifiedAt = remoteModifiedAt;
      driveState.lastRemoteEnvelopeAt = Math.max(driveState.lastRemoteEnvelopeAt, remoteStamp);
      return;
    }

    driveState.fileId = file.id;
    driveState.lastRemoteModifiedAt = remoteModifiedAt;
    driveState.lastRemoteEnvelopeAt = remoteStamp;
    appApi.applyCloudPayload(normalizeRemoteEnvelope(remoteEnvelope), { clearSessionProtection: true });
    setStatus(reason === 'visibility' ? 'Nieuwste Drive-data is ingeladen.' : 'Drive-data bijgewerkt.');
  } catch (error) {
    setStatus(`Drive fout: ${error.message}`);
  } finally {
    driveState.refreshInFlight = false;
  }
}

function startRefreshLoop() {
  if (driveState.refreshTimer) return;
  driveState.refreshTimer = setInterval(() => {
    refreshFromDrive('interval');
  }, DRIVE_REFRESH_INTERVAL_MS);
}

function stopRefreshLoop() {
  if (!driveState.refreshTimer) return;
  clearInterval(driveState.refreshTimer);
  driveState.refreshTimer = null;
}

function handleLocalDataChange() {
  driveState.lastLocalChangeAt = Date.now();
  if (!driveState.signedIn || window.__fitnessApplyingRemote) return;
  scheduleWrite();
}

function parseConfigFromInput() {
  const raw = configInput?.value?.trim();
  if (!raw) return null;
  try {
    return normalizeDriveConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function handleSaveConfig() {
  const config = parseConfigFromInput();
  if (!config) {
    setStatus('De JSON mist een geldige clientId.');
    return;
  }

  saveStoredConfig(config);
  driveState.clientId = config.clientId;
  driveState.tokenClient = null;
  fillConfigInput(config);
  setStatus('Drive-koppeling opgeslagen. Log nu in met Google.');
}

async function handleSignIn() {
  const stored = loadStoredConfig();
  if (!stored) {
    setStatus('Plak eerst je Google OAuth Client ID.');
    return;
  }

  driveState.clientId = stored.clientId;

  try {
    setStatus('Google login openen...');
    await ensureAccessToken({ interactive: true });
    await fetchDriveUserLabel();
    await bootstrapFromDrive();
    startRefreshLoop();
  } catch {
    // Status wordt al gezet in ensureAccessToken/bootstrap.
  }
}

function handleSignOut() {
  if (window.google?.accounts?.oauth2 && driveState.accessToken) {
    google.accounts.oauth2.revoke(driveState.accessToken, () => {});
  }

  driveState.accessToken = '';
  driveState.tokenExpiresAt = 0;
  driveState.fileId = '';
  driveState.signedIn = false;
  driveState.bootstrapped = false;
  driveState.lastRemoteModifiedAt = 0;
  driveState.lastRemoteEnvelopeAt = 0;
  stopRefreshLoop();
  setUserMessage('Nog niet ingelogd.');
  setStatus('Uitgelogd. Je data blijft in jouw Google Drive staan.');
}

function handleVisibilityChange() {
  if (!document.hidden) {
    refreshFromDrive('visibility');
  }
}

window.addEventListener('fitness:data-changed', handleLocalDataChange);
window.addEventListener('visibilitychange', handleVisibilityChange);

if (saveConfigBtn) saveConfigBtn.addEventListener('click', handleSaveConfig);
if (signInBtn) signInBtn.addEventListener('click', handleSignIn);
if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);

const storedConfig = loadStoredConfig();
if (storedConfig) {
  driveState.clientId = storedConfig.clientId;
  fillConfigInput(storedConfig);
  setStatus('Drive-koppeling geladen. Klik op Login met Google.');
}
