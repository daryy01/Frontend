//Imported Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const dotenv = require('dotenv').config();

//Main Window
const isDev = true;

const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,  
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, "./renderer/index.html"));
};

app.whenReady().then(() => {
  //Initialize Functions
  ipcMain.handle('axios.openAI', openAI);
  
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

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
        'Authorization': 'Bearer ' + env.OPENAI_APIKEY
      }
    }).then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      result = error; 
    });

  return result;
}
