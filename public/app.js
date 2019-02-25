//import { get } from "https";

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "<br />" +
        data[i].summary +
        "</p>"
    );
  }
});

// Whenever someone clicks the save button
$(document).ready(function() {
  $(document).on("click", ".savearticle", function() {
    //Grab de id associated with the article from the submit button
    var thisId = $(this).attr("data-articleid");
    console.log(thisId);

    // Run a POST request to change the note
    $.ajax({
      method: "POST",
      url: "/savedarticles/" + thisId,
      data: {
        saved: true
      }
    }).then(function(data) {
      console.log(data);
      location.reload();
    });
  });
});

// Whenever someone clicks the Erase save button
$(document).ready(function() {
  $(document).on("click", ".deletearticle", function() {
    //Grab de id associated with the article from the submit button
    var thisId = $(this).attr("data-articleid");
    console.log(thisId);
    // Run a POST request to change the note
    $.ajax({
      method: "POST",
      url: "/deletesavedarticles/" + thisId,
      data: {
        saved: false
      }
    }).then(function(data) {
      console.log(data);
      location.reload();
    });
  });
});

//When click "article notes" opens a new location where all the notes will be displayed
/* $(document).ready(function() {
  $(document).on("click", ".articlenotes", function() {
    //Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-articleid");
    console.log(thisId);
    //Get all the notes releted to this article
    $.ajax({
      method: "GET",
      url: "/articlenotes/" + thisId
    }).then(function(data) {
      console.log(data);
    });
  });
}); */

//When click "article notes" opens a new location where a form for notes will be displayed
$(document).ready(function() {
  $(document).on("click", ".articlenotes", function() {
    //Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-articleid");
    console.log(thisId);
    //Get all the notes releted to this article
    $.ajax({
      method: "GET",
      url: "/articlenotesform/" + thisId
    }).then(function(data) {
      console.log(data);
    });
  });
});
