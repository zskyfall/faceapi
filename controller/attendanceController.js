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
var getCurrentDate = require('../utils/getCurrentDate');

let getAttendance = async function(req, res) {
	var date = getCurrentDate();

	await Attendance.find({date: date})
			  .populate('user_id')
			  .exec(function (err, rs) {
				    if (err){
				    	console.log(err);
				    	return res.send(err);
				    }
				    else {
				    	return res.render('date_attendance_list', {rs: rs});
				    }
				   
				});
}

let getAttendanceByDate = async function(req, res) {
	var date = req.params.date;

	Attendance.find({date: date})
			  .populate('user_id')
			  .exec(function (err, rs) {
				    if (err){
				    	console.log(err);
				    	return res.send(err);
				    }
				    else {
				    	return res.render('date_attendance_list', {rs: rs});
				    }
				   
				});
}

let getAttendanceByUser = async function(req, res) {
	var code = req.params.code;

	await User.findOne({code: code}, (err, u) => {
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

					return res.render("user_attendance_list", result);
				}

			});
		}
	});
}

let getAttendanceDetail = async function(req, res) {
	var user_code = req.params.user_code;

	await Attendance.findOne({user_code: user_code}, function(err, att) {

		if(!err) {
			return res.json({success: 'true', detail: att});
		}
		else {
			return res.json({success: 'false', error: err});
		}

	});
}

let checkAttendance = async function(req, res) {
	var user_code = req.params.user_code;
	var date = req.params.date;
	var time = req.params.time;
	var user_id = await User.findOne({code: user_code}).select('_id');

	console.log(user_code);
	console.log(date);

	await Attendance.countDocuments({user_code: user_code, date: date}, function(err, c) {

		if(!err) {
			if(c === 1) {
				return res.json({isAttendanced: 'true'});
			}
			else if(c < 1) {

				var att = new Attendance({
					user_id: user_id,
					user_code: user_code,
					date: date,
					time: time
				});

				att.save(function(er) {
					if(!er) {
						return res.json({isAttendanced: 'true'});
					}
					else {
						console.log(er);
					}
				});
			}		
		}
		else {
			return res.json({isAttendanced: 'false'});
		}

	});
}

module.exports = {
  getAttendance: getAttendance,
  getAttendanceByDate: getAttendanceByDate,
  getAttendanceByUser: getAttendanceByUser,
  getAttendanceDetail: getAttendanceDetail,
  checkAttendance: checkAttendance
};