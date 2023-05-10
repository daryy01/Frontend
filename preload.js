const { contextBridge, ipcRenderer  } = require("electron");

contextBridge.exposeInMainWorld("axios", {
  openAI: (message) => ipcRenderer.invoke('axios.openAI', message)
});
 