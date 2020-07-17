var mongoose = require('mongoose');
var User = require('../models/User');
var Attendance = require('../models/Attendance');

module.exports = {
	getAttendancesById: (code, callback) => {
		var query = {user_code: code};

		///USE $LOOKUP
		// Attendance.find(query, callback);
		// Attendance.aggregate([
		// 	{$lookup:
		// 			{
		// 				from: 'User',
		// 				localField: 'id',
		// 				foreignField: '_id'

		// 			}
		// 	}
		// ]).toArray((err, res) => {
		// 	if(err) {
		// 		console.log(err);
		// 	}
		// 	else {

		// 	}
		// });

		///USE POPULATE
		// Attendance.find(query)
		// 		  .populate('User')
		// 		  .exec(callback);

	},
	getAttendancesByDate: (date, callback) => {
		var query = {date: date};
		Attendance.find(query, callback);
	}
}