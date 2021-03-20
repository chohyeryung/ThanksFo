const schedule = require('node-schedule');
const db = require('../lib/db');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');

var job = schedule.scheduleJob('15 * * * * *', function(){
    
    let now = new Date();
    const query = `SELECT * FROM fdiary WHERE DATE_FORMAT(fdate, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')`;
   
    db.query(query, [now], function(error, results){
        if(error) {
            throw error;
        }
         console.log(results);
        if(results.length>0) {
            let title = results.title;
            let con = results.fdes;
            let me = results.fme;
            let mtext = `
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
        }
    }); 
});

module.exports = job;