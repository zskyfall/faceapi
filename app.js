var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require("express-session");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/faceapi', {
	useCreateIndex: true,
  	useNewUrlParser: true,
  	useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Lỗi kết nối CSDL'));
db.once('open', function() {
	console.log('Kết nối DB thành công!');
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var attendanceRouter = require('./routes/attendance');
var testRouter = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
 secret: 'keyboard cat',
 resave: true,
 saveUninitialized: true
}));
//Connect-flash
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname + '/public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/attendance', attendanceRouter);
app.use('/test', testRouter);


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
