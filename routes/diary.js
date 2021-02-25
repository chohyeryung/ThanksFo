const express=require('express');
const router=express.Router();
const app=express();
const bodyParser = require('body-parser');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const db = require('../lib/db');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static('../public'));
app.use(cookieParser());

router.get('/insert', function(request, response){
    response.render('create.ejs', {name : request.session.user.nickname});
});

router.get('/info', function(request, response){
    response.render('info.ejs');
});

router.post('/insert_process', function(request, response){
    const query=`INSERT INTO thdiary (description1, description2, description3, created, user_id, tome) VALUES (?, ?, ?, ?, ?, ?)`;
    let des1=request.body.d1;
    let des2=request.body.d2;
    let des3=request.body.d3;
    let created=new Date();
    let uid=request.session.user.idx;
    let tome=request.body.tome;
    db.query(query, [des1, des2, des3, created, uid, tome], function(error, results){
        if (error) {
            throw error;
        }
        response.redirect('/home');
    });
});

router.get('/getDiaries', function(request, response){
    const query1 = `SELECT DATE_FORMAT(created, '%Y-%m-%d') as date FROM thdiary WHERE user_id=? GROUP BY DATE_FORMAT(created, '%Y-%m-%d')`;
    let uid=request.session.user.idx;
    db.query(query1, [uid], function(error, diarys){
        if (error) {
            throw error;
        }
        // db.query(query2, function(error2, diary){
        //     if (error2) {
        //         throw error;
        //     }
        // console.log(diarys);
            response.render('show.ejs', {result : diarys});
        // });
    });
});

router.post('/getDiaries_detail', function(request, response){
    const query = `SELECT * FROM thdiary`;
    db.query(query, function(error, detail_diary){
        if (error) {
            throw error;
        }
        response.render('show_detail.ejs', {result : detail_diary});
    });
})

module.exports=router;