import api from "./api"

// create note
export const createNote = async () => {
  try {
    const res = await api.post("/");
    return res.data.newNote || res.data; // Ensure we return the note object
  } catch (err) {
    console.error("Failed to create note:", err);
    throw err;
  }
};

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
    const res = await api.get("/");
    // Adjust this based on your backend response structure
    // If backend returns { notes: [...] }, use res.data.notes
    // If backend returns [...], use res.data
    return res.data.notes || res.data; 
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    return []; // Return empty array instead of undefined to prevent crashes
  }
};

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