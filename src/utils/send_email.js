const nodemailer = require('nodemailer');
const secretVariable = require('../constant/secretVariable');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: secretVariable.emailServer,
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: secretVariable.emailServerUsername,
    pass: secretVariable.emailServerPassword
  }
});

// verify connection configuration
// transporter.verify(function (error, success) {
//   if (error != null) {
//     console.log(error);
//   } else {
//     console.log('Server is ready to take our messages');
//   }
// });

// send email
const sendEmailToUser = async ({ email, subject, otp }) => {
  try {
    await transporter.sendMail({
      from: secretVariable.emailServerUsername, // sender address
      to: email, // list of receivers
      subject, // Subject line
      text: 'Hello world?', // plain text body
      html: `<b>Hello world? ${otp}</b>` // html body
    });
  } catch (error) {
    logger.error(error);
  }
};

module.exports = sendEmailToUser;
