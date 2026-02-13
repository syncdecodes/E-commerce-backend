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

const sendEmail = async ({to, subject, text}) => {
    const msg = {
        to, 
        from: process.env.EMAIL,
        subject,
        text
    }
    await sgMail.send(msg)
}

module.exports = sendEmail