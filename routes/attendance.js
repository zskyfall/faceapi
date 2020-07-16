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

//Utils
var remove_special_chars = require('../utils/remove_special_chars');
var string_to_date = require('../utils/string_to_date');

router.get('/user/:id', function(req, res) {
	var id = req.params.id;

	Attendance.find({id: id})

	res.render('user_attendance_list');

});

router.get('/detail/:id', function(req, res) {

	var id = req.params.id;

	Attendance.findOne({id: id}, function(err, att) {

		if(!err) {
			res.json({success: 'true', detail: att});
		}
		else {
			res.json({success: 'false', error: err});
		}

	});

});

router.get('/:id/:date/:time', function(req, res) {

	var id = req.params.id;
	var date = req.params.date;
	var time = req.params.time;

	console.log(id);
	console.log(date);

	Attendance.countDocuments({id: id, date: date}, function(err, c) {

		if(!err) {
			if(c === 1) {
				res.json({isAttendanced: 'true'});
			}
			else if(c < 1) {

				var att = new Attendance({
					id: id,
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

