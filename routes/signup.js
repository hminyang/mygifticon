var express = require('express');
var request = require('request');
var router = express.Router();
var getConnection = require('../lib/db');

router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('signup');
});

router.get('/authResult', function(req, res){
    var authCode = req.query.code
    console.log(authCode);
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        header : {
           'content-type' : 'application/json;charset=UTF-8' 
        },
        form : {
            code: authCode,
            client_id:'fn8HtLolk7Xmy60buPvw67PlHk65TeQ4g3BJfZaL',
            client_secret:'PpjvZjRtORB20mA0CnD14XIfP3GJMz9mCyhMIBaR',
            redirect_uri:'http://localhost:3000/signup/authResult',
            grant_type:'authorization_code'  
        }
    }
    request(option, function(err,response,body){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            var accessRequestResult = JSON.parse(body);
            console.log(accessRequestResult)
            res.render('resultChild', {data: accessRequestResult});
        }
    })
  })

  router.post('/', function(req, res){
    //data req get db store
    var userName = req.body.userName;
    var userId = req.body.userId;
    var userPassword = req.body.userPassword;
    var userAccessToken = req.body.userAccessToken;
    var userRefreshToken = req.body.userRefreshToken;
    var userSeqNo = req.body.userSeqNo;
    var authorization = req.body.authorization;
    console.log(userName, userAccessToken, userSeqNo, authorization);
    
    getConnection((conn) => {
        var sql = "INSERT INTO fintech.user (name, id, password, accesstoken, authorization, userSeqNo) VALUES (?, ?, ?, ?, ?, ?)";
        conn.query(
            sql, // sql execute
            [userName, userId, userPassword, userAccessToken, authorization, userSeqNo],
            function(err, result){
                if(err){
                    console.error(err);
                    res.json(0);
                    throw err;
                }
                else{
                    res.json(1);
                }
            })
    
        conn.release();
      });
    
    

})



module.exports = router;