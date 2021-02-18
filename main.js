const express=require('express');
const app=express();
const path = require("path");
const qs = require('querystring');
const bodyParser = require('body-parser');
const user=require('./lib/user');
const db=require('./lib/db');
const ejs=require('ejs');

app.use(bodyParser.urlencoded({ extended: false }))
// app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.get('/', function(request, response){
    // response.render('index.ejs');
    response.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/join', function(request, response){
    response.sendFile(path.join(__dirname, 'views', 'join.html'));
});

app.post('/join_process', function(request, response){
    let name=request.body.name;
    let email=request.body.email;
    let password=request.body.password;
    db.query(`INSERT INTO user (nickname, email, password)
    VALUES (?,?,?)`, [name, email, password], function(error, result){
        if(error){
            throw error;
        }
        response.redirect('/');
    });
});

app.post('/login_process', function(request, response){
    user.login(request, response);
});

app.listen(3000);