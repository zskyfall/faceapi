var express = require('express');
var router = express.Router();

const attendanceController = require("../controller/attendanceController");

router.get('/', attendanceController.getAttendance);

router.get('/user/:code', attendanceController.getAttendanceByUser);

router.get('/date/:date', attendanceController.getAttendanceByDate);

router.get('/detail/:user_code', attendanceController.getAttendanceDetail);

router.get('/:user_code/:date/:time', attendanceController.checkAttendance);

module.exports = router;

