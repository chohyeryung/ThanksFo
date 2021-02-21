const express=require('express');
const app=express();
const path = require("path");
const qs = require('querystring');
const bodyParser = require('body-parser');
const user=require('./lib/user');
const cookieParser = require('cookie-parser');
const db=require('./lib/db');
const ejs=require('ejs');
const authRouter=require('./routes/auth');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);

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

app.use('/auth', authRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/views'));
app.use(express.static('public'));

app.get('/', function(request, response){
    /*
        밑의 쿠키 코드를 추가하니(자동로그인을 위한)
        Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        이런 에러가 납니다.. 어떻게 해결하면 좋을까요?
    */
    // let cookies=request.cookies;
    // let session=request.session;
    // if (cookies && session) {
    //     response.redirect('/home');
    // }else{
    //     console.log(request.session);
        response.render('index.ejs', {message:'안녕하세요.'});
    // }
    // response.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/home', function(request, response){
    let user = request.session["user"];
    let name = user.nickname;
    console.log(request.session);
    response.render('home.ejs', {
         name : name 
    });
})

app.listen(3000);