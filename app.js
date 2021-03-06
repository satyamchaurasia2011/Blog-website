require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

let blogPosts = [];
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://admin-satyam:satyam123@cluster0-obeo5.mongodb.net/blogsiteDB', {useNewUrlParser: true, useUnifiedTopology: true});
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});
const subscriberSchema = new mongoose.Schema({
    name: String,
    email: String
});
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    day: String
});
const adminSchema = new mongoose.Schema({
    password: String
});

const Contact = mongoose.model("Contact", contactSchema);
const Subscriber = mongoose.model("Subscriber", subscriberSchema);
const Post = mongoose.model("Post", postSchema);
const Encrypt = mongoose.model("Encrypt", adminSchema);


const newAdmin = new Encrypt({
    password: process.env.SECRET
});
// newAdmin.save();


/////////////Get Requests/////////////
app.get("/", function(req, res) {
    Post.find(function(err, blogPosts){
        res.render("home", {blogs: blogPosts});
    });
});
 
app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/compose", function(req, res){
    res.render("password");
});

app.get("/posts/:postId", function(req, res){
     const requestId = req.params.postId;
     Post.findOne({_id: requestId}, function(err, post){
         if(err){
             console.log(err);
         } else {
             res.render("post", {heading: post.title, paragraph: post.content, image: post.image});
         }
     });
     
});

 
///////////////Post Request////////////////////
app.post("/", function(req, res){
    const newUser = new Subscriber({
        name: req.body.name,
        email: req.body.email
    });
    newUser.save(function(err){
        if(!err){
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
});
 

app.post("/password", function(req, res){
    const secret = req.body.password;
    Encrypt.find(function(err, adminUser){
        if(adminUser[0]){
            if(adminUser[0].password === secret){
                res.render("compose");
            } else {
                res.send("<h1>Error</h1>");
            }
        }
    });
});

app.post("/contact", function(req, res){
    const newContact = new Contact({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });
       newContact.save(function(err){
           if(!err){
         res.redirect("/");
       } else {
           console.log(err);
       }
    });
});

app.post("/compose", function(req, res){
   
    const newPost = new Post({
        title: req.body.title,
        content: req.body.blogData,
        image: req.body.image,
        day: new Date().toLocaleDateString() + "  " + new Date().toLocaleTimeString('en-US', {hour: "numeric",minute: "numeric"})
    });
    newPost.save(function(err){
        if(!err){
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
}); 


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});

