var express = require('express');
var router = express.Router();
var getConnection = require('../lib/db');
 
/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log("req.query",req.query); //
  
  var store_id= req.query.store_key;

    getConnection((conn) => {
        var sql = "SELECT * FROM fintech.menu where store_key=?";
        conn.query(
          sql,
          [store_id],
          function(err, result) {
            if(err) {
                console.error(err);
                throw err;
            }
            else {
              //console.log(result[0].menu_key);
              res.render('menu',{data:result} )
            }
          }
        );
    
        conn.release();
      });
      //res.render('menu');
});
 
module.exports = router;

