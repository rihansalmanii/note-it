import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AllNotesTop from "../components/AllNotesTop";

import { CiSearch } from "react-icons/ci";
import { useNotes } from "../contexts/NotesContext";

const AllNotes = () => {
  const { notes, fetchNotes } = useNotes();

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNotes, setFilteredNotes] = useState([])


  useEffect(() => {
    if (notes.length == 0) {
      fetchNotes();
    }
  }, []);
  
  // notes search
  useEffect(() => {
    if(!notes) return;

    if(searchQuery.trim() === "") {
      setFilteredNotes(notes)
    } else {
      const searchResult = notes.filter((note) => {
        const title = note.title?.toLowerCase() || "";
        const content = note.content?.toLowerCase() || "";

        return title.includes(searchQuery.toLowerCase()) || content.includes(searchQuery.toLowerCase)
      })


      setFilteredNotes(searchResult)
    }

  }, [searchQuery, notes])


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
      <div className="overflow-auto px-1 h-full w-full mx-auto flex flex-col pb-10 gap-2.5 mt-3">
        {filteredNotes && filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Link key={note._id} to={`/note/${note._id}`}>
              <div className="h-fit w-[93%] rounded-sm overflow-hidden mx-auto ">
                <div
                  className="w-full h-1"
                  style={{ backgroundColor: note.color }}
                ></div>
                <div className="h-fit px-3 py-6  w-full text-sm bg-[#373737] hover:bg-[#414141]">
                  {note.title}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center">no notes found</div>
        )}
      </div>
    </div>
  );
};

export default AllNotes;