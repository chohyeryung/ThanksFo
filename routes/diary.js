const express=require('express');
const router=express.Router();
const app=express();
const bodyParser = require('body-parser');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);
var qs = require('querystring');
const cookieParser = require('cookie-parser');
const db = require('../lib/db');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static('../public'));
app.use(cookieParser());

router.get('/create', function(request, response){
    response.render('create.ejs', {name : request.session.user.nickname});
});

router.get('/info', function(request, response){
    response.render('info.ejs');
});

router.post('/create_process', function(request, response){
    const query="INSERT INTO thdiary (description1, description2, description3, created, user_id) VALUES (?, ?, ?, NOW(), ?)";
    let des1=request.body.d1;
    let des2=request.body.d2;
    let des3=request.body.d3;
    let uid=request.session.user.idx;
    db.query(query, [des1, des2, des3, uid], function(error, results){
        if (error) {
            throw error;
        }
        response.redirect('/home');
    });
});

module.exports=router;