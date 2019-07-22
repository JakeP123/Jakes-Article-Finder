const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/api/scrape",(req,res) => {
res.send("Scraping Articles Now!")

axios.get("https://dev.to/")
.then(function (result) {
    // console.log(result);
const $ = cheerio.load(result.data)
const articles = []
$(".single-article").each(function(i,element) {

let title = $(this).find("h3").text()
articles.push(title)  
console.log(title)
const base = ("https://wwww.dev.to")

let link = $(this).children("a.index-article-link").attr("href")
console.log(base + link)
})
// console.log(articles)
})
})

app.listen(3000,() => {
  console.log("Listening Now on Port 3000!")
});

