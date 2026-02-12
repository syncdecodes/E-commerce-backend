const mongoose = require('mongoose')

const passwordResetOTPModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: { 
        type: Date, 
        required: true 
    }
})

const PasswordResetOTP = mongoose.model('PasswordResetOTP', passwordResetOTPModel)
module.exports = PasswordResetOTP