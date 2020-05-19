var express = require('express');
var router = express.Router();
 
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //임시로
  res.render('main');
});
 
module.exports = router;

