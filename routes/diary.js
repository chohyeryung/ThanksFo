const express=require('express');
const router=express.Router();
const app=express();
const bodyParser = require('body-parser');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

router.get('/create', function(request, response){
    response.render('create.ejs', {name : request.session.user.nickname});
});

router.get('/info', function(request, response){
    response.render('info.ejs');
});

module.exports=router;