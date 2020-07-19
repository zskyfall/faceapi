var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add', (req, res) => {

	res.render('admin/add_user');

});

module.exports = router;
