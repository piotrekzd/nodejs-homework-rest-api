const sgMail = require('@sendgrid/mail')
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = ({ email, from = 'piotrek.zdebski@gmail.com', token }) => {
    return {
        to: { email },
        from,
        subject: 'Verification link',
        text: 'Click on the link to verify your email address   ',
        html: `<strong>Click:<a href="${`http://localhost:3000/api/users/verify/${token}`}">here</a>to confirm your email address</strong>`,
    }
};

const sendVerificationLink = async (email, token) => {
    await sgMail
        .send(msg(email, token))
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error)
        });
};

module.exports = { sendVerificationLink };