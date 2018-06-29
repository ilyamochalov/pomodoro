const {app, BrowserWindow} = require('electron')

function CreateWindow() {
    // main window
    win = new BrowserWindow({width: 400, height: 400})
    
    // load index.html
    win.loadFile('index.html')
}

app.on('ready', CreateWindow)