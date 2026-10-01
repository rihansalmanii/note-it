const express = require("express")
const router = express.Router()

const notesController = require("../controllers/notes.controller")


router.get("/", notesController.getNotes)
router.post("/", notesController.addNote)


router.get("/:id", notesController.getNoteById)
router.patch("/:id", notesController.editNote)
router.patch("/:id/bg", notesController.changeNoteBg)
router.delete("/:id", notesController.deleteNoteById)


module.exports = router