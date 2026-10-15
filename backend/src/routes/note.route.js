const express = require("express")
const router = express.Router()

const notesController = require("../controllers/notes.controller")
const { authUser } = require("../middlewares/auth.middleware")


router.get("/", authUser, notesController.getNotes)
router.post("/", authUser, notesController.addNote)


router.get("/:id", authUser, notesController.getNoteById)
router.patch("/:id", authUser, notesController.editNote)
router.patch("/:id/bg", authUser, notesController.changeNoteBg)
router.delete("/:id", authUser, notesController.deleteNoteById)


module.exports = router