var express = require('express');
const request = require('request')
var router = express.Router();
var getConnection = require('../lib/db');

// router.get('/generate', function(req, res){
//     res.render('qrcode');
// })

router.post('/', function(req, res, next) {

    var step = req.body.step;

    //buy gifticon
    if(step=="buy"){
        //var userId = req.decoded.userId;
        var user_key = req.body.user_key; //test용
        var tran_amt = req.body.price;
        var store_name = req.body.store_name;
        
        var countnum = Math.floor(Math.random() * 1000000000) + 1;
        var transId = "T991628950U" + countnum; //이용기관번호 테스트배드 하나로 고정
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth()+1;
        var d = today.getDate();
        var h = today.getHours();
        var min = today.getMinutes();
        var s = today.getSeconds();

        if (m < 10) { m = "0" + m; } if (d < 10) { d = "0" + d; } if (h < 10) { h = "0" + h; }
        if (min < 10) { min = "0" + min; } if (s < 10) { s = "0" + s; }

        var tran_dtime = y+""+m+""+d+""+h+""+min+""+s;


        getConnection((conn) => {
            var sql = "SELECT * FROM user WHERE user_key = ?"
            conn.query(
            sql,
            [user_key],
            function(err, result) {
                if(err) {
                    console.error(err);
                    throw err;
                }
                else {
                    //console.log(result);

                    var option = {
                        method : "POST",
                        url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
                        headers : {
                            Authorization : 'Bearer ' + result[0].accessToken,
                            "Content-Type" : "application/json"
                        },
                        json : {
                        "bank_tran_id" : transId,
                        "cntr_account_type": "N",
                        //관리자 계좌
                        "cntr_account_num": "3521507517",
                        //사업체 name값
                        "dps_print_content": store_name,
                        "fintech_use_num": result[0].fin_usenum,
                        "tran_amt": tran_amt,
                        "tran_dtime": tran_dtime,
                        //사용자명
                        "req_client_name": result[0].name,
                        "req_client_fintech_use_num": result[0].fin_usenum,
                        "req_client_num": "HONGGILDONG1234",
                        "transfer_purpose": "TR",
                        "recv_client_name": "강지우",
                        "recv_client_bank_code": "097",
                        "recv_client_account_num": "3521507517"
                        }
                    }

                    request(option, function(err, response, body){
                        //console.log(option)
                        //console.log(body);
                        if(err){
                            console.error(err);
                            throw err;
                        }
                        else{
                            console.log(body)
                            //console.log(body.tran_amt)

                            res.json({
                                    'bank_name': body.bank_name,
                                    'account_num_masked': body.account_num_masked,
                                    'tran_amt': body.tran_amt,
                                    'wd_limit_remain_amt': body.wd_limit_remain_amt});
                                }
                    })
                }
            conn.release();
        });
    });
}

    //use gifticon
    else{
        var tran_amt = req.body.price;
        //사업자가 user
        var user_key = req.body.user_key;
        
        var countnum = Math.floor(Math.random() * 1000000000) + 1;
        var transId = "T991628950U" + countnum; //이용기관번호 테스트배드 하나로 고정
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth()+1;
        var d = today.getDate();
        var h = today.getHours();
        var min = today.getMinutes();
        var s = today.getSeconds();

        if (m < 10) { m = "0" + m; } if (d < 10) { d = "0" + d; } if (h < 10) { h = "0" + h; }
        if (min < 10) { min = "0" + min; } if (s < 10) { s = "0" + s; }

        var tran_dtime = y+""+m+""+d+""+h+""+min+""+s;


        getConnection((conn) => {
            var sql = "SELECT * FROM user WHERE user_key = ?"
            conn.query(
            sql,
            [user_key],
            function(err, result) {
                if(err) {
                    console.error(err);
                    throw err;
                }
                else {
                    console.log(result);

                    var option = {
                        method : "POST",
                        url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
                        headers : {
                            Authorization : 'Bearer ' + result[0].accessToken,
                            "Content-Type" : "application/json"
                        },
                        json : {
                        "bank_tran_id" : transId,
                        "cntr_account_type": "N",
                        //사업자(user) 계좌
                        "cntr_account_num": "3521507517",
                        "dps_print_content": "기프티콘 사용처리",
                        "fintech_use_num": result[0].fin_usenum,
                        "tran_amt": tran_amt,
                        "tran_dtime": tran_dtime,
                        //관리자
                        "req_client_name": "MYGIFTICON",
                        "req_client_fintech_use_num": result[0].fin_usenum,
                        "req_client_num": "HONGGILDONG1234",
                        "transfer_purpose": "TR",
                        "recv_client_name": "강지우",
                        "recv_client_bank_code": "097",
                        "recv_client_account_num": "3521507517"
                        }
                    }

                    request(option, function(err, response, body){
                        //console.log(option)
                        console.log(body);
                        if(err){
                            console.error(err);
                            throw err;
                        }
                        else {
                            if(body.rsp_code == 'A0000'){
                                
                                res.json(1);
                            }
                        }
                    })
                    
                }
            }
            );
            conn.release();
        });
    }

});
 
module.exports = router;

