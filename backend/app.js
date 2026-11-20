const express = require('express')
const app = express()
const cors = require("cors")
const cookieParser = require('cookie-parser')

const notesRoutes = require("./src/routes/note.route")
const authRouter = require("./src/routes/auth.routes")



app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite dev server
  credentials: true, // Allow cookies to be sent/received
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Explicitly allow OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow auth headers
}));
app.use(express.json())
app.use(cookieParser())

app.use("/api/notes", notesRoutes)
app.use("/api/auth", authRouter)


module.exports = app