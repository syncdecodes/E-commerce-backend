const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth.middleware')

const {
    creatCart,
    getCart,
    updateCart,
    clearCart,
    removeSpecificItem,
    cartTotal
} = require('../controllers/cart.controller')

router.post('/add', authMiddleware, creatCart)
router.get('/', authMiddleware, getCart)
router.put('/update', authMiddleware, updateCart)
router.delete('/clear', authMiddleware, clearCart)
router.delete('/remove/:id', authMiddleware, removeSpecificItem)
router.get('/total', authMiddleware, cartTotal)

module.exports = router