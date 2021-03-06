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

// Whenever someone clicks "comment" button
$("body").on("click", "#make-comment", function() {
  
  console.log("trying to get info on title");
  
  // Save the id
  var thisId = $(this).attr("data-id");

  // Make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // Add the note information to the page
    .then(function (data) {
      $('#comment-modal').modal('show');
      console.log(data);
      // The title of the article
      $(".modal-title").append("<h5>" + data.title + "</h5>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
     // $("#notes").append("<button data-id='" + data._id + "' id='save-comment'>Save Note</button>");

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
    url: "/notes/save/" + thisId,
    data: {
      // Value taken from note textarea
      text: $("#note-Body" + thisId).val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#note-Body" + thisId).val("");
      $(".modalNote").modal("hide");
      window.location = "/saved"
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

//when someone clicks to view saved articles
$('#saved').on("click", function (event) {
  location.href=('/saved');
});