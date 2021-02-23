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
       . 
    */
    // let cookies=request.cookies;
    let session=request.session;
    if (request.cookies.loginId) {
        session.save(()=>{
            //session.cookie=request.cookies.loginId;
            response.redirect('/home');
        });
        //console.log(response.cookie);
        //[Function (anonymous)]
    }else{
        response.render('index.ejs', {message:'안녕하세요.'});
    }
    // response.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// app.post('/', function(request, response){
//     if(request.body.remember){
//         response.cookie('remember', 1, {maxAge:minute});
//         response.redirect('');
//     }else{
        
//     }
// });

app.get('/home', function(request, response){
    let user = request.session.user;
    let name = user.nickname;
    
    response.render('home.ejs', {
         name : name 
    });
    //console.log(request.session);
});

app.listen(3000);