//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//default content 
const homeStartingContent = "Journaling is no longer old-fashioned, or just for folks of a certain older-and-wiser age. It’s something you need to do — now. Yep, it’s true. Journaling does more than just help you record your memories or find self-expression. It’s good for your health. Journaling is a incredible stress management tool, a good-for-you habit that lessens impact of physical stressors on your health. In fact, a study showed that expressive writing (like journaling) for only 15 to 20 minutes a day three to five times over the course of a four-month period was enough to lower blood pressure and improve liver functionality.";
const aboutContent = "Keeping a journal, according to Dr. Pennebaker, helps to organize an event in our mind, and make sense of trauma. When we do that, our working memory improves, since our brains are freed from the enormously taxing job of processing that experience, and we sleep better. This in turn improves our immune system and our moods; we go to work feeling refreshed, perform better and socialize more.'There’s no single magic moment,' Dr. Pennebaker said. 'But we know it works.'";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//establish connection to local db
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//make schema for posts
const postSchema = {
  title: String,
  content: String
};

//create a model which uses schema
const Post = mongoose.model("Post", postSchema);

//home route
app.get("/", function(req, res){
  //find from all posts collection and send to homepage
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

//delete clicked post
app.post("/delete", function(req,res){
  const clickedPost = req.body.del;
  console.log(clickedPost);

  Post.findByIdAndDelete(clickedPost, function(err){
    if(!err){
      console.log("Successfully deleted checked item.");
        res.redirect("/");
    }
  });

});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
