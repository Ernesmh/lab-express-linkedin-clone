const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const isLoggedIn = require('../middlewares/isLoggedIn');
const privController = express.Router();


privController.get('/home', isLoggedIn, (req, res) => {
  res.render('authentication/home', {user});
});

privController.post('/profiles/:id', (req, res, next) => {
  const userId = req.params.id;

  const updates = {
     name : req.body.name,
     email : req.body.email,
     password : req.body.password,
     summary : req.body.summary,
     imageURL : req.body.imageURL,
     company : req.body.company,
     jobTitle : req.body.jobTitle
  };

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    res.render('home',{user: user});
  });
});

// GET show page
// Show the profile of the user
privController.get('/profiles/show/:id', (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    Post.find({"_owner" : userId}, (err, posts) => {
      if (err) { return next(err); }
      res.render('profiles/show', {
        user: user,
        session: req.session.currentUser,
        posts: posts
      });
    });
  });


});

// GET edit page
// Throws you to the edit profile page
privController.get('/profiles/:id/edit', (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('profiles/edit', { user: user });
  });
});


// GET new post page
// Lets the user introduce a new post
privController.get('/users/:id/posts/new', (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('posts/new', { user: user });
  });
});

// POST new post form
// Save the new post in the ddbb
privController.post('/users/:id/posts', isLoggedIn, (req, res, next) => {
  const userId = req.params.id;

  let newPost = new Post({
    content: req.body.content,
    _owner: userId});

  newPost.save((err) => {
    if (err) {
      res.render("posts/new",
        {
          user : user,
          errorMessage: "Couldn't save the data!",
        });
    }
    else {
      res.redirect("/profiles/show/" + userId);
    }
  });
});

module.exports = privController;
