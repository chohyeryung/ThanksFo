const express=require('express');
const app=express();
const path = require("path");
const qs = require('querystring');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'page')));

const db=require('./lib/db');

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
    let email=request.body.email;
    let password=request.body.password;
    db.query('SELECT * FROM user WHERE email = ?', [email],
    function( error, results, fields) {
        if (error) {
            response.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log(results);
            if(results.length > 0) {    //그 이메일로 된 pw가 있다는 것
                if(results[0].password == password) {
                    response.send({
                        "code": 200,
                        "success": "login sucessfull"
                    });
                } else {
                    response.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }
            } else {
                response.send({
                    "code":204,
                    "success": "Email does not exists"
                });
            }
        }    
    });
});

app.listen(3000);