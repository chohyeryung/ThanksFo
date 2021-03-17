const express=require('express');
const router=express.Router();
const app=express();
const bodyParser = require('body-parser');
const session=require('express-session');
const nodemailer = require('nodemailer');
const MySQLStore=require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const db = require('../lib/db');

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

    // 메일발송 객체
    const mailSender = {
        // 메일발송 함수
        sendGmail : function(){
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                prot : 587,
                host :'smtp.gmlail.com',
                secure : false,
                requireTLS : true,
                auth: {
                    user: "chohyeryungcho@gmail.com",
                    pass: "@chojiayou111"
                }
            });
            // 메일 옵션
            var mailOptions = {
                from: "chohyeryungcho@gmail.com",
                to: request.session.user.email, // 수신할 이메일
                subject: title, // 메일 제목
                text: mtext // 메일 내용
            };
            // 메일 발송    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            
        }
    }
    // 메일객체 exports
    module.exports = mailSender;
    // const mailSender = {
    //     // 메일발송 함수
    //     sendGmail: function() {
    //       var transporter = nodemailer.createTransport({
    //         service: "gmail",
    //         prot: 587,
    //         host: "smtp.gmail.com",
    //         secure: false,
    //         requireTLS: true,
    //         auth: {
    //           user: "chohyeryungcho@gmail.com",
    //           pass: "@chojiayou111"
    //         }
    //       });
    //       // 메일 옵션
    //       var mailOptions = {
    //         from: "chohyeryungcho@gmail.com",
    //         to: request.session.user.email, // 수신할 이메일
    //         subject: title, // 메일 제목
    //         text: mtext // 메일 내용
    //       };
    //       // 메일 발송
    //       transporter.sendMail(mailOptions, function(error, info) {
    //         if (error) {
    //           console.log(error);
    //         } else {
    //           console.log("Email sent: " + info.response);
    //         }
    //       });
    //     }
    //   };
      
    //   // 보내는 사람은 같아도 받을ID는 하나가 아니므로 따로 빼주었다.
    //   var emailParam = {
    //     toEmail: request.session.user.email,
    //     subject: title,
    //     text: mtext
    //   };

    //   var j = schedule.scheduleJob("5 * * * * *", function() {
    //     mailSender.sendGmail(emailParam);
    //   });
    const main = async () => {
        let transporter = nodemailer.createTransport({
            service : 'gmail',
            port: 587,
            host: 'smtp.gmail.com',
            secure : false,
            auth : {
                user: "s2019w38@e-mirim.hs.kr",
                pass: "@chojiayou111"
            }
        });

        let info = await transporter.sendMail({
            from: "s2019w38@e-mirim.hs.kr",
            to: request.session.user.email,
            subject : title,
            text: mtext,
            html:mtext
        });
            
        // console.log('Message sent: %s', info.messageId);
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }   

    main().catch(console.error);
    
});

module.exports = router;