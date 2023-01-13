import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'helpbeeapp@gmail.com',
      pass: 'kqczgjapewfaefpg'
    }
  });
  


export default function  sendEmail(to, subject, text){

    var mailOptions = {
        from: 'notification@helpbee.com',
        to: to,
        subject: subject,
        html: text
      };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}