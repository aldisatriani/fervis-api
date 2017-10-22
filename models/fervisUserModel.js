const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//user model and Schema

const FervisUserSchema = new Schema({
	username : {
		type : String,
		required: true,
	    minlength: [5, 'Username must be 5 characters or more.'],
	},
	password : {
		type: String,
    	minlength: [8, 'Password must be 8 characters or more.'], //Need validation
	},
	email : {
		type : String
	},
	created_at : {
		type : Date,
		default : Date.now()
	},
	isDeleted : {
		type : Boolean,
		default : false
	}

});
FervisUserSchema.plugin(passportLocalMongoose);
const FervisUser = mongoose.model('fervisuser', FervisUserSchema);


module.exports = FervisUser;