/** @type {import('mongoose').Model<any>} */
const Product = require('../models/product.model.js')

/** @type {import('mongoose').Model<any>} */
const Category = require("../models/category.model")


const getProducts = async (req, res) => {

    try {
        const filter = {}

        // category filter
        if (req.query.category) {
            const categoryDoc = await Category.findOne({
                slug: req.query.category
            })

            if (categoryDoc) {
                filter.category = categoryDoc._id
            }
        }

        // price filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {}

            if (req.query.minPrice) {
                filter.price.$gte = Number(req.query.minPrice)
            }
            if (req.query.maxPrice) {
                filter.price.$lte = Number(req.query.maxPrice)
            }
        }


        // color filter
        if (req.query.color){
            filter.color = req.query.color
        }


        // sorting
        const sort = {}
        if (req.query.sort === 'price') {
            sort.price = 1 // Sort by price ascending (low → high)
        }
        if (req.query.sort === '-price') {
            sort.price = -1 // Sort by price descending (high → low)
        }
        if (req.query.sort === 'latest') {
            sort.createdAt = -1 // latest first
        }

        // limit 
        const limit = Number(req.query.limit) || 10
        const page = Number(req.query.page) || 1
        const skip = (page - 1) * limit

        const products = await Product.find(filter)
            .populate("category", "name slug") // .populate - Join Product table with Category table using categoryId // "category": feild name in product schema, "name slug": from the Category document only include "name" and "slug"
            .sort(sort) // Mongoose query method runs in mongoDB, takes an object - .sort({ price: 1 }) means price low to high and vice versa
            .skip(skip) // skip reffers to how many product to ignore from start
            .limit(limit) // limit refers to how many products per page 

        res.status(200).json({ msg: 'Products fetched', products })

    } catch (error) {
        res.status(500).json({ msg: error.message })
        console.log('error')
    }
}

const getSpecificProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id).populate('category', 'name slug')

        if (!product) {
            return res.status(400).json({ msg: 'Product not found' })
        }

        res.status(200).json({ msg: 'Product fetched', product })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({ msg: 'Product created', product })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

        if (!updatedProduct) {
            return res.status(400).json({ msg: 'Product not found' })
        }

        res.status(200).json({ msg: 'Product updated', updatedProduct })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const deletedProduct = await Product.findByIdAndDelete(id)

        if (!deletedProduct) {
            return res.status(400).json({ msg: 'Product not found' })
        }

        res.status(200).json({ msg: 'Product deleted', deletedProduct })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

module.exports = {
    getProducts,
    getSpecificProduct,
    createProduct,
    updateProduct,
    deleteProduct
}