import config from './config.js';
import nodemailer from 'nodemailer';



// let mailOptions = {
//     from: config.EMAIL_USER,
//     to: 'zzmanhtienzz@gmail.com ',
//     subject: 'hello Tien',
//     text: 'Hello Tien'
// }


// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });




export default nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
})