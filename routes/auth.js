const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);
const db = require('../lib/db');
const app = express();

app.use(session({
    key:"sid",
    secret:'Secret',
    resave:false,
    saveUninitialized:true,
    store:new MySQLStore({
        host:'localhost',
        port:3306,
        user:'root',
        password:'111111',
        database:'diary'
    })
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }))

/* 회원가입 페이지로 이동 (join.ejs) */
router.get('/join', function(request, response) {
    // response.sendFile(path.join(__dirname, 'views', 'join.html'));
    response.render('join.ejs');
});

/**
 * 회원가입 로직
 * 
 */
router.post('/join_process', function(request, response) {
    const query = "INSERT INTO user (nickname, email, password) VALUES (?,?,?)";
    var name=request.body.name;
    var email=request.body.email;
    var password=request.body.password;
    db.query(query, [name, email, password], function(error, result) {
        if (error) {
            throw error;
        }
        response.redirect('/');
    });
});

// router.get('/login_process', function(request, response){
//     if(request.session.logined==true){
//         response.redirect('/home');
//     }else{
//         response.render('index.ejs', {message:'안녕하세요.'});
//     }
// });

/**
 * 로그인 로직을 실행
 */
router.post('/login_process', function(request, response){
    var email=request.body.email;
    var password=request.body.password;
    var chk=request.body.chk;
    /*
        쿠키 있는지 없는지
    */
    db.query('SELECT * FROM user WHERE email = ?', [email],
    function( error, results, fields) {
        if (error) {
            response.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } 
        // # 이렇게 session, cookie 저장하는게 맞는건가요.??
        // # 그 다음에 main.js에서 app.get('/') 부분에서 쿠키가 있으면..? 자동 로그인 되게 해야하나요
        else if(chk){
            if(results.length > 0) {    //그 이메일로 된 pw가 있다는 것
                if(results[0].password == password) {
                    // request.session.logined=true;
                    response.cookie('user', results[0], {maxAge:10000});
                    request.session.user=results[0];
                    request.session.save(()=>{
                        //response.redirect('/home/'+results[0].nickname);
                        response.redirect('/home');
                    });
                }else {
                    response.render('index.ejs', {message:'올바른 이메일 또는 비밀번호를 입력하세요.'});
                }
            } else {
                response.render('index.ejs', {message:'올바른 이메일 또는 비밀번호를 입력하세요.'});
            }
        }else{
            if(results.length > 0) {    //그 이메일로 된 pw가 있다는 것
                if(results[0].password == password) {
                    response.cookie('user', results[0], {maxAge:10000});
                    request.session.user=results[0];
                    request.session.save(()=>{
                        //response.redirect('/home/'+results[0].nickname);
                        response.redirect('/home');
                    });
                }else {
                    response.render('index.ejs', {message:'올바른 이메일 또는 비밀번호를 입력하세요.'});
                }
            } else {
                response.render('index.ejs', {message:'올바른 이메일 또는 비밀번호를 입력하세요.'});
            }
        }    
    });
});

/* 로그아웃 로직 (session 삭제) 
*/
router.get('/logout', function(request, response){
    sess = request.session;
    if(sess.user.idx){
        request.session.destroy(function(err){
            if(err){
                console.log(err);
            }else{
                response.redirect('/');
            }
        })
    }else{
        response.redirect('/');
    }
    // request.session.destroy(function(err){
    //     // cannot access session here
    // });
    // // response.clearCookie('sid'); //쿠키 삭제 기능 구현 해야함..
    // response.redirect('/');
});

module.exports=router;