var mongoose = require('mongoose');
var User = require('../models/User');

module.exports = {
	isExist: async (email) => {
		var c = await User.countDocuments({email: email}, (err, c) => {
			if(err) {
				console.log(err);
			}
		});
		
		return c < 1 ? false : true;
	},
	getAllUsers: (callback) => {
		var query = {};
		User.find(query, callback);
	},
	getUserByEmail: (e, callback) => {
		var query = {email: e};
		User.findOne(query, callback);
	}
}