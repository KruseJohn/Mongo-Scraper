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

  //this route is broken++++++++++++++++++++++++
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
       "_id": req.params.id
      })
      // ..and populate all of the notes associated with it
      .populate("note")
      .exec(function (error, data) {
        
      if (error) {
        console.log(error);
      }
      else {
        res.json(data);
      }
  });

});

  // Route for making/saving/updating an Article's associated Note
   app.post("/articles/:id", function (req, res) {
     // Create a new note and pass the req.body to the entry
     db.Note.create(req.body)
       .then(function (dbNote) {
         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
       })
       .then(function (dbArticle) {
         // If we were able to successfully update an Article, send it back to the client
         res.json(dbArticle);
       })
       .catch(function (err) {
         // If an error occurred, send it to the client
         res.json(err);
       });
   }); 


  //route for creating a new comment
  app.post("/notes/save/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new Note({
      body: req.body.text,
      article: req.params.id
    });
    console.log(req.body)
    // And save the new note the db
    newNote.save(function (error, note) {

      if (error) {
        console.log(error);
      } else {
        Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $push: {
              "notes": note
            }
          })
          .exec(function (err) {

            if (err) {
              console.log(err);
              res.send(err);
            } 
            else {
              res.send(note);
            }
          });
      }
    });
  });

  // Route for retrieving all Notes from the db
  app.get("/notes", function (req, res) {
    // Find all Notes
    db.Note.find({})
      .then(function (dbNote) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbNote);
      })
      .catch(function (err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  //Route for getting/finding all notes in the database associated with a particular headline/article.
  app.get("/notes/:id", function (req, res) {
    if (req.params.id) {
      db.Note.find({
          "article": req.params.id
        })
        .exec(function (error, doc) {
          if (error) {
            console.log(error)
          } else {
            res.send(doc);
          }
        });
    }
  });

  //Delete a note
  app.delete("/notes/:id", function (req, res) {
    // Remember: when searching by an id, the id needs to be passed in
    db.Note.deleteOne({
        _id: req.params.id
      },
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json(data);
        }
      });
  });
}