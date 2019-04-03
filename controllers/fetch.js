var axios = require("axios");
var cheerio = require("cheerio");
var Article = require("../models/Article.js");
// Require all models
var db = require("../models");

// Initialize Express
//var app = express();
var express = require("express");
var app = express();

// Grab the headlines as a json
module.exports = function (app) {
  // A GET route for scraping the new yorker website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.newyorker.com/humor/borowitz-report").then(function (response) {

      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Div which contains every article with an image, headline, link and summary
      $(".River__riverItem___3huWr").each(function (i, element) {

        // Save an empty result object
        var result = {};
        var url = "https://www.newyorker.com";

        result.title = $(this).find("h4").text().trim();
        result.link = url + $(this).find("a.Link__link___3dWao").attr("href");
        result.summary = $(this).find(".River__dek___CayIg").text().trim();
        result.image = $(this).find("picture.component-responsive-image").find("img").attr("src");

        console.log(result);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            console.log("you have a scrape error occuring in the fetch.js file: " + err);
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });

}