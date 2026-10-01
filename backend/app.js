const express = require('express')
const app = express()
const cors = require("cors")

const notesRoutes = require("./src/routes/note.route")



app.use(cors())
app.use(express.json())

app.use("/api/notes", notesRoutes)


module.exports = app