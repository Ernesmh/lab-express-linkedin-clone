const express = require('express');
const authController  = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page. */
authController.get('/signup', (req, res, next) => {
  res.render('authentication/signup', {
    errorMessage: ''
  });
});

authController.post("/signup", (req, res, next) => {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const summary = req.body.summary;
    const imageURL = req.body.imageURL;
    const company = req.body.company;
    const jobTitle = req.body.jobTitle;

  if (name === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "name": username }, "name", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    let newUser = new User({
      name,
      password: hashPass,
      email,
      summary,
      imageURL,
      company,
      jobTitle
    });

    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});


authController.get('/login', (req, res) => {
  res.render('authentication/login', {
  errorMessage: ''
});
});

authController.post("/login", (req, res, next) => {
  const {email, password} = req.body;

  if (email === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate an email and a password to sign up"
    });
    return;
  }

  User.findOne({ "email": email }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The email doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {

        req.session.currentUser = user;
        res.render('authentication/home', {user: user});
      }
      else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

authController.get('/logout', (req,res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

module.exports = authController;
