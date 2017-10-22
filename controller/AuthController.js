var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/fervisUserModel");


var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.render('index', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register', {});
};

// Post registration
userController.doRegister = function(req, res, next) {
  // Validation
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  console.log(errors)

  if (errors){
    res.render('register',{
      errors:errors,
      email : email,
      username : username,
      password : password,
      password2 : password2
    });
    return;
  } else {
  // you dont have to set true password on schema because its already handled by passport local mongoose
  User.register(new User({ username : req.body.username, email: req.body.email }), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register', { 
        err : err,
        email : email,
        username : username
        });
    }
      passport.authenticate('local')(req, res, function () {
      req.flash('success_msg', 'You are registered and can now login');
      res.redirect('/');
        });
    });
  }
};

// Go to login page
userController.login = function(req, res) {
  res.render('login', {
    user : req.user,
    message : req.flash('loginMessage') 
  });
};

// Post login
userController.doLogin = function(req, res, next) {
   passport.authenticate('local', { successRedirect : '/', failureRedirect : '/login', failureFlash : req.flash('loginMessage', 'Invalid User or Passwords')})
   (req, res, function () {
  //   res.redirect('/');    
   });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

//get user
userController.getUser = function(req, res, next) {
User.find({}, '-password -_id').then(function(data){
    res.send(data)
  }).catch(next);   
};

userController.ensureAuthenticate = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      res.redirect('/login');
  };
};
module.exports = userController;
