const express=require('express');
const app=express();
const path = require("path");
const qs = require('querystring');
const bodyParser = require('body-parser');
const user=require('./lib/user');
const db=require('./lib/db');
const ejs=require('ejs');
const authRouter=require('./routes/auth');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);

app.use(session({
    secret:'Secret',
    resave:false,
    saveUninitialized:true,
    store:new MySQLStore({
        host:'localhost',
        port:3306,
        user:'root',
        password:'111111',
        database:'opentutorials'
    })
}));

app.use('/auth', authRouter);

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static('public'));

app.get('/', function(request, response){
    response.render('index.ejs', {message:'안녕하세요.'});
    // response.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/home/:name', function(request, response){
    let name=request.params.name;
    response.render('home.ejs', {name:name});
})

app.listen(3000);