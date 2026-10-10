const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
// Safely require electron-updater to prevent app crashes if missing/unbundled in portable or custom builds
let autoUpdater = null;
try {
  autoUpdater = require('electron-updater').autoUpdater;
} catch (err) {
  console.warn('[Updater] electron-updater module failed to load:', err.message);
}

// Ensure writable runtime directories use Electron's userData directory when packaged
if (app) {
  try {
    process.env.NANO_USER_DATA_DIR = app.getPath('userData');
  } catch (e) {}
}

const { startAppServer } = require(path.join(__dirname, 'server.js'));

// Suppress harmless Chromium internal cache warnings on Windows
if (app && app.commandLine) {
  app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
  app.commandLine.appendSwitch('log-level', '3');
}

let mainWindow = null;
let serverHandle = null;
let lastUpdateCheckTime = 0;
const UPDATE_CHECK_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

let updateState = {
  status: 'idle', // 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'
  currentVersion: app ? app.getVersion() : '1.0.0',
  latestVersion: '',
  releaseNotes: '',
  percent: 0,
  bytesPerSecond: 0,
  transferred: 0,
  total: 0,
  error: null
};

function broadcastUpdateState() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update:state-changed', updateState);
  }
}

function logUpdaterEvent(level, message, details = null) {
  console.log(`[Updater] [${level}] ${message}`, details || '');
  try {
    const fs = require('fs');
    const logDir = path.join(process.env.NANO_USER_DATA_DIR || path.join(__dirname, 'data_store'), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    const logFile = path.join(logDir, 'nano_adb_system.log');
    const timestamp = new Date().toISOString();
    const detailStr = details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : '';
    fs.appendFileSync(logFile, `[${timestamp}] [UPDATER] [${level.toUpperCase()}] ${message}${detailStr ? ' | ' + detailStr : ''}\n`, 'utf8');
  } catch (e) {}
}

// ----------------------------------------------------
// ELECTRON-UPDATER CONFIGURATION & EVENT LISTENERS
// ----------------------------------------------------
if (autoUpdater) {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    updateState.status = 'checking';
    updateState.error = null;
    logUpdaterEvent('INFO', 'Update check started', { currentVersion: updateState.currentVersion });
    broadcastUpdateState();
  });

  autoUpdater.on('update-available', (info) => {
    updateState.status = 'available';
    updateState.latestVersion = info.version || 'Newer Version';
    updateState.releaseNotes = typeof info.releaseNotes === 'string' 
      ? info.releaseNotes 
      : (Array.isArray(info.releaseNotes) ? info.releaseNotes.map(n => n.note).join('\n') : 'New software release available with performance & security updates.');
    logUpdaterEvent('INFO', 'Update available', { latestVersion: updateState.latestVersion });
    broadcastUpdateState();
  });

  autoUpdater.on('update-not-available', (info) => {
    updateState.status = 'not-available';
    updateState.latestVersion = info ? (info.version || updateState.currentVersion) : updateState.currentVersion;
    logUpdaterEvent('INFO', 'Update not available. Application is up to date.', { currentVersion: updateState.currentVersion });
    broadcastUpdateState();
  });

  autoUpdater.on('download-progress', (progressObj) => {
    updateState.status = 'downloading';
    updateState.percent = Math.round(progressObj.percent || 0);
    updateState.bytesPerSecond = progressObj.bytesPerSecond || 0;
    updateState.transferred = progressObj.transferred || 0;
    updateState.total = progressObj.total || 0;
    logUpdaterEvent('INFO', `Download progress: ${updateState.percent}%`, { speed: `${Math.round(updateState.bytesPerSecond / 1024)} KB/s` });
    broadcastUpdateState();
  });

  autoUpdater.on('update-downloaded', (info) => {
    updateState.status = 'downloaded';
    updateState.percent = 100;
    logUpdaterEvent('INFO', 'Update downloaded successfully and ready to install.', { version: info ? info.version : '' });
    broadcastUpdateState();
  });

  autoUpdater.on('error', (err) => {
    updateState.status = 'error';
    updateState.error = err ? (err.message || String(err)) : 'Unknown updater error';
    logUpdaterEvent('ERROR', 'Updater encountered an error', { error: updateState.error });
    broadcastUpdateState();
  });
}

// ----------------------------------------------------
// SECURE IPC ENDPOINTS FOR UPDATER
// ----------------------------------------------------
ipcMain.handle('update:check', async () => {
  if (!autoUpdater) {
    return { error: 'Auto-updater is not available in this build' };
  }
  try {
    const now = Date.now();
    lastUpdateCheckTime = now;
    logUpdaterEvent('INFO', 'Manual update check requested by user');
    return await autoUpdater.checkForUpdates();
  } catch (err) {
    updateState.status = 'error';
    updateState.error = err.message;
    broadcastUpdateState();
    logUpdaterEvent('ERROR', 'Failed to execute checkForUpdates', { error: err.message });
    return { error: err.message };
  }
});

ipcMain.handle('update:download', async () => {
  if (!autoUpdater) {
    return { error: 'Auto-updater is not available in this build' };
  }
  try {
    logUpdaterEvent('INFO', 'User requested update download');
    return await autoUpdater.downloadUpdate();
  } catch (err) {
    updateState.status = 'error';
    updateState.error = err.message;
    broadcastUpdateState();
    logUpdaterEvent('ERROR', 'Failed to execute downloadUpdate', { error: err.message });
    return { error: err.message };
  }
});

ipcMain.handle('update:install', async () => {
  if (!autoUpdater) {
    return { error: 'Auto-updater is not available in this build' };
  }
  try {
    logUpdaterEvent('INFO', 'User requested quitAndInstall');
    autoUpdater.quitAndInstall(false, true);
    return { success: true };
  } catch (err) {
    logUpdaterEvent('ERROR', 'Failed to execute quitAndInstall', { error: err.message });
    return { error: err.message };
  }
});

ipcMain.handle('update:get-status', () => {
  return updateState;
});

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1000,
    minHeight: 700,
    title: 'Nano ADB Desktop - Anti-Detect Browser Pro',
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(`http://localhost:${port}`).then(() => {
    mainWindow.show();

    // Perform a non-blocking startup check for updates after window loads
    setTimeout(() => {
      if (autoUpdater && Date.now() - lastUpdateCheckTime > UPDATE_CHECK_COOLDOWN_MS) {
        lastUpdateCheckTime = Date.now();
        logUpdaterEvent('INFO', 'Executing non-blocking background startup update check');
        autoUpdater.checkForUpdates().catch(e => {
          logUpdaterEvent('WARN', 'Startup update check failed gracefully (offline/rate-limit)', { message: e.message });
        });
      }
    }, 5000);

  }).catch(err => {
    console.error('Failed to load desktop window URL:', err);
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    const { port, server } = await startAppServer();
    serverHandle = server;
    createWindow(port);
  } catch (err) {
    console.error('Error launching desktop engine:', err);
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0 && serverHandle) {
      const address = serverHandle.address();
      const port = address ? address.port : 3000;
      createWindow(port);
    }
  });
});

app.on('window-all-closed', function () {
  if (serverHandle) {
    try { serverHandle.close(); } catch (e) {}
  }
  if (process.platform !== 'darwin') app.quit();
});
