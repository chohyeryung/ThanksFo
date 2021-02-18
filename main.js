const express=require('express');
const app=express();
const path = require("path");
const qs = require('querystring');
const bodyParser = require('body-parser');
const user=require('./lib/user');
const db=require('./lib/db');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'page')));

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, 'page', 'index.html'));
});

app.get('/join', function(request, response){
    response.sendFile(path.join(__dirname, 'page', 'join.html'));
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