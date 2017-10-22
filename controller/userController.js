const FervisUser = require('../models/fervisUserModel');
var passport = require("passport");
//console.log(fervis);

exports.post = function (req,res, next) {
  console.log(req.body)
  FervisUser.create(req.body).then(function(data){
    res.send({
    	success : true,
 		data : data
     });
    console.log(data);
  }).catch(next);
};

exports.get = function(req,res, next) {
  	FervisUser.find({}, '-password -_id').then(function(data){
		res.send(data)
	}).catch(next); 
};
