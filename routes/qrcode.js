var express = require('express');
var router = express.Router();
var getConnection = require('../lib/db');

// 기프티콘 DB에 추가 후 QR코드로 나타낼 값 리턴
router.post('/generate', function (req, res)  {
  var store_key = req.body.store_key;
  var owner = req.body.owner;
  var issued_date = new Date(); // 발행 시간은 서버의 현재 시간
  var expiry_date = new Date();
  expiry_date.setMonth(expiry_date.getMonth() + 1); // 기프티콘 유효기간은 1달
  var item_list = req.body.item_list  // 메뉴의 menu_key, count로 구성된 2차원 배열

  getConnection((conn) => {
    // 기프티콘 저장
    var sql = "INSERT INTO gifticon (store_key, owner, expiry_date, issued_date) VALUES (?,?,?,?)";
    conn.query(
      sql,
      [store_key, owner, expiry_date, issued_date],
      function(err, result) {
        if(err) {
          console.error(err);
        }
        else {
          var gifticon_key = result.insertId;
          
          item_list.forEach(item => {
            item['gifticon_key'] = gifticon_key;
          });
      
          sql = "INSERT INT item_list (gifticon_key, menu_key, count) values ?";
          // 해당 기프티콘에 해당되는 상품 목록 저장
          conn.query(
            sql,
            [item_list],
            function(err, result) {
              if(err) {
                console.error(err);
              }
            }
          );
        }
      }
    );

    conn.release();
  });

  // 생성된 기프티콘 키값 리턴
  return gifticon_key;
});



/* 
  여기부터는 사업자 라우트
*/


// 스캔 화면 리턴
router.get('/scan', function (req, res)  {
  res.render('scanner');
});

// DB를 조회해서 해당 QR코드 값이 존재하면, 구성 상품 목록 리턴
router.post('/scan', function (req, res)  {
  var qrcode = req.body.qrcode;

  var sql = "SELECT FROM gifticon WHERE gifticon_key = ?";
  conn.query(
    sql,
    [qrcode],
    function(err, result) {
      if(err) {
        console.error(err);
      }
      else {
        if(result.length === 0) {
          res.json({'status' : 0,
                    'msg' : '존재하지 않는 기프티콘 입니다.'});
          return;
        }
        
        // 서버 현재 시간을 기준으로 사용기한이 지난 경우
        var expiry_date = JSON.parse(JSON.stringify(result[0]))['expiry_date'];
        if(new Date(expiry_date) < new Date()) {
            res.json({'status' : 0,
                      'msg' : '사용 기한이 만료되었습니다.'});
        }
        // 이미 사용된 기프티콘
        else if(result[0]['used_date'] !== null) {
          res.json({'status' : 0,
                    'msg' : '이미 사용된 기프티콘 입니다.'});
        }
        // 기프티콘 구성 상품 목록 조회 후 리턴
        else {
          sql = "SELECT * FROM item_list, menu WHERE gifticon_key = ? and item_list.menu_key = menu.menu_key";
          conn.query(sql, [result[0]['gifticon_key']], function(err, result2) {
            if(err) {
              console.error(err);
            } else {
              var arr = []

              result2.forEach(item => {
                arr.push({'name' : item['name'], 'count' : item['count']});
              })

              res.json({'status' : 1,
                        'item_list' : arr});
            }
          })  // end of inner query
        }
      }
    } // end of callback of outer query
  ); // end of outer query
});

// 기프티콘 구성 상품 페이지 리턴
router.get('/itemlist', function(req, res) {
});


module.exports = router;