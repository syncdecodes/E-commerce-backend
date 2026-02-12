const mongoose = require('mongoose')

const otpModel = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String },
    otp: { type: String, required: true },
    type: {
        type: String,
        enum: ['register', 'forgot'],
        required: true
    },
    expiresAt: { type: Date, required: true }
})

// Automatically deletes expired OTPs
otpModel.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const otps = mongoose.model('OTP', otpModel)
module.exports = otps