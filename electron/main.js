const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
const Store = require("electron-store");
const store = new Store();

let mainWindow;
const noteWindows = new Map();

// --- Auth IPC Handlers ---
ipcMain.handle("auth-save-token", (event, token) => {
  store.set("auth.token", token);
});

ipcMain.handle("auth-get-token", () => {
  return store.get("auth.token") || null;
});

ipcMain.handle("auth-clear-token", () => {
  store.delete("auth.token");
});

// --- Note Window Handler with Auth ---
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
    // ✅ SECURITY FIX: Attach stored JWT to main process API call
    const token = store.get("auth.token");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(
      `http://localhost:3000/api/notes/${noteId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const noteData = response?.data?.note || response.data;
    createStickyNoteWindow(noteId, noteData);
  } catch (err) {
    console.log("failed to load note", err.response?.data || err.message);
  }
});

ipcMain.on("open-main-window", () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }
  createMainWindow();
});

ipcMain.on("app-close-request", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window && !window.isDestroyed()) {
    window.close();
  }
});

// --- Main Window Creation ---
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 650,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    backgroundColor: "#00000000",
  });

  if (process.env.ELECTRON_DEV === "true") {
    mainWindow.loadURL("http://localhost:5173/");
    mainWindow.webContents.openDevTools();
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

  mainWindow.webContents.on("crashed", () => {
    console.error("Renderer crashed!");
  });
}

// --- Sticky Note Window Creation ---
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
    win.loadURL(`http://localhost:5173/#/note/${noteId}`);
    win.webContents.openDevTools();
  } else {
    // ✅ PRODUCTION FIX: Use dynamic noteId instead of hardcoded '/login'
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
