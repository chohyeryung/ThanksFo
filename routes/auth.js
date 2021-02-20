const express=require('express');
const router=express.Router();
const bodyParser = require('body-parser');
const db=require('../lib/db');
const app=express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/join', function(request, response){
    // response.sendFile(path.join(__dirname, 'views', 'join.html'));
    response.render('join.ejs');
});

router.post('/join_process', function(request, response){
    var name=request.body.name;
    var email=request.body.email;
    var password=request.body.password;
    db.query(`INSERT INTO user (nickname, email, password)
    VALUES (?,?,?)`, [name, email, password], function(error, result){
        if(error){
            throw error;
        }
        response.redirect('/');
    });
});

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
                    request.session.displayName=results[0].nickname;
                    request.session.save(()=>{
                        response.redirect('/home/'+results[0].nickname);
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