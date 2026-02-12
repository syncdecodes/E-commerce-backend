const express = require('express')
const router = express.Router()

const {
    placeOrder,
    getOrders,
    getSpecificOrder,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/order.controller.js')

const authMiddleware = require('../middlewares/auth.middleware.js')
const adminMiddleware = require('../middlewares/admin.middleware.js')

router.post('/', authMiddleware, placeOrder)
router.get('/', authMiddleware, getOrders)
router.get('/:id', authMiddleware, getSpecificOrder)
router.put('/:id/status/admin', authMiddleware, adminMiddleware, updateOrderStatus)
router.post('/:id/cancel', authMiddleware, cancelOrder)

module.exports = router
