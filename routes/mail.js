const schedule = require('node-schedule');
const db = require('../lib/db');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

var job = schedule.scheduleJob('15 * * * * *', function(){
    console.log('job 실행');
    let now = new Date();
    const query = `SELECT * FROM fdiary WHERE fdate = ?`;

    db.query(query, [now], function(error, results){
        if(error) {
            throw error;
        }
        if(results.length>0) {
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