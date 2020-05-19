var express = require('express');
var router = express.Router();
 
/* GET home page. */
router.post('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  //var userId = req.decoded.userId;
  var userId = 7; //test용
  var fin_use_num = req.body.fin_use_num;
  
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991628950U" + countnum; //이용기관번호 본인것 입력
  
  var sql = "SELECT * FROM user WHERE id = ?"
  connection.query(sql,[userId], function(err , result){
      if(err){
          console.error(err);
          throw err
      }
      else {
          console.log(result);
          var option = {
              method : "POST",
              url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
              headers : {
                  Authorization : 'Bearer ' + result[0].accesstoken,
                  "Content-Type" : "application/json"
              },
              json : {
                "bank_tran_id" : transId,
                "cntr_account_type": "N",
                "cntr_account_num": "3521507517",
                "dps_print_content": "쇼핑몰환불",
                "fintech_use_num": fin_use_num,
                "wd_print_content": "오픈뱅킹출금",
                "tran_amt": "1000",
                "tran_dtime": "20200424131111",
                "req_client_name": "홍길동",
                "req_client_fintech_use_num": "199162895057883857732600",
                "req_client_num": "HONGGILDONG1234",
                "transfer_purpose": "TR",
                "recv_client_name": "진상언",
                "recv_client_bank_code": "097",
                "recv_client_account_num": "3521507517"
              }
          }
          request(option, function(err, response, body){
              if(err){
                  console.error(err);
                  throw err;
              }
              else {
                  console.log(body);
                  if(body.rsp_code == 'A0000'){
                      res.json(1)
                  }
              }
          })
      }
    })

});
 
module.exports = router;

