'use strict';
const {app, BrowserWindow, ipcMain, Notification} = require('electron');

function CreateWindow() {
    // main window
    let win = new BrowserWindow({width: 600, height: 400})
    
    // load index.html
    win.loadFile('index.html')

    // XXX for development
    win.toggleDevTools()
    console.log('created a window')
}

ipcMain.on('notification:new', function(){
    
    let notificationWindow = new BrowserWindow({width: 600, height: 400});
    notificationWindow.loadFile('index.html')
    notificationWindow.toggleDevTools()
    
    let myNotification = new Notification({
        title: "Notification Title",
        body: 'Body text'
    });

    myNotification.show();

    console.log(myNotification.show())
});

app.on('ready', CreateWindow)