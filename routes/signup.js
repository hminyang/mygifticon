var express = require('express');
var request = require('request');
var router = express.Router();
var getConnection = require('../lib/db');

router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('signup');
});

// 금융결제원 사이트에서 인증받아오기
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

  // Signup 버튼을 눌렀을 때 
  // AccessToken과 UserSeqNo를 이용하여 사용자 계좌정보를 조회한 뒤
  // 사용자 정보, token과 fin_usenum을 db에 저장한다.
  router.post('/', function(req, res){
    //data req get db store
    var userName = req.body.userName;
    var userId = req.body.userId;
    var userPassword = req.body.userPassword;
    var userAccessToken = req.body.userAccessToken;
    var userRefreshToken = req.body.userRefreshToken;
    var userSeqNo = req.body.userSeqNo;
    var authorization = req.body.authorization;
    var finUseNum = null;
    console.log("========= 입력한 회원가입 정보 ==========\n" + 
                "이름 : "+ userName + "\n" + 
                "토큰 : "+ userAccessToken + "\n" +
                "userSeqNo : "+ userSeqNo + "\n" +
                "권한(사업자1/일반2) : "+ authorization + "\n" +
                "finUseNum : " + finUseNum + " (계좌정보 받아오기 전)" );
    
    var option = {
        method : "GET",
        url : "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers : {
            Authorization : 'Bearer ' + userAccessToken,
        },
        data : {
            user_seq_no : userSeqNo,
        }
    }
    
    request(option, function(err, res, body){
        console.log('UserSeqNo, AccessToken으로 계좌조회!!!!!')
        console.log("option ==> "+JSON.stringify(option));
        console.log("API 요청 결과 : " + body);
        if(err){
            console.error(err);
            throw err;
        }
        else {
            console.log("rsp_code == 'A0000'이면 계좌리스트 출력");
            console.log("AccessToken : " + userAccessToken);
            if(body.rsp_code == 'A0000'){
                var resList = body.res_list;
                
                console.log(JSON.stringify(resList));
                console.log(body.res_list[0].fin_use_num);

                finUseNum = body.res_list[0].fin_use_num;

                //db에 계좌정보와 토큰 등을 저장
                getConnection((conn) => {
                    var sql = "INSERT INTO fintech.user (name, id, password, accesstoken, authorization, fin_usenum) VALUES (?, ?, ?, ?, ?, ?)";
                    conn.query(
                        sql, // sql execute
                        [userName, userId, userPassword, userAccessToken, authorization, finUseNum],
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
            }else{
                console.log('조회에러발생');
                res.json(3);
            }
        }
    })


    
    
    

})



module.exports = router;