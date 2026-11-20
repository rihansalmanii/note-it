const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('app-close-request'), 
    openNoteWindow: (noteId) => ipcRenderer.invoke('open-note-window', noteId),
    openMainWindow: () => ipcRenderer.invoke('open-main-window'),
    
    // ✅ Standardized auth methods
    saveToken: (token) => ipcRenderer.invoke('auth-save-token', token),
    getToken: () => ipcRenderer.invoke('auth-get-token'),
    clearAuth: () => ipcRenderer.invoke('auth-clear-token') // Renamed from clearToken
});