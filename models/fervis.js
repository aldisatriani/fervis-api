const mongoose = require('mongoose');
const mongPaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;

//Create groups model and Scema
const FervisGroupsShceme = new Schema({
	groups : {
		type : String,
		required : [true, 'groups Field is required']
	},
	description : {
		type : String
	},
	group_number : Number,

	
});
const FervisGroup = mongoose.model('fervisgroup', FervisGroupsShceme);


//Create item model and Scema
const FervisItemShceme = new Schema({
	name : {
		type : String,
		required : [true, 'Name Field is required']
	},
	user_id : {
		type : Schema.ObjectId, ref : 'fervisuser'  
	},
	url : String,
	item_description : String,
	stock : Number,
	price : {
		type : String
	},
	available : {
		type : Boolean,
		default : false	
	},
	item_condition : {
		type : Boolean,
		default : true // false in used item (barang seken)
	},
	created_at : {
		type : Date,
		default : Date.now()
	},
	deleted_at : {
		type : Date
	},
	updated_at : {
		type : Date
	},
	item_status : {
		type : Boolean,
		default : false // if its true then item has been sold
	}, 
});
//Fervis is a models used in different file, 'fervis' is name of collection in mongodb
FervisItemShceme.plugin(mongPaginate)
const FervisItem = mongoose.model('fervis', FervisItemShceme);


module.exports = {
	FervisItem : FervisItem,
	FervisGroup : FervisGroup
};

