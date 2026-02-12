const express = require('express')
const router = express.Router()
const authMiddleWare = require('../middlewares/auth.middleware.js')
const adminMiddleware = require('../middlewares//admin.middleware.js')

const {
    sendOtp,
    verifyOtp,
    userLogin,
    deleteUser,
    forgotPasswordSendOtp,
    verifyForgotPasswordOtp,
    resetPassword,
    getUser
} = require('../controllers/auth.controller.js')

router.post('/sendotp', sendOtp)
router.post('/verifyotp', verifyOtp)
router.post('/login', userLogin)
router.post('/forgot-password', forgotPasswordSendOtp)
router.post('/forgot-password/verify', verifyForgotPasswordOtp)
router.post('/forgot-password/reset', resetPassword)
router.delete('/admin/user/:id', authMiddleWare, adminMiddleware, deleteUser)

router.get('/user', authMiddleWare, getUser)

module.exports = router