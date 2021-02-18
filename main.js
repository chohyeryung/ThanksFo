const express=require('express');
const app=express();
const path = require("path");

app.use(express.static('page'));

const db=require('./lib/db');

app.get('/', function(request, response){
    response.sendFile('index.html');
});

app.listen(3000);