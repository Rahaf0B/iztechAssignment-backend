import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config()
 const emailOptions = {
    from: 'admin@gmail.com',
    to: '',
    subject: '',
    text: ''
  };

   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDEREMAIL,
      pass: process.env.PASS
    },  tls: {
        rejectUnauthorized: false
    }
  });


  
  export default {
    emailOptions,
    transporter
  }