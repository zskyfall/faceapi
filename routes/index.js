var express = require('express');
var router = express.Router();

const indexController = require("../controller/indexController");

/* GET home page. */
router.get('/', indexController.getIndex);

router.get('/recog', indexController.getRecog);

router.get('/detect', indexController.getDetect);

router.get('/login', indexController.getLogin);

router.get('/register', indexController.getRegister);

router.get('/home', indexController.getHome);

router.post('/login', indexController.postLogin);

module.exports = router;

