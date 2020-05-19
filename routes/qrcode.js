var express = require('express');
var router = express.Router();
var getConnection = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //임시로
  res.render('main');
  
  getConnection((conn) => {
    var sql = "SELECT * FROM USER";
    conn.query(
      sql,
      [],
      function(err, result) {
        if(err) {

        }
        else {
          console.log(result)
        }
      }
    );

    conn.release();
  });
});
 
module.exports = router;

