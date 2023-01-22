import nodemailer from 'nodemailer';
import template from './template.js';

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
        html: template.template.replace("[TEXT]", text)
      };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
  });

}