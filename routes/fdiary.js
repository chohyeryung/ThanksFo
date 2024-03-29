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

router.get('/create', function(request, response){
    response.render('fcreate.ejs', {name : request.session.user.nickname});
});

router.post('/insert_process', function(request, response){
    let uid = request.session.user.idx;
    let con = request.body.fdes
    let me = request.body.fme
    let date = request.body.fdate;
    let title = request.body.title;

    const query = `INSERT INTO fdiary(title, fdes, fme, fdate, user_id) VALUES(?, ?, ?, ?, ?)`;

    db.query(query, [title, con, me, date, uid], function(error, results){
        if (error) {
            throw error;
        }
        response.redirect('/home');
    });
    
});

module.exports = router;