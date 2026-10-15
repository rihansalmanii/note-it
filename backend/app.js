const express = require('express')
const app = express()
const cors = require("cors")
const cookieParser = require('cookie-parser')

const notesRoutes = require("./src/routes/note.route")
const authRouter = require("./src/routes/auth.routes")



app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api/notes", notesRoutes)
app.use("/api/auth", authRouter)


module.exports = app