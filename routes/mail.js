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