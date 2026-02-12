const express = require('express')
const router = express.Router()
const authMiddleWare = require('../middlewares/auth.middleware.js')
const adminMiddleware = require('../middlewares/admin.middleware.js')

const {
    getProducts,
    getSpecificProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller.js')

router.get('/', getProducts)
router.get('/:id', getSpecificProduct)

router.post('/', authMiddleWare, adminMiddleware, createProduct)
router.put('/:id', authMiddleWare, adminMiddleware, updateProduct)
router.delete('/:id', authMiddleWare, adminMiddleware, deleteProduct)

module.exports = router