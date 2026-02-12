const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const transporter = require('../config/mail.config.js')

/** @type {import('mongoose').Model<any>} */
const OTP = require('../models/otp.model.js')
/** @type {import('mongoose').Model<any>} */
const User = require('../models/user.model.js')


function generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
}


const sendOtp = async (req, res) => {
    const { email, password } = req.body

    try {
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ msg: 'User already exist' })
        }

        const otp = generateOtp()
        const hashedPassword = await bcrypt.hash(password, 10)

        // delete old otp for this email
        await OTP.deleteMany({ email })

        // save otp in DataBase
        await OTP.create({
            email,
            password: hashedPassword,
            otp,
            type: 'register',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        })

        // send otp to email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP FOR REGISTERATION',
            text: `YOUR OTP IS ${otp}`
        })

        res.status(200).json({ msg: `OTP to ${email} sent successfully` })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
        console.log('send otp error')
    }
}


const verifyOtp = async (req, res) => {
    const { email, otp } = req.body

    try {
        const userExist = await User.findOne({ email })

        if (userExist) {
            return res.status(400).json({ msg: 'User already exist' })
        }

        const otpDoc = await OTP.findOne({ email, otp, type: 'register' })

        if (!otpDoc) {
            return res.status(404).json({ msg: 'Invalid otp' })
        }
        if (otpDoc.expiresAt < Date.now()) {
            return res.status(400).json({ msg: 'Otp expired' })
        }


        // create user first
        const user = await User.create({
            email: email,
            password: otpDoc.password
        })


        // Generate JWT after user exist
        const token = jwt.sign(
            { id: user._id },              // payload
            process.env.JWT_SECRET,      // secret key
            { expiresIn: '15d' }            // token expiry
        )

        // delete OTP doc after verification
        await OTP.deleteMany({ email })

        res.status(201).json({ msg: 'User verified and logged in successfully', token })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
        console.log('verify otp error')
    }
}

// admin only
const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findByIdAndDelete(id)

        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        res.status(200).json({ msg: `User ${user.email} deleted successfully` })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const userLogin = async (req, res) => {
    const { email, password } = req.body

    try {
        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' })
        }

        // create JWT Token - jwt.sign(payload, secret, options)
        const token = jwt.sign(
            { id: user._id },              // payload
            process.env.JWT_SECRET,      // secret key
            { expiresIn: '15d' }            // token expiry
        )

        // send token to frontend
        res.status(201).json({ msg: 'User logged in successfully', token })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
        console.log('user login error')
    }
}


const forgotPasswordSendOtp = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({ msg: 'User not found' })
        }

        const otp = generateOtp()

        await OTP.create({
            email,
            otp,
            type: 'forgot',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min
        })

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for Password Reset',
            text: `Your OTP for password reset is ${otp}`
        })

        res.status(200).json({ msg: 'OTP sent successfully to your email' })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const verifyForgotPasswordOtp = async (req, res) => {
    const { email, otp } = req.body

    try {
        const otpDoc = await OTP.findOne({
            email,
            otp,
            type: 'forgot'
        })

        if (!otpDoc) {
            return res.status(400).json({ msg: 'Inavlid OTP' })
        }

        if (otpDoc.expiresAt < Date.now()) {
            return res.status(400).json({ msg: 'OTP expired' })
        }

        res.status(200).json({ msg: 'OTP verified' })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    try {

        const otpDoc = await OTP.findOne({
            email,
            otp,
            type: 'forgot'
        })

        if (!otpDoc) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' })
        }

        if (otpDoc.expiresAt < Date.now()) {
            return res.status(400).json({ msg: "OTP expired" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        await OTP.deleteMany({ email, type: 'forgot' })

        res.status(200).json({ msg: 'Password reset successfully', user })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const getUser = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        res.status(200).json({ msg: 'User fetched successfully', user })

    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


module.exports = {
    sendOtp,
    verifyOtp,
    userLogin,
    deleteUser,
    forgotPasswordSendOtp,
    verifyForgotPasswordOtp,
    resetPassword,
    getUser
}
