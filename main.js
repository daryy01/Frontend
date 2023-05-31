//Imported Modules
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const dotenv = require('dotenv').config();

//Global Variables
const isDev = true;
const isMac = process.platform === 'darwin';
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'About',
        click: aboutWindow
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
]

//Main Window
const createWindow = () => {
  const main = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,  
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (isDev) {
    main.webContents.openDevTools();
  }

  main.loadFile(path.join(__dirname, "./renderer/index.html"));
};

function aboutWindow(){
  const about = new BrowserWindow({
    width: 400,
    height: 400,
    alwaysOnTop: true,
});

about.setMenuBarVisibility(false);  

about.loadFile(path.join(__dirname, "./renderer/about.html"));
}

app.whenReady().then(() => {
  //Initialize Functions
  ipcMain.handle('axios.openAI', openAI);
  ipcMain.handle('axios.supaBase', supaBase);
  //Create Main Window
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
//Close Window
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//Main Functions
async function openAI(event,message){

let result = null;

const env = dotenv.parsed;

  await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/completions',
      data: {
        model: "text-davinci-003",
        prompt: "Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\n" + message,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 0.3,      
        frequency_penalty: 0.5,
        presence_penalty: 0.0
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + env.APIKEY_OPENAI
      }
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error; 
    });

  return result; 
}

async function supaBase(event, method, id = '', data = ''){
  let result = null;
  const env = dotenv.parsed;
  let query = ( method == 'get' ? '?select=*' : (method == 'delete' ? '?prompt_id=eq.' + id : '') );

  await axios({
      method: method,
      url: 'https://vzcvoajkxtgipsxjdnsx.supabase.co/rest/v1/prompts' + query,
      headers: ( method == 'post' ? {
          'apikey': env.APIKEY_SUPABASE,
          'Authorization': 'Bearer ' + env.APIKEY_SUPABASE,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        } : {
          'apikey': env.APIKEY_SUPABASE,
          'Authorization': 'Bearer ' + env.APIKEY_SUPABASE 
        } ),
      data: ( method == 'post' ? data : null )
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error.response.data;
    });

  return result;
}
