const schedule = require('node-schedule');
const db = require('../lib/db');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const session=require('express-session');
const MySQLStore=require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');

// 0 0 0 * * *  자정
var job = schedule.scheduleJob('15 * * * * *', function(){
    
    let now = new Date();

    const query = `SELECT * FROM fdiary INNER JOIN user ON fdiary.user_id = user.idx
    WHERE DATE_FORMAT(fdiary.fdate, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')`;
    db.query(query, [now], function(error, results){
        if(error) {
            throw error;
        }
        console.log(results);
        if(results>0){
            // for(var i=0; i<results.length; i++){
            //     let email = results[i].email;
            //     let title = results[i].title;
            //     let con = results[i].fdes;
            //     let me = results[i].fme;
            //     let mtext = `
            //         <h3>미래의 나에게</h3><br>
            //         ${con}<p>
            //         <h3>미래에 나는 어떤 사람일까 ? </h3><br>
            //         ${me}<p>
            //     `;
        
            //     var transporter = nodemailer.createTransport(smtpTransport({
            //         service: 'gmail',
            //         host: 'smtp.gmail.com',
            //         auth: {
            //             user: 'chohyeryungcho@gmail.com',
            //             pass: '0308whgPfud!1025@'
            //         }
            //     }));
                
            //     var mailOptions = {
            //         from: 'chohyeryungcho@gmail.com',
            //         to: email,
            //         subject: title,
            //         html: mtext
            //     };
                
            //     transporter.sendMail(mailOptions, function(error, info){
            //         if (error) {
            //             console.log(error);
            //         } else {
            //             console.log('Email sent: ' + info.response);
            //         }
            //     });
            // }
        }
    }); 
});

module.exports = job;