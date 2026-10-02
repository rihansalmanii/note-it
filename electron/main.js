const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");

let mainWindow;

const noteWindows = new Map();

ipcMain.handle("open-note-window", async (event, noteId) => {
  if (noteWindows.has(noteId)) {
    const existingWindow = noteWindows.get(noteId);
    if (!existingWindow.isDestroyed()) {
      existingWindow.focus();
      return;
    }
    noteWindows.delete(noteId);
  }

  try {
    const response = await axios.get(
      `http://localhost:3000/api/notes/${noteId}`,
    );
    const noteData = response?.data?.note || response.data;

    createStickyNoteWindow(noteId, noteData);
  } catch (err) {
    console.log("failed to load note", err.response?.data || err.message);
  }
});

ipcMain.on('open-main-window', () => {
  if(mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show()
    mainWindow.focus()
    return;
  }
  createMainWindow()
})

ipcMain.on("app-close-request", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (window && !window.isDestroyed()) {
    window.close();
  }
});

// main list window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 650,
    show: false, // Keep hidden until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // Ensure this exists
    },
    frame: false,
    backgroundColor: "#00000000", // Explicit transparent bg
  });

  if (process.env.ELECTRON_DEV === "true") {
    mainWindow.loadURL("http://localhost:5173/");
    mainWindow.webContents.openDevTools(); // Auto-open on launch
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "..", "frontend", "dist", "index.html"),
    );
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle white/black screen crashes
  mainWindow.webContents.on("crashed", () => {
    console.error("Renderer crashed!");
  });
}

// dedicated window for sticky note
function createStickyNoteWindow(noteId) {
  const win = new BrowserWindow({
    width: 280,
    height: 350,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  noteWindows.set(noteId, win);

  if (process.env.ELECTRON_DEV === "true") {
    // ✅ CRITICAL: Load the SPECIFIC note route, NOT the root '/'
    win.loadURL(`http://localhost:5173/#/note/${noteId}`);
  } else {
    win.loadFile(path.join(__dirname, "..", "frontend", "dist", "index.html"), {
      hash: `/note/${noteId}`,
    });
  }

  win.once("ready-to-show", () => win.show());

  win.on("closed", () => {
    noteWindows.delete(noteId);
  });
}

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
