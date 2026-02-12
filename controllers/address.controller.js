/** @type {import('mongoose').Model<any>} */
const Address = require('../models/address.model.js')


const updateAddress = async (req, res) => {
    const userId = req.user.id
    const { fullName, phone, addressLine, city, state, pincode } = req.body

    try {
        const existingAddress = await Address.findOne({ user: userId })

        if (existingAddress) {
            // update
            existingAddress.fullName = fullName
            existingAddress.phone = phone
            existingAddress.addressLine = addressLine
            existingAddress.city = city
            existingAddress.state = state
            existingAddress.pincode = pincode

            await existingAddress.save()

            return res.status(200).json({
                msg: "Address updated",
                address: existingAddress
            })
        }

        // create new
        const address = await Address.create({
            user: userId,
            fullName,
            phone,
            addressLine,
            city,
            state,
            pincode

        })

        res.status(201).json({
            msg: "Address saved",
            address
        })

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const getAddress = async (req, res) => {
    const user = req.user.id
    try {
        const address = await Address.findOne({user})

        if (!address) {
            return res.status(404).json({ msg: 'address not found', address })
        }

        res.status(200).json({ msg: 'address fetched', address })
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


module.exports = {
    updateAddress,
    getAddress
}