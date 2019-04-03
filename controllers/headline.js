var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Initialize Express
//var app = express();
var express = require("express");
var app = express();

//Require mongojs
var mongoose = require("mongoose");

module.exports = function (app) {

  // Route for getting all unsaved articles from the db
  //this is for the root and uses index.handlebars
  app.get("/", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({ saved : false }, function (err, result) {
      if (err) {
        console.log("Error in finding unsaved articles: " + err);
      }
      else {
        res.render("index", {
          articles: result
        });
      }
      });
  });

  //this grabs id of article being saved and updates the saved from false to true
  app.put("/savedarticles/:id", function (req, res) {
    
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
    .then(function (result) {
      console.log("this savedarticle is working");
      res.json(result);
      
    })
    .catch(function (err) {
      res.json(err);
      console.log("Error in finding saved articles: " + err);
    });
  });

  //this grabs id of article being unsaved and updates the saved from true to false
  app.put("/unsavedarticles/:id", function (req, res) {

    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
      .then(function (result) {
        console.log("this unsaved article is working");
        res.json(result);

      })
      .catch(function (err) {
        res.json(err);
        console.log("Error in finding saved articles: " + err);
      });
  });
  
  //route for getting all the saved articles
  //this is for the /saved path and uses saved.handlebars
  app.get("/saved", function (req, res) {
    //Query: in our database, go to the articles collection, 
    //then "find" every article that is saved (has a saved value of true);
    db.Article.find({ saved: true }, function (error, result) {
      //Log any errors if the server encounters one.
      if (error) {
        console.log("Error in getting saved articles: " + error);
      }
      //Otherwise, send the result of this query to the browser.
      else {
        res.render("saved", {
          articles: result,
        });
      }
    });
  });

   // Route for getting all articles from the db
   app.get("/all", function (req, res) {
     // Grab every document in the Articles collection
     db.Article.find({ saved: false }, function (err, result) {
      if (err) {
         console.log("Error in finding all articles: " + err);
       }
       else {
         res.render("index", {
           articles: result
         });
       }
     });
   });

  app.post('/', function (req, res) {
    res.json(data); 
  });

}