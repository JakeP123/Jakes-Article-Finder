const mongoose = require("mongoose");

//Schema Constructor
const Schema = mongoose.Schema;

//Create a new NoteSchema using Schema Constructor
const NoteSchema = new Schema ({
    body: {
        type: String,
        required: true
    },
    articleId: {
        type: String,
        required: true
    }
});

//Create model from Schema

const Note = mongoose.model("Note", NoteSchema);

//export

module.exports = Note;