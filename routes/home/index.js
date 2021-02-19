"use strict";

const express=require('express');
const router=express.Router();
const path = require("path");
const user=require('./user');

router.use(express.static(__dirname + '/views'));

router.get('/', function(request, response){
    response.render('index.ejs');
    // response.sendFile(path.join(__dirname, 'views', 'index.html'));
});

router.get('/join', function(request, response){
    response.render('join.ejs');
});

router.post('/join_process', function(request, response){
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

router.post('/login_process', function(request, response){
    user.login(request, response);
});

router.get('/home/:name', function(request, response){
    var name=request.params.name;
    response.render('home.ejs', {name:name});
});

module.exports=router;