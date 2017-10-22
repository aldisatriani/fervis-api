const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session')
const passport = require('passport');
const paginate = require('express-paginate')
var expressValidator = require('express-validator');
var flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const routes = require('./routes/fervis-api')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


// set up express app
const app = express();

// keep this before all routes that will use pagination
app.use(paginate.middleware(10,50));

//connect to mongodb
mongoose.connect('mongodb://localhost/fervisdb').then( function(){
	console.log('Connected to mongodb')
}).catch(function (err) {
	console.log(err.message)
});

//set Promise to global promise because mongoose's promises is deprecated
mongoose.Promise = global.Promise;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app logger by morgan
app.use(logger('dev'));

//set kukis parser
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//body-parser
app.use(bodyParser.json())

// Configure passport middleware
app.use(session({
    secret: 'satrianiawsome',
    resave: false,
    saveUninitialized: false
}));
//password init
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
const User = require('./models/fervisUserModel');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//connect to mongodb
mongoose.connect('mongodb://localhost/fervisdb').then( function(){
	console.log('Connected to mongodb')
}).catch(function (err) {
	console.log(err.message)
});

// Connect Flash
app.use(flash());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//initialize routes
app.use('/', routes)

//Error Handling Middleware
// 404 handling
app.use(function(req, res) {
  return res.status(404).send('oops');
});
//other error handling
app.use(function(err, req, res, next) {
  switch (err.name) {
  	
    case 'CastError':
    	console.log(err)
       	res.status(400); // Bad Request
    	return res.send({ "error" : err['name']});

    case 'ValidationError':
    	console.log(err)
    	res.status(422)
    	return res.send({ "Error" : err['errors']['name']})

    default:
    	console.log(err)
    	//res.status(500); // Internal server error
      	return res.send(err);
  }
});
//listen for request, process.env.port used when we need to deploy, example in heroku
app.listen(process.env.port || 4000, function() {
	console.log('now listening for requests');
});
