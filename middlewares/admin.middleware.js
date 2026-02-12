/** @type {import('mongoose').Model<any>} */
const User = require('../models/user.model')

const adminMiddleware = async (req, res, next) => {
    const id = req.user.id

    try {
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admin only' })
        }
        next()
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

module.exports = adminMiddleware