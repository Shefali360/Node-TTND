const nodemailer = require('nodemailer');
const dotenv=require('dotenv');
const fs=require('fs');

dotenv.config();

let transport = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    auth: {
       user:process.env.SMTP_USER,
       pass:process.env.SMTP_PASS
    }
});


const createEmailFromTemplate = (emailData) => {
	let template = fs.readFileSync([process.cwd(), 'Templates', 'email.html'].join('/'), { encoding: 'utf8' });

	template = template.replace('__HEADING__', emailData.heading);
	template = template.replace('__CONTENT__', emailData.content);
	template = template.replace('__SALUTATION__', emailData.salutation);
	template = template.replace('__FROM__', emailData.from);

	return template;
};

module.exports.sendMail=async(to,subject,emailData)=>{
    var mailOptions = {
        from: 'shefali.goyal@tothenew.com',
        to: to,
        subject:subject,
        html:createEmailFromTemplate(emailData)
      };

      return await transport.sendMail(mailOptions);
}

