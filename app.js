var createError = require('http-errors');
const express = require('express');
var path = require('path');
const app = express();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
    host     : '192.168.40.193',
    user     : 'fintech',
    password : '1q2w3e4r!',
    database : 'fintech'
  });
   
connection.connect();


/* use router class */
const menu = require('./routes/menu');
const user = require('./routes/user');
const payment = require('./routes/payment');
const qrcode = require('./routes/qrcode');


app.use(express.static(path.join(__dirname, 'public')));//to use static asset

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());



app.get('/main', function(req, res){
    res.render('main');
})

app.get('/about', function(req, res){
    res.render('about');
})

/* /users 요청을 모두 /routes/index.js로 */
app.use('/menu', menu);
/* /users 요청을 모두 /routes/index.js로 */
app.use('/user', user);
/* /users 요청을 모두 /routes/index.js로 */
app.use('/payment', payment);
/* /users 요청을 모두 /routes/index.js로 */
app.use('/qrcode', qrcode);

app.listen(port, function(){
  console.log("server is running");
});

// 404 처리 미들웨어
app.use(function(req, res, next) {
    next(createError(404));
  });
   
  // 에러 핸들러
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
   
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
