var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');
var validator = require('validator');
var session = require("express-session");

//Models
var User = require('../models/User');

//Databases
var UserDB = require('../databases/UserDB');

//Modules
var fileManager = require('../modules/fileManager');

//Utils
var remove_special_chars = require('../utils/remove_special_chars');
var string_to_date = require('../utils/string_to_date');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});


router.get('/recog', function(req, res) {
	res.render('recognize');
});

router.get('/detect', function(req, res) {
	res.render('detector');
});

router.get('/login', function(req, res) {

	res.render('login');

});

router.get('/register', function(req, res, next) {
  
  	 res.render('register', {register_error: req.flash('register_error')});
});

router.get('/home', function(req, res, next) {
	console.log(req.session.logined);
	if(req.session.logined) {
		res.render('home', {user: req.session.logined});
	}
	else {
		res.send("noull");
	}

});


router.post('/login', async function(req, res) {

	var {email, password} = req.body;
	
	if(validator.isEmpty(email) || validator.isEmpty(password)) {
		req.flash('login_error', 'Các trường không được để trống!');
		res.redirect('/login');	
	}
	else {
		var isExist = await UserDB.isExist(email);
		if(isExist) {
			User.findOne({email: email}, function(err, u) {
				if(!err) {
					req.session.logined = u;
					res.redirect('/home');
				}
				else {
					req.flash('login_error', 'Xảy ra lỗi: ' + err);
					res.redirect('/login');
				}
			});
		}
		else {
			req.flash('login_error', 'Email hoặc Mật khẩu không đúng!');
			res.redirect('/login');
		}
	}

});

module.exports = router;

