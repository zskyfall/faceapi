var express = require('express');
var router = express.Router();
var fs = require('fs');
var validator = require('validator');
var session = require("express-session");

//Models
var User = require('../models/User');
var Attendance = require('../models/Attendance');

//Databases
var UserDB = require('../databases/UserDB');
var AttendanceDB = require('../databases/AttendanceDB');

//Utils
var remove_special_chars = require('../utils/remove_special_chars');
var string_to_date = require('../utils/string_to_date');

router.get('/user/:code', function(req, res) {
	var code = req.params.code;

	User.findOne({code: code}, (err, u) => {
		if(err) {
			console.log(err);
		}
		else {
			Attendance.find({user_code: code}, (er, att) => {
				if(er) {
					console.log(er);
				}
				else {
					let result = {user: u, attendances: att};

					console.log(result);

					res.render("user_attendance_list", result);
				}

			});
		}
	})

});

router.get('/date/:date', function(req, res) {
	var date = req.params.date;

	Attendance.find({date: date})
			  .populate('user_id')
			  .exec(function (err, rs) {
				    if (err){
				    	console.log(err);
				    	res.send(err);
				    }
				    else {
				    	res.render('date_attendance_list', {rs: rs});
				    }
				   
				});

});

router.get('/detail/:user_code', function(req, res) {

	var user_code = req.params.user_code;

	Attendance.findOne({user_code: user_code}, function(err, att) {

		if(!err) {
			res.json({success: 'true', detail: att});
		}
		else {
			res.json({success: 'false', error: err});
		}

	});

});

router.get('/:user_code/:date/:time', function(req, res) {

	var user_code = req.params.user_code;
	var date = req.params.date;
	var time = req.params.time;

	console.log(user_code);
	console.log(date);

	Attendance.countDocuments({user_code: user_code, date: date}, function(err, c) {

		if(!err) {
			if(c === 1) {
				res.json({isAttendanced: 'true'});
			}
			else if(c < 1) {

				var att = new Attendance({
					user_code: user_code,
					date: date,
					time: time
				});

				att.save(function(er) {
					if(!er) {
						res.json({isAttendanced: 'true'});
					}
					else {
						console.log(er);
					}
				});
			}		
		}
		else {
			res.json({isAttendanced: 'false'});
		}

	});

	//res.json({success: 'true'});
});


module.exports = router;

