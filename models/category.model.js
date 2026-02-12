const mongoose = require('mongoose')

const categoryModel = mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

const Category = mongoose.model('Category', categoryModel)
module.exports = Category

/* 
name → Men / Women / Slim Fit
slug → men / women / slim-fit (used in URLs)
isActive → hide category without deleting

categories
├── men
├── women
├── slim-fit
├── straight-fit


products
├── product1 → category: men
├── product2 → category: slim-fit

*/
