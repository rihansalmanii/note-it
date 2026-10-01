import React from "react";
import { createNote } from "../api/noteAPI";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";

import { CiSettings } from "react-icons/ci";
import { IoAddSharp } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";


const AllNotesTop = () => {
    
    const navigate = useNavigate()

    const { setNotes } = useNotes()


    const handleNewNote = async () => {

        try {
            const newNote = await createNote()
            setNotes((prev) => [...prev, newNote])
            navigate(`/note/${newNote._id}`)
        } catch(err) {
            console.log(err)
        }
    }


  return (
    <div className=""
    id="drag-bar">
      <div className="flex justify-between">
        <button
        onClick={handleNewNote}
        className="h-10 w-10 flex items-center justify-center hover:bg-[#2B2B2B] cursor-pointer">
          <IoAddSharp size={23} color="#8A8A8A"/>
        </button>
        <div className="flex">
          <button className="h-10 w-10 flex items-center justify-center hover:bg-[#2B2B2B] cursor-pointer">
          <CiSettings size={22} color="#a19c9c"/>
        </button>
        <button
        onClick={() => window.electronAPI?.closeWindow()}
        className="h-10 w-10 flex items-center justify-center hover:bg-[#2B2B2B] cursor-pointer">
          <IoCloseOutline  size={24} color="#a19c9c"/>
        </button>
        </div>
      </div>
    </div>
  );
};

export default AllNotesTop;
