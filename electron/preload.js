const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('app-close-request'), 

    openNoteWindow: (noteId) => ipcRenderer.invoke('open-note-window', noteId),

    openMainWindow: () => ipcRenderer.invoke('open-main-window'),

    saveToken: (token) => ipcRenderer.invoke('auth-save-token', token),

    getToken: () => ipcRenderer.invoke('auth-get-token'),

    clearToken: () => ipcRenderer.invoke('auth-clear-token')
});