import api from "./api"

// create note
export const createNote = async () => {
    try {
        const res = await api.post("/")
        return res.data.newNote;
    
    } catch(err) {
        console.log(err.message)
    }

}

// get specific note
export const getNoteById = async (id) => {
    try {
        const res = await api.get(`/${id}`)

        return res.data;
    } catch(err) {
        console.log(err)
    }
}

// edit note
export const editNote = async (id, updatedData) => {
    try {
        const res = await api.patch(`/${id}`, updatedData)

        return res.data;
    } catch(err) {
        console.log(err)
    }
}

export const getAllNotes = async () => {
    try {
        const res = await api.get("/")

        return res.data;
    } catch(err) {
        console.log(err)
    }
}

export const deleteNoteById = async (id) => {
    try {
        const res = await api.delete(`/${id}`)

        return res.data;
    } catch(err) {
        console.log(err)
    }
}

export const updateNoteBg = async(id, newBg) => {
    try {
        const res = await api.patch(`/${id}/bg`, {newBg})
        
        return res.data

    } catch(err) {
        console.log(err)
    }
}