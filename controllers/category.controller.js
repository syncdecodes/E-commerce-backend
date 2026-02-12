/** @type {import('mongoose').Model<any>} */
const Category = require('../models/category.model.js')


const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body)
        res.status(201).json({ msg: 'Category created', category })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})

        if (!updatedCategory) {
            return res.status(404).json({ msg: 'Category not found' })
        }

        res.status(200).json({ msg: 'Category updated', updatedCategory })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params
    try {
        const deletedCategory = await Category.findByIdAndDelete(id)

        if (!deletedCategory) {
            return res.status(404).json({ msg: 'Category not found' })
        }

        res.status(200).json({ msg: 'Category deleted', deletedCategory })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.status(200).json({ msg: 'Categories fetched', categories })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


module.exports = { 
    createCategory,
     updateCategory,
     deleteCategory,
    getAllCategories
}