var express = require('express');
var router = express.Router();
var getConnection = require('../lib/db');
 
router.get('/', function(req, res, next) {
    res.render('store');
})

router.get('/storeList',function(req,res){
  
    getConnection((conn) => {
     
        var sql = "SELECT * FROM fintech.user where authorization=1";
        conn.query(
          sql,
          [],
          function(err, result) {
            if(err) {
                console.error(err);
                throw err;
            }
            else {
            
             
              res.json(result);
            }
          }
        );
    
        conn.release();
      });

})
 
module.exports = router;
