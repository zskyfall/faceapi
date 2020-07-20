var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	code: String,
	phone_number: String,
	gender: String,
	birthday: String,
	address: String,
	avatar: String,
	photos: [],
	job: String,
	level: Number,
	attendances: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }]
});

var User = mongoose.model('User',userSchema);
module.exports = User;