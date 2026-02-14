// const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//     // service: "gmail", 
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//     },
//     connectionTimeout: 10000, // 10 seconds
// })

// module.exports = transporter


const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async ({ to, subject, text }) => {
    try {
        const msg = {
            to,
            from: process.env.EMAIL,
            subject,
            text
        }
        const res = await sgMail.send(msg)
        console.log('Sendgrid response', res[0].statusCode)
        console.log("Message ID:", res[0].headers['x-message-id'])
    } catch (error) {
        console.log('Sendgrid error:', error.response?.body || error.message)
    }

}

module.exports = sendEmail