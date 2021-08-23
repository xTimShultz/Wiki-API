const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const port = 3000;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////// Requests Targeting all Articles
app.route("/articles")
    .get(function(req,res) {
        Article.find(function(err, foundArticles){
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            };
        });
    })

    .post(function(req, res) {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("New article added.");
            }
        });
    })

    .delete(function(req, res) {
        Article.deleteMany(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("All articles deleted.");
            };
        });
    });

////////// Requests Targeting a Specific Article
app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({title: req.params.articleTitle}, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title found");
            };
        });
    });

app.listen(port,() => {
    console.log("Server listening at http://localhost:" + port);
});