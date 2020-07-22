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

let getIndex = async function(req,res) {
	return res.render('index');
}

let getRecog = async function(req, res) {
	return res.render('recognize');
}

let getDetect = async function(req, res) {
	return res.render('detector');
}

let getLogin = async function(req, res)  {
	return res.render('login');
}

let getRegister = async function(req, res) {
	return res.render('register', {register_error: req.flash('register_error')});
}

let getHome = async function(req, res) {

	if(req.session.logined) {
		return res.render('home', {user: req.session.logined});
	}
	else {
		return res.send("null");
	}
}

let postLogin = async function(req, res) {
	var {email, password} = req.body;
	
	if(validator.isEmpty(email) || validator.isEmpty(password)) {
		req.flash('login_error', 'Các trường không được để trống!');
		return res.redirect('/login');	
	}
	else {
		var isExist = await UserDB.isExist(email);
		if(isExist) {
			User.findOne({email: email}, function(err, u) {
				if(!err) {
					req.session.logined = u;
					return res.redirect('/home');
				}
				else {
					req.flash('login_error', 'Xảy ra lỗi: ' + err);
					return res.redirect('/login');
				}
			});
		}
		else {
			req.flash('login_error', 'Email hoặc Mật khẩu không đúng!');
			return res.redirect('/login');
		}
	}
}

module.exports = {
	getIndex: getIndex,
	getHome: getHome,
	getRecog: getRecog,
	getDetect: getDetect,
	getLogin: getLogin,
	getRegister: getRegister,
	postLogin: postLogin
};