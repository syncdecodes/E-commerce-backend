const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    // service: "gmail", 
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds
})

module.exports = transporter