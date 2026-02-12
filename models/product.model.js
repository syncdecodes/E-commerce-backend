const mongoose = require('mongoose')

const productModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        images: {
            type: [String]
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        color: {
            type: String
        },
        sizes: {
            type: [String],
            enum: ["28", "30", "32", "34", "36", "38"]
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

const Product = mongoose.model('Product', productModel)
module.exports = Product

/* 
category part
user enters the category id 
ref tells mongoose that the ObjectId comes from Category collection 
which allows us to use .populate() later 
.populate() => MongoDB automatically replaces the ID with the full category object/model
*/ 