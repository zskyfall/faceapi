var express = require('express');
var router = express.Router();
const path = require("path");
const fs = require('fs');
const del = require('del');

const userController = require("../controller/userController");

/* GET USERS ROUTERS */
router.get('/', userController.getAllUsers);

router.get('/add', (req, res) => {

	res.render('admin/add_user');

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

module.exports = router;
