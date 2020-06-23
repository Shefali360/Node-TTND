const nodemailer = require('nodemailer');
let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: '0563dee18a9c71',
       pass: '0ee06d3a5af560'
    }
});

module.exports.sendMail=(to,subject,text,html)=>{
    var mailOptions = {
        from: 'shefali.goyal@tothenew.com',
        to: to,
        subject:subject,
        text:text,
        html:html
      };
      
      transport.sendMail(mailOptions,function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

