const express=require('express');
const router=express.Router();
const app=express();
const bodyParser = require('body-parser');
const session=require('express-session');
const nodemailer = require('nodemailer');
const MySQLStore=require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const db = require('../lib/db');
const smtpTransport = require('nodemailer-smtp-transport');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static('../public'));
app.use(cookieParser());

router.get('/create', function(request, response){
    response.render('fcreate.ejs', {name : request.session.user.nickname});
});

router.post('/insert_process', function(request, response){
    let con = request.body.fdes
    let me = request.body.fme
    let date = request.body.fdate;
    let title = request.body.title;
    var mtext = `
        <h3>미래의 나에게</h3><br>
        ${con}<p>
        <h3>미래에 나는 어떤 사람일까 ? </h3><br>
        ${me}<p>
    `;

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'chohyeryungcho@gmail.com',
          pass: '0308whgPfud!1025@'
        }
      }));
       
      var mailOptions = {
        from: 'chohyeryungcho@gmail.com',
        to: request.session.user.email,
        subject: title,
        html: mtext
      };
       
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });  
    
});

module.exports = router;