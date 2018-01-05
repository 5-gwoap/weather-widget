const { app, BrowserWindow, Tray, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
var getWeather = require("./app/js/weather.js");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let appIcon = null

// Check if user has set environment variables before continuing.
if (!process.env.WEATHER_TOKEN) {
  // TODO: Call method that will create element printing that the user needs to set this variable before continuing.
  console.log('\"WEATHER_TOKEN\" environment variable has not been set.');
  process.exit(1);
}

// getWeather((tooltip) => {
//    appIcon.setToolTip(tooltip);
// });

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false
  });

  // Hide window when focus lost.
  win.on('blur', () => {
    win.hide();
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.on('did-finish-load', () => {
    //temp get weather
    getWeather((weather) => {
      appIcon.setToolTip(weather);
      console.log(weather);
      win.webContents.send('weathernow', weather);
    });
  })

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  appIcon = new Tray('./sample.png');

  appIcon.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
  });

  // TODO reload weather on icon hover. Not sure if implemented yet.
  appIcon.on('mouse-enter', () => {
    console.log('hover event');
    // getWeather();
  });
});

ipcMain.on('getWeather', (event, arg) => {
  getWeather((weather) => {
    appIcon.setToolTip(weather);
    console.log(weather);
    win.webContents.send('weathernow', weather);
  });
  // Reply on async message from renderer process
  // event.sender.send('async-reply', 2);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  };
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.