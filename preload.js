const { contextBridge, ipcRenderer  } = require("electron");
const Toastify  = require('toastify-js');

contextBridge.exposeInMainWorld("axios", {
  openAI: (message) => ipcRenderer.invoke('axios.openAI', message)
});
 
contextBridge.exposeInMainWorld("Toastify", {
  showToast: (options) => Toastify(options).showToast() 
});