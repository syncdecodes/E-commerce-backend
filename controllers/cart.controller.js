/** @type {import('mongoose').Model<any>} */
const Cart = require('../models/cart.model.js')

/** @type {import('mongoose').Model<any>} */
const Product = require('../models/product.model.js')


// create cart
const creatCart = async (req, res) => {
    const user = req.user.id
    const { productId, size, quantity } = req.body

    if (quantity < 1) {
        return res.status(400).json({ msg: 'quantity must be greater than equal to 1' })
    }

    try {

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' })
        }

        if (!product.sizes.includes(size)) {
            return res.status(400).json({ msg: 'Invalid size selected' })
        }

        const cartDoc = await Cart.findOne({ user })

        if (!cartDoc) {
            const cart = await Cart.create({
                user,
                items: [{ product: productId, size, quantity }]
            })
            return res.status(201).json({ msg: 'Cart created', cart })
        }

        if (cartDoc) {
            const productExist = cartDoc.items.find((element) => element.product.toString() === productId && element.size === size)

            if (productExist) {
                productExist.quantity = productExist.quantity + quantity
            }
            else {
                cartDoc.items.push({ product: productId, size, quantity })
            }
            await cartDoc.save()
            return res.status(200).json({ msg: 'Cart updated', cart: cartDoc })
        }
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// get cart
const getCart = async (req, res) => {
    const user = req.user.id
    try {

        const cart = await Cart.findOne({ user }).populate({
            path: 'items.product',
            select: 'name price images sizes description category color',
            populate: {
                path: 'category',
                select: 'name slug'
            }
        })

        if (!cart) {
            return res.status(200).json({
                msg: 'Cart is empty',
                cart: { items: [] }
            })
        }

        res.status(200).json({ msg: 'Cart fetched', cart })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// update cart
const updateCart = async (req, res) => {
    const user = req.user.id
    const { productId, size, quantity } = req.body

    try {
        // find cart
        const cartDoc = await Cart.findOne({ user })

        // if no cart found
        if (!cartDoc) {
            return res.status(404).json({ msg: 'Cart not found' })
        }

        // cart found
        if (cartDoc) {

            // find product in cart
            const productExist = await cartDoc.items.find((element) => element.product.toString() === productId && element.size === size)

            // product not found
            if (!productExist) {
                return res.status(200).json({ msg: 'Product does not exist cant update' })
            }

            // product found
            if (productExist) {

                // product quantity === 0
                if (quantity === 0) {
                    // remove one product
                    cartDoc.items = cartDoc.items.filter((element) => !(element.product.toString() === productId && element.size === size))
                    await cartDoc.save()
                    return res.status(200).json({ msg: `product with id ${productId} deleted because quantity = 0`, cart: cartDoc })
                }

                // product quantity > 0
                if (quantity > 0) {
                    productExist.quantity = quantity
                    await cartDoc.save()
                    return res.status(200).json({ msg: 'cart updated', cart: cartDoc })
                }

                // product quantity negative
                if (quantity < 0) {
                    return res.status(400).json({ msg: 'Quantity cant be negative' })
                }
            }
        }
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// clear cart
const clearCart = async (req, res) => {
    const user = req.user.id

    try {
        const cartDoc = await Cart.findOne({ user })
        if (!cartDoc) {
            return res.status(200).json({ msg: 'Cart already empty', cart: { items: [] } })
        }
        if (cartDoc) {
            cartDoc.items = []
            await cartDoc.save()
            return res.status(200).json({ msg: 'Cart cleared', cart: { items: [] } })
        }
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const removeSpecificItem = async (req, res) => {
    const { id } = req.params
    const { size } = req.body
    const user = req.user.id

    try {
        const cartDoc = await Cart.findOne({ user })

        if (!cartDoc || cartDoc.items.length === 0) {
            return res.status(200).json({ msg: 'Cart already empty', cart: { items: [] } })
        }

        if (cartDoc) {
            cartDoc.items = cartDoc.items.filter(item => {
                return !(item.product.toString() === id && item.size === size)
            })
            await cartDoc.save()
            return res.status(200).json({ msg: 'Item removed', cart: cartDoc })
        }
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// cart total
const cartTotal = async (req, res) => {
    const user = req.user.id

    try {
        const cartDoc = await Cart.findOne({ user }).populate('items.product', 'price')

        if (!cartDoc) {
            return res.status(200).json({
                msg: 'Cart is empty',
                totalPrice: 0,
                totalQuantity: 0
            })
        }

        if (cartDoc.items.length === 0) {
            return res.status(200).json({
                msg: 'Cart is empty',
                totalPrice: 0,
                totalQuantity: 0
            })
        }

        if (cartDoc) {

            const totalPrice = cartDoc.items.reduce((acc, item) => {
                return acc + item.product.price * item.quantity;
            }, 0)

            const totalQuantity = cartDoc.items.reduce((acc, item) => {
                return acc + item.quantity
            }, 0)

            return res.status(200).json({ totalPrice, totalQuantity })
        }

        res.status(200).json({ msg: 'Cart totals fetched', totalPrice: 0, totalQuantity: 0 })

    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


module.exports = {
    creatCart,
    getCart,
    updateCart,
    clearCart,
    removeSpecificItem,
    cartTotal
}