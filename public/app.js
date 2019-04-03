//scrape the articles
$("#scrape-articles").on("click", function(event) {

    $.ajax({
      method: "GET",
      url: "/scrape"
    })
    .then(function (data) {
      console.log(data);
      location.href = ('/');
    })
    
  });

  $("#read-article").on("click", "url", function() {
    var url = "https://www.newyorker.com" + data.link;
    console.log(data.link);
    console.log(url);
  });

// Whenever someone clicks a "make comment" button
$("body").on("click", "#make-comment", function() {
  // Empty the notes from the note section
  console.log("trying to get info on title");
  //$("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      $('#comment-modal').modal('show');
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='save-comment'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    }).catch(function (err) {
      console.log("Error in make comment in app.js not working: " + err);
    });
});

// When you click the save-comment button from modal
$("body").on("click", "#save-comment", function(event) {
  // Grab the id associated with the article from the submit button
  $('#comment-modal').modal('hide');
  var thisId = $(this).attr("data-id");
  console.log("comment saved");
  // Run a PUT request to update saved value of article from false to true
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#comment-input").trim().val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comment-input").empty();
    })
    .catch(function (err) {
      console.log("Error in saving comment in app.js not working: " + err);
    });
    
  
});

//whenever someone clicks on save article button
$("body").on("click", "#save-article", function (event) {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("article saved with this id: " + thisId);
  // Run a PUT request to update saved value of article from false to true
  $.ajax({
    method: "PUT",
    url: "/savedarticles/" + thisId,
  })
  // With that done
  .then(function (data) {
    // Log the response
    //console.log("suzy lives here");
    location.reload();
  })
  .catch(function (err) {
    console.log("Error in article app.js not working: " + err);
  });
});

//when ever someone clicks to remove save button or unsave the article
$("body").on("click", "#unsave-article", function (event) {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("article saved with this id: " + thisId);
  // Run a PUT request to update saved value of article from false to true
  $.ajax({
    method: "PUT",
    url: "/unsavedarticles/" + thisId,
  })
    // With that done
    .then(function (data) {
      // Log the response
      location.reload();
    })
    .catch(function (err) {
      console.log("Error in unsaving article app.js not working: " + err);
    });
});

//whenver someone clicks on the delete article button
$("body").on("click", "#delete-article", function (event) {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("article saved with this id: " + thisId);
  // Run a DELETE request to remove article from database
  $.ajax({
    method: "DELETE",
    url: "/deletearticles/" + thisId,
  })
    // With that done
    .then(function (data) {
      console.log("the article with this id: " + thisId + " was deleted from the database");
      location.reload();
    })
    .catch(function (err) {
      console.log("Error in article app.js not working: " + err);
    });
});

//when someone clicks to view saved articles
$('#saved').on("click", function (event) {
  location.href=('/saved');
});