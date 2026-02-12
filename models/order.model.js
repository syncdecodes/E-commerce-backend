const mongoose = require('mongoose')

const orderModel = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                productName: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                size: String,
                images: {
                    type: [String]
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },
        totalQuantity: {
            type: Number,
            required: true
        },

        address: {
            fullName: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            addressLine: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: Number,
                required: true
            }
        },

        status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
            //enum means: This field is allowed to have ONLY specific values
            default: 'Pending'
        },
        paymentMethod: {
            type: String,
            enum: ['COD'],
            default: 'COD'
        },
        shippedAt: Date,
        deliveredAt: Date,
        cancelledAt: Date
    },
    { timestamps: true }
)

const Order = mongoose.model('Order', orderModel)
module.exports = Order