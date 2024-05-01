const messageModel = require('#models/messageModel');
const userModel = require('#models/userModel');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const Log = require('#log');
require('dotenv').config();

module.exports = {
    async sendForgotMail(user, code) {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user: process.env.GOOGLE_MAIL,
                pass: process.env.GOOGLE_APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        const message = {
            from: `RestScreen <${process.env.GOOGLE_MAIL}>`,
            to: user.email,
            subject:'Forgot password',
            html: await ejs.renderFile('./domain/utils/ejs/forgotPasswordMail.ejs', {
                user,
                code,
                domain: process.env.FRONT_END_DOMAIN
            }),
        };

        await transporter.sendMail(message, (err, res)=>{
            if(err){
                Log.error(`[MailController] ${err.message}`);
            }
            transporter.close();
        });
    }
}