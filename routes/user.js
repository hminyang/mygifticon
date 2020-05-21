var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var getConnection = require('../lib/db');
 
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('login');
});

router.post('/', function(req, res){
  var userId = req.body.userId;
  var userPassword = req.body.userPassword;

  getConnection((conn) => {
    
    var sql = "SELECT * FROM fintech.user WHERE id = ?";
    conn.query(
        sql, 
        [userId],
        function(err, result){
            if(err){
                console.err(err);
                res.json(0);
                throw err;
            }
            else{
                if(result.length == 0){
                    res.json(3);
                }
                else{
                    console.log(result[0]);
                    var dbPassword = result[0].password;
                    if(dbPassword == userPassword){
                        var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
                        jwt.sign(
                        {
                            userId : result[0].id,
                            fin_usenum : result[0].fin_usenum,
                            authorization : result[0].authorization
                        },
                        tokenKey,
                        {
                            expiresIn : '10d',
                            issuer : 'fintech.admin',
                            subject : 'user.login.info'
                        },
                        function(err, token){
                            console.log('로그인 성공', token);
                            var info = {
                                jwt : token,
                                user_key: result[0].user_key,
                                userId : result[0].id,
                                fin_usenum : result[0].fin_usenum,
                                authorization : result[0].authorization,
                                accessToken : result[0].accessToken,
                            }
                            res.json(info)
                        }
                        )
                    }
                    else{
                        res.json(2);
                    }
                }
            }
          });

    conn.release();
  });
})

module.exports = router;