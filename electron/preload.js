const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('app-close-request'), 

    openNoteWindow: (noteId) => ipcRenderer.invoke('open-note-window', noteId),

    openMainWindow: () => ipcRenderer.send('open-main-window'),
});