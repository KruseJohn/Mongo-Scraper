var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Initialize Express
//var app = express();
var express = require("express");
var app = express();

//fetch all had app.js file contents here
// Grab the headlines as a json
module.exports = function (app) {
  // A GET route for scraping the star tribune website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.newyorker.com/humor/borowitz-report").then(function (response) {

      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an div tag, and do the following:
      //$("div h2").each(function(i, element) {
      //now try for every article with an image then get headline, link and summary
      $(".River__riverItem___3huWr").each(function (i, element) {
        //$("div.item-info").each(function (i, element) {

        // Save an empty result object
        var result = {};

        result.title = $(this).find("h4").text().trim();
        result.link = $(this).find("a.Link__link___3dWao").attr("href");
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