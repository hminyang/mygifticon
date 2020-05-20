var express = require('express');
var router = express.Router();
 
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('signup');
});

router.get('/authResult', function(req, res){
  var authCode = req.query.code
  console.log(authCode);
  //res.json(authCode);
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
          redirect_uri:'http://localhost:3000/authResult',
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

 
module.exports = router;

