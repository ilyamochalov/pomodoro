const {app, BrowserWindow} = require('electron')

function CreateWindow() {
    // main window
    win = new BrowserWindow({width: 600, height: 400})
    
    // load index.html
    win.loadFile('index.html')

    // XXX for development
    win.toggleDevTools()
}

app.on('ready', CreateWindow)