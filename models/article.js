const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Article = mongoose.model("Article", ArticleSchema);

//export 
module.exports = Article;

