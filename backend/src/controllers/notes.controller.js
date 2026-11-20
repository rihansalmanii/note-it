const notesModel = require("../models/notes.model");
const noteModel = require("../models/notes.model");
const { rawListeners } = require("../models/user.model");

const addNote = async (req, res) => {
  try {
    const newNote = await noteModel.create({
      title: "",
      content: "",
      userId: (req.user._id).toString()
    });

    console.log((req.user._id).toString())

    res.status(201).json({
      success: true,
      message: "note added successfully",
      newNote,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ userId: req.user._id });

    if (notes.length == 0) {
      console.log("no notes")
      return res.status(200).json({ message: "no notes for now!" });
    }
    console.log(notes)

    res.status(200).json({
      success: true,
      message: "notes fetched successfully",
      notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "err",
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status();
    }

    const note = await noteModel.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: "note doesn't exists" });
    }

    res.status(200).json({
      success: true,
      message: "note found",
      note,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editNote = async (req, res) => {
  try {
    const newData = req.body;
    const { id } = req.params;

    const note = await noteModel.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: "note not exists!" });
    }

    if (newData.content) {
      const words = newData.content.trim().split(/\s+/);
      newData.title =
        words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
    }

    const editedNote = await noteModel.findOneAndUpdate(
      { _id: id },
      { $set: newData },
      { new: true },
    );

    if (!editedNote) {
      return res.status(404).json({ message: "note not found" });
    }

    res.status(201).json({
      success: true,
      message: "note edited successfully",
      editedNote,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteNoteById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).json({ message: "id is required" });
  }

  try {
    const deleted = await notesModel.findOneAndDelete({
      id,
      userId: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "note not found" });
    }

    return res.status(200).json({
      success: true,
      message: "note deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const changeNoteBg = async (req, res) => {
  try {
    const { newBg } = req.body;
    const { id } = req.params;


    if (!id) {
      return res.status(500).json({ message: "id is required" });
    }

    const note = await noteModel.findById(id);

    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }

    const updatedNote = await noteModel.findByIdAndUpdate(
      id,
      { $set: { bg: newBg } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "note bg updated successfully",
      updatedNote,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addNote,
  getNotes,
  getNoteById,
  editNote,
  deleteNoteById,
  changeNoteBg,
};
