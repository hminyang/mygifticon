var express = require('express');
var router = express.Router();
var getConnection = require('../lib/db');
 
/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log("req.query",req.query); //
  console.log("menu page")
  
  var store_id= req.query.store_key;
    getConnection((conn) => {
        var sql = "SELECT A.menu_key, A.store_key, A.name, A.description,A.price,A.img,B.name as cafename FROM fintech.menu A  INNER JOIN fintech.user B ON A.store_key = B.user_key AND A.store_key = ?";
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
              //console.log(result);
              res.render('menu',{data:result} )
            }
          }
        );
    
        conn.release();
      });
      //res.render('menu');
});
 
module.exports = router;

