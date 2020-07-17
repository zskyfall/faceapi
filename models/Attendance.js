var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendanceSchema = mongoose.Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User' },
	user_code: { type: String, ref: 'User' },
	date: String,
	time: String,
});

var Attendance = mongoose.model('Attendance',attendanceSchema);
module.exports = Attendance;