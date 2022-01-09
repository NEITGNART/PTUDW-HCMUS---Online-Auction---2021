import config from './config.js';
import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
})