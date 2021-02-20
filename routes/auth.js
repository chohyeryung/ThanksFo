const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../lib/db');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/join', function(request, response) {
    // response.sendFile(path.join(__dirname, 'views', 'join.html'));
    response.render('join.ejs');
});

/**
 * 회원가입 로직 완료
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

/**
 * 로그인 로직을 실행
 */
router.post('/login_process', function(request, response){
    var email=request.body.email;
    var password=request.body.password;
    db.query('SELECT * FROM user WHERE email = ?', [email],
    function( error, results, fields) {
        if (error) {
            response.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            if(results.length > 0) {    //그 이메일로 된 pw가 있다는 것
                if(results[0].password == password) {
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

router.get('/logout', function(request, response){
    delete request.session.displayName;
    request.session.save(()=>{
        response.redirect('/');
    });
});

module.exports=router;