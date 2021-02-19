"use strict";

const express=require('express');
const app=express();
const qs = require('querystring');
const bodyParser = require('body-parser');
const db=require('./lib/db');
const ejs=require('ejs');
const session=require('express-session');

app.set('view engine', 'ejs');

const home=require("./routes/home");
app.use("/", home);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/views'));
app.use(express.static('public'));

app.listen(3000);