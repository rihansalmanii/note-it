import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import TextAreaOptions from "./TextAreaOptions";

import NoteBackground from "./NoteBackground";
import { BG_OPTIONS } from "../constants/Backgrounds";
import { IoTimerSharp } from "react-icons/io5";

const TextArea = ({ setIsSaving }) => {
  const [content, setContent] = useState("");
  const [activeBg, setActiveBg] = useState(BG_OPTIONS[0]);

  const { id } = useParams();

  const { fetchNoteById, updateNote, notes } = useNotes();

  const timeRef = useRef(null);
  const lastSavedContentRef = useRef("");

  const currentNote = notes.find((note) => String(note._id) === String(id));

  useEffect(() => {
    let isMounted = true;

    const loadNote = async () => {
      try {
        const response = await fetchNoteById(id);
        if (response && response.note && isMounted) {
          const data = response.note;
          setContent(response?.note.content);
          lastSavedContentRef.current = data.content || "";

          const bg =
            BG_OPTIONS.find((b) => b.id === response.note.bg) || BG_OPTIONS[0];
          setActiveBg(bg);
        }
      } catch (err) {
        console.log("Failed to load note", err);
      }
    };

    loadNote(id);

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (currentNote) {
      const bg =
        BG_OPTIONS.find((b) => b.id === currentNote.bg) || BG_OPTIONS[0];
      setActiveBg(bg);

      // // Also sync content if needed
      const isNewNote = String(currentNote._id) === String(id);
      const isExternalUpdate =
        currentNote.content === lastSavedContentRef.current &&
        currentNote.content !== content;

      if (isNewNote || isExternalUpdate) {
        setContent(currentNote.content || "");
        lastSavedContentRef.current = currentNote.content || "";
      }
    }
  }, [currentNote?.bg, currentNote?.content, id]);

  // handle change funtion
  const handleChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      setContent(newContent);

      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }

      timeRef.current = setTimeout(async () => {
        if (newContent === lastSavedContentRef.current) return;

        setIsSaving(true);
        try {
          const res = await updateNote(id, { content: newContent });
          console.log(res);
          lastSavedContentRef.current = newContent;
        } catch (err) {
          console.log("Auto-save failed", err);
        } finally {
          setIsSaving(false);
        }
      }, 1200);
    },
    [id, updateNote],
  );

  // when page is not in focus
  const handleBlur = useCallback(async () => {
    try {
      if (timeRef.current) clearTimeout(timeRef.current);

      if (content !== lastSavedContentRef.current && content.trim() !== "") {
        setIsSaving(true);
        await updateNote(id, { content });
      }
    } catch (err) {
      console.log("save on blur failed", err);
    } finally {
      setIsSaving(false);
    }
  }, [id, content, updateNote]);

  // cleaning timer on note switch or unmount
  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, [id]);

  return (
    <NoteBackground bgOptions={activeBg}>
      <div className="h-full w-full relative pt-3 text-[15px]">
        <textarea
        onBlur={handleBlur}
          value={content}
          onChange={handleChange}
          name="content"
          id=""
          className="textarea resize-none h-full p-2 w-full  outline-none selection:bg-(--selection-bg) selection:text-white"
          style={{
            background: "transparent",
            "--selection-bg": currentNote?.color || "#e8af13"
          }}
        ></textarea>
        {/* <div className="absolute z-50 bottom-2 left-1/2 -translate-x-1/2">
        <TextAreaOptions />
      </div> */}
      </div>
    </NoteBackground>
  );
};

export default TextArea;
