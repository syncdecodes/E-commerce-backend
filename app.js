require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()


// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// routes
const productRoutes = require('./routes/product.routes.js')
const categoryRoutes = require('./routes/category.routes.js')
const authRoutes = require('./routes/auth.routes.js')
const cartRoutes = require('./routes/cart.routes.js')
const orderRoutes = require('./routes/order.routes.js')
const addressRoutes = require('./routes/address.routes.js')


app.use('/api/product', productRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/address', addressRoutes)


app.get('/', (req, res) => {
res.status(200).json({msg: "Server is listening.."})
})


// connect db
const connectDB = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGO_URL)
        console.log('connected to database')

        app.listen(process.env.PORT, () => {
            console.log(`server is listening or port ${process.env.PORT}`)
        })
    }
    catch (err) {
        console.log('Database connection failed', err)
        process.exit(1)
    }
}
connectDB()