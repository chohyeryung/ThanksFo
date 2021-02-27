const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);
const db = require('../lib/db');
//const User = require('../user/User');
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
    const query = `INSERT INTO user (nickname, email, password) VALUES (?,?,?)`;
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
    let userService = new User();
    let user = userService.getUserByEmail(email);
     db.query(`SELECT * FROM user WHERE email = ?`, [email], function( error, users, fields) {
         if (error) {
             response.send({
                 "code": 400,
                 "failed": "error ocurred"
             })
         }
        if(users.length > 0) {    //그 이메일로 된 pw가 있다는 것
            let user = users[0];
            if(user.password == password) {
                if(chk){
                    console.log('chk!');
                    // #. 1000ms = 1초
                    // #. 60 * 1초= 60초 = 1분
                    // #. 1분 * 60 = 60분 = 1시간
                    response.cookie('loginId', user.idx, {maxAge : 60*60*1000});
                    
                    request.session.user=user;
                    request.session.save(()=>{
                        //response.redirect('/home/'+results[0].nickname);
                        response.redirect('/home');
                    });
                }else{
                    console.log('no chk');
                    request.session.user=user;
                    request.session.save(()=>{
                        //response.redirect('/home/'+results[0].nickname);
                        response.redirect('/home');
                    });
                }
            }else{
                response.render('index.ejs', {message:'올바른 이메일 또는 비밀번호를 입력하세요.'});
            } 
        }else{
            response.render('index.ejs', {message:'올바른 이메일 또는 비밀번호를 입력하세요.'});
        } 
     });
});

/* 로그아웃 로직 (session 삭제) 
*/
router.get('/logout', function(request, response){
    sess = request.session;
    response.clearCookie('loginId');
    // if(sess.user.idx){
    request.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            response.redirect('/');
        }
    });
});

module.exports=router;