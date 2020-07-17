var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');
var validator = require('validator');
var session = require("express-session");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Models
var User = require('../models/User');
var Attendance = require('../models/Attendance');

//Databases
var UserDB = require('../databases/UserDB');
var AttendanceDB = require('../databases/AttendanceDB');


//Utils
var remove_special_chars = require('../utils/remove_special_chars');
var string_to_date = require('../utils/string_to_date');
var getCurrentTime = require('../utils/getCurrentTime');
var getCurrentDate = require('../utils/getCurrentDate');

router.get('/insert/user', (req, res) => {
	var u = new User({
		name: "Nguyen Huu Thang",
		email: "zefost@gmail.com",
		phone_number: "0123266",
		code: "NHT23",
		gender: "male",
		birthday: "23-12-1996",
		address: "HN",
		avatar: "avatar.jpg",
		photos: ["avatar.jpg"],
		job: "developer",
		level: 3
	});


	var u2 = new User({
		name: "Hoang Thi Loan",
		email: "loan@gmail.com",
		phone_number: "014563266",
		code: "HTL01",
		gender: "female",
		birthday: "02-01-2000",
		address: "DN",
		avatar: "avatar2.jpg",
		photos: ["avatar2.jpg"],
		job: "tester",
		level: 1
	});

	var u3 = new User({
		name: "Pham Van Vy",
		email: "vy022@gmail.com",
		phone_number: "01199878466",
		code: "PVV96",
		gender: "unknown",
		birthday: "02-12-1990",
		address: "Hung Yen",
		avatar: "avatar3.jpg",
		photos: ["avatar3.jpg"],
		job: "fullstack",
		level: 2
	});

		u3.save(function(err) {
			if(err) {
				console.log(err);
			}
			else {
				res.send("saved!");
			}
		});
});

router.get('/insert/attendance', (req, res) => {

	User.findOne({code: 'PVV96'}, (err, u) => {
		if(err) {
			console.log(err);
		}
		else {
				var att = new Attendance({
					user_id: u._id,
					user_code: u.code,
					date: '14-7-2020',
					time: '10:01:00'
				});

					att.save((e) => {
						if(e) console.log;
						else res.send("saved!");
					});
		}
	});

});

router.get('/get', (req, res) => {
	AttendanceDB.getAttendancesById('5f11066e8ca23129c8a97d24', (err, att) => {
		if(err) {
			console.log(err);
		}
		else {
			console.log(att);
			res.send(att);
		}
	});
});

module.exports = router;

