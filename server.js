var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/hw18NYT", { useNewUrlParser: true });

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes

// A GET route for scraping the NYT website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/es/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every story-meta id element, and do the following:
    $(".story-meta").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text  of every link, and save them as properties of the result object
      result.title = $(this)
        .children("h2")
        .text();
      result.summary = $(this)
        .children("p")
        .text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Use Handlebars to render the main index.html page with the articles in it.
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("index", { articles: dbArticle });
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
});

// A GET route for showing all the saved news from the NYT website
app.get("/savedarticles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({
    saved: true
  })
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("savedindex", { articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db and display them  in Home
app.get("/", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      //res.json(dbArticle);
      res.render("index", { articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// A Route for changing the status of saved in an Article
app.post("/savedarticles/:id", function(req, res) {
  // Grab every document in the Articles collection
  return db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      //res.json(dbArticle);
      res.render("index", { articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// A Route for deleting a saved article
app.post("/deletesavedarticles/:id", function(req, res) {
  // Grab every document in the Articles collection
  return db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      //res.json(dbArticle);
      res.render("savedindex", { articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// A GET route for showing all the notes related to an article
app.get("/articlenotes/:id", function(req, res) {
  // Grab every document in the Notes collection
  return db.Note.find({
    articlerelatednote: req.params.id
  })
    .then(function(dbNote) {
      // If we were able to successfully find Notes, send them back to the client
      res.render("notesindex", { notes: dbNote });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// A GET route for showing the form for the note related to an article
app.get("/articlenotesform/:id", function(req, res) {
  // Grab every document in the Notes collection
  return res.render("noteform");
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
