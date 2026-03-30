const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('zipIt', {
  alert: (isAlert) => ipcRenderer.send('alert', isAlert),
  showWindow: () => ipcRenderer.send('show-window'),
});
