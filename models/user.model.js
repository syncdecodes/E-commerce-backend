const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    email: {
        type: String,
        required: true, unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},
    { timestamps: true }
)

const users = mongoose.model('User', userModel)
module.exports = users