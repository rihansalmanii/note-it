import { createContext, useContext, useEffect, useState } from "react";
import { createNote, deleteNoteById, editNote, getAllNotes, getNoteById } from "../api/noteAPI";

const NotesContext = createContext();

const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const newNote = async () => {
    try {
      const data = await createNote();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const data = await getAllNotes();
      setNotes(data);
    } catch (err) {
      console.log(err);
    } finally{
      setIsLoading(false)
    }
  };

  const fetchNoteById = async (id) => {
    try {
      const data = await getNoteById(id);

      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const updateNote = async (id, updatedData) => {
    try {
      const updatedNote = await editNote(id, updatedData);

      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          if (String(note._id) == String(id)) {
            return { ...note,...updatedData };
          }
          return note;
        }),
      );

      return updatedNote;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await deleteNoteById(id);

      return res;
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchNotes();
  }, [])

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, fetchNotes, fetchNoteById, updateNote, newNote, isLoading, deleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);

export default NotesProvider;
