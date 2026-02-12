/** @type {import('mongoose').Model<any>} */
const Order = require('../models/order.model.js')

/** @type {import('mongoose').Model<any>} */
const Cart = require('../models/cart.model.js')

const mongoose = require('mongoose')

// user
const placeOrder = async (req, res) => {
    const user = req.user.id
    const { fullName, phone, addressLine, city, state, pincode } = req.body

    try {

        // Feilds validation
        if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
            return res.status(400).json({
                msg: 'All address fields are required'
            })
        }

        // Phone number validation
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                msg: 'Invalid phone number'
            })
        }

        // Pincode validation
        // if (!/^d{6}$/.test(pincode)) {
        //     return res.status(400).json({
        //         msg: 'Invalid pincode'
        //     })
        // }

        // fullName validation 
        if (fullName.length < 3) {
            return res.status(400).json({
                msg: 'Full name is too short'
            })
        }

        // addressLine validation
        if (addressLine.length < 5) {
            return res.status(400).json({
                msg: 'Address is too short'
            })
        }

        // find cart
        const cartDoc = await Cart.findOne({ user }).populate('items.product', '_id name description price images sizes')

        // cart not found
        if (!cartDoc) {
            return res.status(404).json({ msg: 'Cart not found' })
        }

        // empty cart
        if (cartDoc.items.length === 0) {
            return res.status(200).json({ msg: 'Cart is empty' })
        }

        const items = cartDoc.items.map((element) => {
            return {
                productId: element.product._id,
                productName: element.product.name,
                price: element.product.price,
                quantity: element.quantity,
                size: element.size,
                images: element.product.images
            }
        })

        const totals = items.reduce((acc, item) => {
            acc.totalAmount += item.price * item.quantity;
            acc.totalQuantity += item.quantity;
            return acc;
        }, {
            totalAmount: 0,
            totalQuantity: 0
        })

        const order = await Order.create({
            user,
            items,
            totalAmount: totals.totalAmount,
            totalQuantity: totals.totalQuantity,
            address: {
                fullName,
                phone,
                addressLine,
                city,
                state,
                pincode,
            },
            status: 'Pending'
        })

        await cartDoc.items.splice(0, cartDoc.items.length)
        await cartDoc.save()

        res.status(200).json({
            msg: 'Order placedd successfully',
            orderId: order._id,
            totalAmount: order.totalAmount,
            totalQuantity: order.totalQuantity
        })

    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// user
const getOrders = async (req, res) => {
    const user = req.user.id

    try {
        const order = await Order.find({ user }).sort({ createdAt: -1 })
        if (order.length === 0) {
            return res.status(200).json({
                msg: 'Order not found',
                order: []
            })
        }
        res.status(200).json({
            msg: 'Order fetched',
            order
        })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// user
const getSpecificOrder = async (req, res) => {
    const user = req.user.id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid MongoDB ID" })
    }

    try {
        const order = await Order.findOne({
            _id: id,
            user: user
        })

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' })
        }

        res.status(200).json({
            msg: 'Order fetched',
            order
        })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const cancelOrder = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid MongoDB ID" })
    }

    try {
        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' })
        }

        order.status = 'Cancelled'
        order.cancelledAt = new Date()
        await order.save()

        res.status(200).json({msg: 'Order cancelled', order})
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// admin
const updateOrderStatus = async (req, res) => {

    const { id } = req.params
    const { status } = req.body
    status.toLowerCase()
    const allowedStatus = ['pending', 'shipped', 'delivered', 'cancelled']

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Invalid MongoDB ID" })
    }

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status value' })
    }

    try {
        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' })
        }

        const currentStatus = order.status.toLowerCase()

        if (currentStatus === 'pending') {
            if (!['shipped', 'cancelled'].includes(status)) {
                return res.status(400).json({ msg: 'Invalid status transition' })
            }
        }

        if (currentStatus === 'shipped') {
            if (status !== 'delivered') {
                return res.status(400).json({ msg: 'Invalid status transition' })
            }
        }

        if (['delivered', 'cancelled'].includes(currentStatus)) {
            return res.status(400).json({ msg: 'Order status cannot be changed' })
        }

        const formatStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1)
        order.status = formatStatus(status)

        if (status === 'shipped') {
            order.shippedAt = new Date()
        }
        if (status === 'delivered') {
            order.deliveredAt = new Date()
        }
        if (status === 'cancelled') {
            order.cancelledAt = new Date()
        }

        await order.save()

        res.status(200).json({
            msg: 'Order status updated',
            orderId: order._id,
            oldStatus: currentStatus,
            newStatus: status

        })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


module.exports = {
    placeOrder,
    getOrders,
    getSpecificOrder,
    updateOrderStatus,
    cancelOrder
}