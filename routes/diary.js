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

router.get('/info', function(request, response) {
    response.render('info.ejs');
})
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

router.post('/getCalDates', function(request, response){
    var month = request.body.month;
    // const query = `SELECT DATE_FORMAT(created, '%c') FROM thdiary`;
    const query = `SELECT * FROM thdiary WHERE DATE_FORMAT(created, '%c') = ?`;
    db.query(query, [month], function(error, results){
        if(error) {
            throw error;
        }
        
        response.json({'datas' : results});
        // console.log(results);
    });
});

router.get('/getDiaryDates', function(request, response){
    const query = `SELECT DATE_FORMAT(created, '%Y-%m-%d') as date FROM thdiary WHERE user_id=? GROUP BY DATE_FORMAT(created, '%Y-%m-%d')`;
    let uid=request.session.user.idx;
    db.query(query, [uid], function(error, diarys){
        if (error) {
            throw error;
        }
        // response.render('show.ejs', {result : diarys});
        response.render('show_cal.ejs');
    });
});

router.get('/getDiaries', function(request, response){
    var queryData = url.parse(request.url, true).query;
    console.log(queryData);
    let date=request.query.hiddate;
    const query = `SELECT * FROM thdiary WHERE created LIKE '${date}%'`;
    db.query(query, function(error, detail_diary){
        if (error) {
            throw error;
        }
        response.render('show_detail.ejs', {result : detail_diary});
    });
})

router.post('/update', function(request, response){
    let idx=request.body.d_idx;
    const query = `SELECT * FROM thdiary WHERE idx = ?`;
    db.query(query, [idx], function(error, update_diary){
        if (error) {
            throw error;
        }
        response.render('diary_update.ejs', {result : update_diary});
    });
});

router.post('/update_process', function(request, response){
    let idx = request.body.d_idx;
    let d1 = request.body.d1;
    let d2 = request.body.d1;
    let d3 = request.body.d1;
    let created = new Date();
    let u_id = request.session.user.idx;
    let tome = request.body.tome;
    const query = `UPDATE thdiary SET description1=?, description2=?, description3=?, created=?, user_id=?, tome=? WHERE idx=?`;
    db.query(query, [d1, d2, d3, created, u_id, tome, idx], function(error, results){
        if(error) {
            throw error;
        }
        console.log('good');
        response.redirect('/home');
    });
});

router.post('/delete', function(request, response){
    let idx = request.body.d_idx;
    const query = `DELETE FROM thdiary WHERE idx = ?`;
    db.query(query, [idx], function(error, results){
        if(error) {
            throw error;
        }
        response.redirect('/getDiaryDates');
        // response.redirect('/home');
    });
});


module.exports = router;