import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { RiMoreLine } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";
import { SlRefresh } from "react-icons/sl";


import { useNavigate, useParams } from "react-router-dom";
import { createNote, updateNoteBg } from "../api/noteAPI";
import { useNotes } from "../contexts/NotesContext";
import { BG_OPTIONS } from "../constants/Backgrounds";

const Topbar = ({isSaving}) => {
  const colors = ["#e8af13", "#5cae23", "#8f4bc4", "#d168b5", "#59bef7"];

  const [showOptions, setShowOptions] = useState(false);

  const { notes, updateNote, isLoading, deleteNote, setNotes } = useNotes();

  const { id } = useParams();

  const currentNote = notes.find((n) => String(n._id) === String(id));
  const currentNoteColor = currentNote?.color || "#e8af13";

  const navigate = useNavigate();

  const handleOptions = async () => {
    const newOption = !showOptions;
    setShowOptions(newOption);
  };

  const handleColorChange = async (color) => {
    try {
      await updateNote(id, { color });
      setShowOptions(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAllNotes = () => {
    window.electronAPI?.openMainWindow()
    setShowOptions(false)
  };

  const handleDeleteNote = async () => {
    try {
      const res = await deleteNote(id);
      const resultedNotes = notes.filter((n) => n._id !== id);
      setNotes(resultedNotes);
      console.log(res);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewNote = async () => {
    try {
      const newNote = await createNote();
      navigate(`/note/${newNote._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoteBgChange = async (bgOption) => {
    const prevNote = await notes.find((n) => String(n._id) === String(id));
    const prevNoteBg = prevNote?.bg || "solid-black";
    try {
      setNotes((prev) =>
        prev.map((note) =>
          String(note._id) === String(id) ? { ...note, bg: bgOption.id } : note,
        ),
      );

      const res = await updateNoteBg(id, bgOption.id);
      setShowOptions(false);
      console.log(res);
    } catch (err) {
      console.log("failed to change the note bg");
      setNotes((prev) =>
        prev.map((note) =>
          String(note._id) === String(id) ? { ...note, bg: prevNoteBg } : note,
        ),
      );
    }
  };

  if (isLoading) {
    return <div className="h-8 w-full bg-transparent animate-pulse" />;
  }

  return (
    <div
      className="h-8 relative w-full transition-colors duration-300"
      style={{ backgroundColor: currentNoteColor }}
    >
      <div className="text-2xl h-full flex justify-between items-center"
      id="drag-bar">
        <button
          className="hover:bg-[#5f5f5f44] px-1 h-full"
          onClick={handleNewNote}
        >
          <IoAdd color="#3b3a3a" />
        </button>

        <div className="flex h-full items-center">
          {isSaving && <span className="text-[18px] px-1"><SlRefresh color="#696868"/></span>}
          <button className="hover:bg-[#5f5f5f44] px-1 h-full" onClick={handleOptions}>
            <RiMoreLine color="#3b3a3a" />
          </button>
          <button
            onClick={() => {
              window.electronAPI?.closeWindow();
            }}
            className="hover:bg-[#5f5f5f44] px-2 h-full "
          >
            <IoCloseOutline color="#3b3a3a" />
          </button>
        </div>
      </div>

      {/* topbar options */}
      <div className="absolute right-1 z-50">
        {showOptions && (
          <div className="flex flex-col items-start bg-[#4e4e4e] w-fit rounded-b-md overflow-hidden">
            <div className="flex  items-center w-full">
              {colors.map((color) => (
                <button
                  key={color}
                  className="h-14 w-10 hover:opacity-90"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleColorChange(color);
                  }}
                ></button>
              ))}
            </div>

            {/* bg options */}
            <div className="flex py-3 gap-2 px-1">
              {showOptions &&
                BG_OPTIONS.map((bgOption) => (
                  <button
                    key={bgOption.id}
                    className="h-8 w-8 rounded-md cursor-pointer"
                    style={{
                      backgroundColor:
                        bgOption.type == "color"
                          ? bgOption.value
                          : bgOption.baseColor,
                      backgroundImage:
                        bgOption.type == "image"
                          ? `url(${bgOption.src})`
                          : "none",
                      backgroundSize: "32px",
                      backgroundPosition: "center",
                      backgroundRepeat:
                        bgOption.type == "image" ? "repeat" : "no-repeat",
                    }}
                    onClick={() => handleNoteBgChange(bgOption)}
                  ></button>
                ))}
            </div>

            {/* bottom part for notes */}
            <div className="flex flex-col items-start text-sm w-full">
              <button
                onClick={handleDeleteNote}
                className="hover:bg-[gray] text-left w-full px-2 py-2"
              >
                Delete Note
              </button>
              <button
                className="hover:bg-[gray] text-left text-sm w-full px-2 py-2"
                onClick={handleAllNotes}
              >
                All Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
