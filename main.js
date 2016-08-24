var app = require('app');
var BrowserWindow = require('browser-window');

//global ref to BrowserWindow, otherwise it will be closed on garbage collection.
var mainWindow = null;

//quit when windows are closed.
app.on('window-all-closed', function(){
  //osx wait for explicit quit.
  if (process.platform != 'darwin'){
    app.quit();
  }
});

//method called once initialised.
app.on('ready', function(){
  //create window
  mainWindow = new BrowserWindow({width: 600, height: 500});

  //load index.html
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  //emitted when window closed.
  mainWindow.on('closed', function(){
    mainWindow = null;
  });
});
