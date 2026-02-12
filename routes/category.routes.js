const express = require('express')
const router = express.Router()
const authMiddleWare = require('../middlewares/auth.middleware.js')
const adminMiddleware = require('../middlewares/admin.middleware.js')

const {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
} = require('../controllers/category.controller.js')

router.post('/',authMiddleWare, adminMiddleware, createCategory)
router.put('/:id',authMiddleWare, adminMiddleware, updateCategory)
router.delete('/:id',authMiddleWare, adminMiddleware, deleteCategory)
router.get('/', getAllCategories)

module.exports = router