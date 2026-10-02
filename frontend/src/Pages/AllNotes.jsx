import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AllNotesTop from "../components/AllNotesTop";

import { CiSearch } from "react-icons/ci";
import { useNotes } from "../contexts/NotesContext";

const AllNotes = () => {
  const { notes, fetchNotes } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    if (notes.length == 0) {
      fetchNotes();
    }
  }, []);

  // notes search
  useEffect(() => {
    if (!notes) return;

    if (searchQuery.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const searchResult = notes.filter((note) => {
        const title = note.title?.toLowerCase() || "";
        const content = note.content?.toLowerCase() || "";

        return (
          title.includes(searchQuery.toLowerCase()) ||
          content.includes(searchQuery.toLowerCase())
        );
      });

      setFilteredNotes(searchResult);
    }
  }, [searchQuery, notes]);

  const handleOpenStickyNote = async (noteId) => {
    await window.electronAPI?.openNoteWindow(noteId);
  };

  return (
    <div className="h-screen w-full flex flex-col select-none">
      <div>
        <AllNotesTop />
      </div>
      <div className="outline-none rounded-md h-fit w-[90%] mx-auto flex justify-between bg-[#373737] px-2 py-2 my-2 items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full outline-none text-sm"
        />
        <span>
          <CiSearch size={20} color="#8F8F8F" />
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-1 w-full">
        <div className="flex flex-col gap-2.5 py-1 pb-4">
          {filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                onClick={() => handleOpenStickyNote(note._id)}
                className="w-[93%] min-h-17.5 shrink-0 rounded-sm overflow-hidden mx-auto cursor-pointer group"
              >
                <div
                  className="w-full h-1"
                  style={{ backgroundColor: note.color }}
                />

                <div className="min-h-[66px] px-3 py-5 w-full text-sm bg-[#373737] group-hover:bg-[#414141] transition-colors flex items-center">
                  {note.title || "Untitled Note"}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">no notes found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllNotes;
