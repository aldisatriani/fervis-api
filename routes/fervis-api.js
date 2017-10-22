const express = require('express');
const router = express.Router();
const fervis = require('../models/fervis');
const userController = require('../controller/userController')
const itemController = require('../controller/itemController')
const auth = require("../controller/AuthController.js");


// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);



//create new user 
router.post('/user', userController.post);

//get users list
router.get('/user', auth.ensureAuthenticate, auth.getUser);

//get single users
//code

//update users
// code

//delete users
//code

 

//get all lists of ninjas from database
//router.get('/item', auth.ensureAuthenticate, itemController.getall);

//get single item from database
router.get('/item/:id', auth.ensureAuthenticate, itemController.getsingle);

//Add new single item to database
router.post('/item', auth.ensureAuthenticate, itemController.post);

//Delete single item
router.delete('/item/:id', auth.ensureAuthenticate, itemController.delete);

//replace single item from database
router.put('item/:id', auth.ensureAuthenticate, itemController.put)

//items pagination
router.get('/item', auth.ensureAuthenticate, itemController.pagination);



router.get('/group', function(req,res, next) {
	fervis.FervisGroup.find({}).then(function(data){
		res.send(data)
		//res.send({type :'GET'});
	});
});


//get item's Group list
router.get('/item/:id/group', function(req,res, next) {
	res.send({type :'GET Single Item Group List'});
	});

//Add new groups
router.post('/group', function (req,res, next) {
	console.log(req.body)
	fervis.FervisGroup.create(req.body).then(function(data){
		res.send(data);
		console.log(data);
	}).catch(next);
});

//replace single item from database
router.put('/item/:id', function(req,res, next) {
	fervis.FervisItem.findByIdAndUpdate({_id : req.params.id}, req.body).then(function(){
		fervis.FervisItem.findOne({_id : req.params.id}).then(function(ninja){
			res.send(ninja);
		});
	});
});

//update single item from database
router.patch('/item/:id', function(req,res, next) {
	res.send({type :'UPDATE Single Item'});
	});

//Delete single item
router.delete('/item/:id', function (req,res, next) {
	fervis.FervisItem.findByIdAndRemove({_id : req.params.id }).then(function(data){
		//console.log(data)
		//console.log(typeof data);
		var sts = data.toJSON();
		sts.status = "Deleted";
		//console.log(typeof sts);
		res.send(sts['status']);
	});
});

//Delete group item
router.delete('/group/:id', function (req,res, next) {
	fervis.FervisGroup.findByIdAndRemove({_id : req.params.id }).then(function(data){
		//console.log(data)
		//console.log(typeof data);
		var sts = data.toJSON();
		sts.status = "Deleted";
		//console.log(typeof sts);
		res.send(sts['status']);
	});
});


module.exports = router;

/* The Content-Type in request header is really important, especially when you post the data from curl or any other tools (postman ect).
Make sure you're using some thing like application/x-www-form-urlencoded, application/json or others, 
it depends on your post data. Leave this field empty will confuse Express. */