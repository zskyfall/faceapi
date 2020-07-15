var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/faceapi');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Lỗi kết nối CSDL'));
db.once('open', function() {
	console.log('Kết nối DB thành công!');
});

var attendanceSchema = mongoose.Schema({
	id: String,
	date: String
});

var Attendance = mongoose.model('attendance', attendanceSchema);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/recog', function(req, res) {
	res.render('recognize');
});

app.get('/detect', function(req, res) {
	res.render('detector');
});

app.get('/attendance/:id/:date', function(req, res) {

	var id = req.params.id;
	var date = req.params.date;
	console.log(id);
	console.log(date);

	Attendance.countDocuments({id: id, date: date}, function(err, c) {

		if(!err) {
			if(c >= 1) {
				res.json({isAttendanced: 'true'});
			}
			else {
				res.json({isAttendanced: 'false'});

			}			
		}
		else {
			res.json({isAttendanced: 'false'});
		}

	});

	//res.json({success: 'true'});
});

app.get('/test/insert', function(req, res) {

	var att = new Attendance({
		id: 'Thang',
		date: '15-7-2020'
	});

	att.save(function(err) {
		if(!err) {
			res.send("ok")
		}
	});

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
