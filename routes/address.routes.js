const express = require('express')
const router = express.Router()

const {
    updateAddress,
    getAddress
} = require('../controllers/address.controller')

const authMiddleWare = require('../middlewares/auth.middleware.js')

router.put('/', authMiddleWare, updateAddress)
router.get('/', authMiddleWare, getAddress)

module.exports = router