const mongoose = require("mongoose")
const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    color: {
        type: String,
        default: '#EDCE2F'
    },
    bg: {
        type: String,
        default: 'solid-dark'
    },
    textColor: {
        type: String,
        default: '#fffff'
    }

})

module.exports = mongoose.model("Note", notesSchema)