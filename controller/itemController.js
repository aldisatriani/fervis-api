const fervis = require('../models/fervis')
const paginate = require('express-paginate')
const items = {};

//get all lists of ninjas from database

items.getall = function(req,res, next) {
	fervis.FervisItem.find({}).populate({
		path : 'user_id',
		select : 'username password created_at'
	}).then(function(data){
		res.send(data)
	}
	
	);
};	

//get single item from database
items.getsingle = function(req,res, next) {
	fervis.FervisItem.findOne({_id : req.params.id}).then(function(data){
			console.log(data['name'])
			res.send(data);
		}).catch(next);
	};

//Add new single item to database
items.post = function (req,res, next) {
	var dataToInsert = req.body
	dataToInsert.user_id = req.user._id // adding active user id
	console.log(dataToInsert)
	fervis.FervisItem.create(dataToInsert).then(function(data){
		res.redirect('/item')
		  

		// res.send({
		// 	success : true,
		// 	data : data
		// });
	}).catch(next);
};

//Delete single item
items.delete = function (req,res, next) {
	fervis.FervisItem.findByIdAndRemove({_id : req.params.id }).then(function(data){
		//console.log(data)
		//console.log(typeof data);
		if (data != null && data !== undefined){
			var sts = data.toJSON();
			sts.status = "Deleted";
			//console.log(typeof sts);
			res.send(sts['status']);
		} else {
			res.send('halo item yang ini sudah dihapus')
		}	
	}).catch(next);
};

//replace single item from database
items.put =  function(req,res, next) {
	fervis.FervisItem.findByIdAndUpdate({_id : req.params.id}, req.body).then(function(){
		fervis.FervisItem.findOne({_id : req.params.id}).then(function(ninja){
			res.send(ninja);
		});
	});
};

items.pagination = function( req, res, next){
		console.log(req.user._id) // from authenticated
		// fervis.FervisItem.find({}).populate({
		// 	path : 'user_id',
		// 	select : 'username password created_at'

		// }).then( function(items){
		// res.send(items)

		// });
		//console.log(typeof Items)
		fervis.FervisItem.paginate({"user_id" : req.user._id}, { page: req.query.page, limit: req.query.limit }, function(err, items){
			console.log(items)
			if (err) return next(err);
			//res.render('item',{items : items})
			//res.send(items)

		    res.format({
		      html: function() {
		        res.render('item', {
		          items: items.docs,
		          pageCount: items.pages,
		          itemCount: items.limit,
		          pages: paginate.getArrayPages(req)(3, items.pages, req.query.page)
		        });
		      },
		      json: function() {
		        // inspired by Stripe's API response for list objects
		        res.json({
		          object: 'list',
		          has_more: paginate.hasNextPages(req)(items.pages),
		          data: items.docs
		        });
		      }
				});
		    
		//res.send(data)
		//res.send({type :'GET'});
		});
};		
module.exports = items;