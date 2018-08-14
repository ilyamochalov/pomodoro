'use strict';
const {app, BrowserWindow, ipcMain, Notification} = require('electron');
const notifier = require('node-notifier');
const path = require('path');

function CreateWindow() {
    // main window
    let win = new BrowserWindow({width: 470, height: 200, resizable: false,
    frame: false})
    
    // load index.html
    win.loadFile('index.1.html')

    // XXX for development
    // win.toggleDevTools()
}

ipcMain.on('notification', (event, arg) => {
    notifier.notify({
        title: "Pomodoro",
        message: arg,
        icon: path.join(__dirname, 'icon.png'),
        timeout: 100,
        actions: "OK"
    })
    event.returnValue = 'pong'
});

app.on('ready', CreateWindow)