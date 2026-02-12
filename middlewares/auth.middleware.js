const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {

    const authHeaders = req.headers.authorization

    if (!authHeaders || !authHeaders.startsWith('Bearer')) {
        return res.status(401).json({ msg: 'Unauthorized' })
    }

    const token = authHeaders.split(' ')[1]

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { id: decoded.id }
        next()

    }
    catch (error) {
        res.status(401).json({ msg: 'Invalid token' })
        console.log('authMiddleware error')
    }
}

module.exports = authMiddleware