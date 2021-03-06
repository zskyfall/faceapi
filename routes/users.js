var express = require('express');
var router = express.Router();
const path = require("path");
const fs = require('fs');

const userController = require("../controller/userController");

//Models
var User = require('../models/User');

/* GET USERS ROUTERS */
router.get('/', userController.getAllUsers);

router.get('/add', (req, res) => {

	res.render('admin/add_user');

});

router.get('/edit/:id', (req, res) => {
	var id = req.params.id;

	User.findOne({_id: id}, (er, u) => {
		if(er) {
			res.send(er);
		}
		else {
			res.render('admin/edit_user', {user: u});
		}
	});

});

router.get('/photos/dir',async (req, res) => {
	let photos_dir = path.join(`${__dirname}/../public/upload/photos/`);

	await fs.readdir(photos_dir,(err, dirs) => {
	  let list = [];	
	  dirs.forEach(dir => {
	    //console.log(dir);	
	    console.log(dir);
	    list.push(dir);
	  });

	  res.json({success: 'true', list: list});
	});

});

router.get('/photos/images/:dir',async (req, res) => {
	var dir = path.join(`${__dirname}/../public/upload/photos/`) + req.params.dir;

	await fs.readdir(dir,(err, files) => {
	  let list = [];	
	  files.forEach(file => {
	    //console.log(dir);	
	    console.log(file);
	    list.push(file);
	  });

	  res.json({success: 'true', list: list});
	});

});


/*POST USERS ROUTERS */

router.post('/add', userController.addUser);

router.post('/remove', userController.removeUser);

router.post('/edit', userController.editUser);

module.exports = router;
