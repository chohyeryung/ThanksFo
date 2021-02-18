const express=require('express');
const app=express();
const path = require("path");

app.use(express.static(path.join(__dirname, 'page')));

const db=require('./lib/db');

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, 'page', 'index.html'));
});

app.get('/join', function(request, response){
    response.sendFile(path.join(__dirname, 'page', 'join.html'));
})

app.listen(3000);