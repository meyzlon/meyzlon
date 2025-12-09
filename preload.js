const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  store: {
    get: (key) => ipcRenderer.sendSync('store-get', key),
    set: (key, value) => ipcRenderer.sendSync('store-set', key, value),
    clear: () => ipcRenderer.invoke('store-clear'),
  },
  app: {
    version: require('./package.json').version,
  },
});

// Detectar se está rodando no Electron
contextBridge.exposeInMainWorld('isElectron', true);
