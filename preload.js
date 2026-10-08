const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  getUpdateStatus: () => ipcRenderer.invoke('update:get-status'),
  onUpdateStateChange: (callback) => {
    if (typeof callback === 'function') {
      const listener = (event, data) => callback(data);
      ipcRenderer.on('update:state-changed', listener);
      return () => ipcRenderer.removeListener('update:state-changed', listener);
    }
  }
});
