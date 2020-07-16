var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendanceSchema = mongoose.Schema({
	id: String,
	date: String,
	time: String
});

var Attendance = mongoose.model('Attendance',attendanceSchema);
module.exports = Attendance;