const { app, dialog, BrowserWindow, ipcMain, MessageChannelMain } = require('electron');

async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
}

ipcMain.on('openFolder', async (event) => {
  const [replyPort] = event.ports
  const file_path = await handleFolderOpen();
  replyPort.postMessage(file_path);
  replyPort.close()
});

ipcMain.on('openFile', async (event) => {
  // The renderer has sent us a MessagePort that it wants us to send our
  // response over.
  const [replyPort] = event.ports

  // Here we send the messages synchronously, but we could just as easily store
  // the port somewhere and send messages asynchronously.
  const file_path = await handleFileOpen();
  replyPort.postMessage(file_path);

  // We close the port when we're done to indicate to the other end that we
  // won't be sending any more messages. This isn't strictly necessary--if we
  // didn't explicitly close the port, it would eventually be garbage
  // collected, which would also trigger the 'close' event in the renderer.
  replyPort.close()
});


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  win.loadFile('index.html');
  win.webContents.openDevTools();
  win.setMenu(null);
}


app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})