const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const logger = require("morgan");

//Require models
const db = require("./models");

const PORT = process.env.PORT || 3000;

//Initialize Express

const app = express();

//Morgan Logger to Log Requests
app.use(logger("dev"));

//parse body as JSON / Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Public Static Folder
app.use(express.static("public"));

//connect to DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

//routes

app.get("/scrape", (req, res) => {
  axios.get("https://www.vrfitnessinsider.com/")
    .then(function (result) {
      // console.log(result);
      const $ = cheerio.load(result.data)
      const articles = [];
      $(".td-item-details").each(function (i, element) {
        const article = {}
        let title = $(this).find("h3").text()
        article.title = title;



        let link = $(this).children("div.td-read-more").first().children().first().attr('href')
        article.link = link;



        let description = $(this).children("div.td-excerpt").text()
        article.description = description;

        articles.push(article)


        //console.log(title + description + link)
      });

      res.send(articles);



    });
});



app.get("/saved-articles", (req,res) => { 
  db.Article.find()
  .then(savedArticles => {
    res.send(savedArticles)
  })
.catch(err => {
  console.log("Had an error fetching the saved articles", err)
  res.status(400).send(err)
})
});



//Send Info to DB

app.post("/save", (req,res)=> {
  console.log('article infooo req.body===>>', req.body)
  db.Article.create(req.body)
  .then(createdArticle => {
    console.log("Articl Have Been Created", createdArticle);
    res.send(createdArticle);
  })
  .catch(err => {
    console.log("We Have An Error On The Play!", err);
    res.status(400).send(err);
  });
});


app.post("/notes", (req,res) => {
  console.log("adding notes", req.body)
  db.Note.create(req.body)
  .then(addNotes => {
    console.log("Notes Have Been Added", addNotes);
    res.send(addNotes)
  }).catch( err => {
    console.log("We could not add notes", err);
    res.status(400).send(err);
  })
});


//remove from DB

app.delete("/clear", (req,res) => {
  db.Article.remove({}).then(itemsDeleted => {
    res.send({success: "Saved Articles Deleted"})
  })
  .catch(err => {
   res.send({err: "There was an error deleting these articles"})
  })
});



app.delete("/clear-article/:articleId", (req,res) => {
  db.Article.remove({_id: req.params.articleId}).then(updateList => {
    res.send({success: "Article Removed From The Saved List"})
  }).catch ( err => {
    res.send({err: "There was in error deleting this article from the list"})
  })
});


app.delete("/note/remove/:noteId", (req,res) => {
  db.Note.remove({_id: req.params.noteId}).then(updateNotes => {
    res.send({success: "Note removed"})
  }).catch ( err => {
    res.send({err: "Error deleting note"})
  })
})
//Listening On Port

app.listen(PORT, () => {
  console.log("Listening Now on Port" + PORT)
});