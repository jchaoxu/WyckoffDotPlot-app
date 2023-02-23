const { app, BrowserWindow } = require('electron');

let  mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    }
  });
  mainWindow.loadURL(`${app.getAppPath()}\\build\\index.html`)
});