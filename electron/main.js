const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 280,
    height: 350,
    show: false, // Keep hidden until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Ensure this exists
    },
    frame: false,
    transparent: true,
    backgroundColor: '#00000000', // Explicit transparent bg
  });

  // ✅ CRITICAL FIX: Show window only when content is loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (process.env.ELECTRON_DEV === 'true') {
    mainWindow.loadURL('http://localhost:5173/');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  }

  // Handle white/black screen crashes
  mainWindow.webContents.on('crashed', () => {
    console.error('Renderer crashed!');
  });
}

ipcMain.on('app-close-request', () => {
  if(mainWindow) {
    mainWindow.close()
  }
})

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});