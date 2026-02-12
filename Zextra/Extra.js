// const array = [{name: "dev"}, {age: 17}]
// const spreadedArray = [...array]

// console.log(spreadedArray === array) // false - different arrays
// console.log(spreadedArray[0] === array[0]) // true same object reference


// // Case 1️⃣ Changing the array itself

// spreadedArray.push({ city: "NY" })

// console.log(array) // [ { name: "dev" }, { age: 17 } ]
// console.log(spreadedArray) // [ { name: "dev" }, { age: 17 }, { city: "NY" } ]
// // ✅ Arrays are independent


// // Case 2️⃣ Changing an object inside

// spreadedArray[0].name = "developer"

// console.log(array) // [ { name: "developer" }, { age: 17 } ]
// // ❗ Both arrays changed because they share the same object reference



// const deepCopy = JSON.parse(JSON.stringify(array)) // deepcopy for full independence
// const deepCopy2 = array.map(obj => ({ ...obj }))













// const obj = {
//     msg: "Products fetched",
//     products: [
//         {
//             _id: "696464a8a4a8668f1223fb7c",
//             name: "straight fit jeans",
//             description: "good quality dvl men jeans",
//             price: 799,
//             image: [],
//             category: {
//                 _id: "6963968f5ff92676be1c51ff",
//                 name: "Men",
//                 slug: "men"
//             },
//             stock: 0,
//             isActive: true,
//             createdAt: "2026-01-12T03:04:08.100Z",
//             updatedAt: "2026-01-12T03:04:08.100Z",
//             __v: 0
//         }
//     ]
// }

// const req = obj.products[0].category.slug
// console.log(req)

















// const getProducts = async (req, res) => {
//   try {
//     const filter = { isActive: true }

//     // category filter
//     if (req.query.category) {
//       filter.category = req.query.category
//     }

//     // price filter
//     if (req.query.minPrice || req.query.maxPrice) {
//       filter.price = {}
//       if (req.query.minPrice) {
//         filter.price.$gte = Number(req.query.minPrice)
//       }
//       if (req.query.maxPrice) {
//         filter.price.$lte = Number(req.query.maxPrice)
//       }
//     }

//     // sorting
//     let sort = {}
//     if (req.query.sort === "price") sort.price = 1
//     if (req.query.sort === "-price") sort.price = -1
//     if (req.query.sort === "latest") sort.createdAt = -1

//     // pagination
//     const page = Number(req.query.page) || 1
//     const limit = Number(req.query.limit) || 10
//     const skip = (page - 1) * limit

//     const products = await Product.find(filter)
//       .populate("category", "name slug")
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)

//     const totalProducts = await Product.countDocuments(filter)

//     res.status(200).json({
//       msg: "Products fetched",
//       totalProducts,
//       page,
//       limit,
//       products
//     })
//   } catch (error) {
//     res.status(500).json({ msg: error.message })
//   }
// }







// filter = {}

// filter.name = "dev"
// console.log(filter)















// const obj = {
//     authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjUxNmY2MTAyYWZmZThmZWNlZGY1MCIsImlhdCI6MTc2ODI3MzYzMCwiZXhwIjoxNzY4MzYwMDMwfQ.6hhSxH2W-FE1ePPd6aOxq7waZRejnl6hBP-hllaRNts"
// }
// const token = obj.authorization.split(' ')[1]
// console.log(token)










// const cartDoc = {
//     _id: "6968cf3afc08691a32681a8f",
//     user: "6967b282572600d8d7cdb583",
//     items: [
//         {
//             product: "696464a8a4a8668f1223fb7c",
//             quantity: 2,
//             _id: "6968cf3afc08691a32681a90"
//         }
//     ],
//     createdAt: new Date("2026-01-15T11:27:54.722Z"),
//     updatedAt: new Date("2026-01-15T11:27:54.722Z"),
//     __v: 0
// };
// // const productExist = cartDoc.items.find((element) => element.product === "696464a8a4a8668f1223fb7c")
// // console.log(productExist)

// const incQty = cartDoc.items[0].quantity
// console.log(incQty)

// const productId = "696464a8a4a8668f1223fb7c"

// cartDoc.items = cartDoc.items.filter((element) => element.product.toString() !== productId)
// console.log(cartDoc)










// const cartDoc = {
//   _id: "69691dfa95bb7e37d00eba58",
//   user: "696516f6102affe8fecedf50",
//   items: [
//     {
//       product: {
//         _id: "696464d0a4a8668f1223fb7e",
//         price: 899
//       },
//       quantity: 4,
//       _id: "6969febbd8954e00daaac70f"
//     },
//     {
//       product: {
//         _id: "696464a8a4a8668f1223fb7c",
//         price: 799
//       },
//       quantity: 2,
//       _id: "6969fed5d8954e00daaac713"
//     },
//     {
//       product: {
//         _id: "69646519a4a8668f1223fb81",
//         price: 599
//       },
//       quantity: 1,
//       _id: "6969feebd8954e00daaac718"
//     },
//     {
//       product: {
//         _id: "69646545a4a8668f1223fb83",
//         price: 999
//       },
//       quantity: 5,
//       _id: "6969fef9d8954e00daaac71e"
//     },
//     {
//       product: {
//         _id: "696655a0ddb630419ecaf30b",
//         price: 699
//       },
//       quantity: 2,
//       _id: "6969ff26d8954e00daaac725"
//     }
//   ],
//   createdAt: new Date("2026-01-15T17:03:54.389Z"),
//   updatedAt: new Date("2026-01-16T09:04:38.157Z"),
//   __v: 12
// };

// const items = cartDoc.items
// console.log(items)

// const price = items[0].product.price
// const qty = items[0].quantity

// const total = price * qty
// // console.log(total)








// const totalPrice = items.map((element) => {
//     return element.product.price * element.quantity
// })
// console.log(totalPrice)
// const tp = totalPrice.reduce((acc, val) => {
//     return acc + val
// }, 0)
// console.log(tp)













// const cart = {
//   _id: "69691dfa95bb7e37d00eba58",
//   user: "696516f6102affe8fecedf50",
//   items: [
//     {
//       product: {
//         _id: "696464d0a4a8668f1223fb7e",
//         name: "boot cut jeans",
//         price: 899
//       },
//       quantity: 4,
//       _id: "6969febbd8954e00daaac70f"
//     },
//     {
//       product: {
//         _id: "696464a8a4a8668f1223fb7c",
//         name: "straight fit jeans",
//         price: 799
//       },
//       quantity: 2,
//       _id: "6969fed5d8954e00daaac713"
//     },
//     {
//       product: {
//         _id: "69646519a4a8668f1223fb81",
//         name: "baggy jeans",
//         price: 599
//       },
//       quantity: 1,
//       _id: "6969feebd8954e00daaac718"
//     },
//     {
//       product: {
//         _id: "69646545a4a8668f1223fb83",
//         name: "slim jeans",
//         price: 999
//       },
//       quantity: 5,
//       _id: "6969fef9d8954e00daaac71e"
//     },
//     {
//       product: {
//         _id: "696655a0ddb630419ecaf30b",
//         name: "narrow fit jeans",
//         price: 699
//       },
//       quantity: 2,
//       _id: "6969ff26d8954e00daaac725"
//     }
//   ],
//   createdAt: new Date("2026-01-15T17:03:54.389Z"),
//   updatedAt: new Date("2026-01-16T09:04:38.157Z"),
//   __v: 12
// };


// const productIds = cart.items.map((element) => {
//   return element.product._id
// })
// const productName = cart.items.map((element) => {
//   return element.product.name
// })
// const price = cart.items.map((element) => {
//   return element.product.price
// })
// const quantity = cart.items.map((element) => {
//   return element.quantity
// })



// const result = []

// for (let i = 0; i < productIds.length; i++) {
//   const items =
//   {
//     productId: productIds[i],
//     productName: productName[i],
//     price: price[i],
//     quantity: quantity[i]
//   }

//   result.push(items)
// }
// console.log(result)



// console.log(productIds)
// console.log(productName)
// console.log(price)
// console.log(quantity)



// itemsmodel = [
//   {
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true
//     },
//     productName: {
//       type: String,
//       required: true
//     },
//     price: {
//       type: Number,
//       required: true
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1
//     }
//   }
// ]



// array = [1, 2, 3, 4, 5, 6]
// array = []
// console.log(array)





// /* 
// {
//     "fullName": "coustomer1",
//     "phone": "8588949227",
//     "addressLine": "anand parbat kundan resatraunt",
//     "city": "New delhi",
//     "state": "Delhi",
//     "pincode": 110005
// }
// */



// // const string = "dev shraff"
// // const formatStatus = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// // console.log(string.charAt(0).toUpperCase() + string.slice(1))
// // console.log(string.slice(1))





// // routes
// router.post('/sendotp', sendOtp)
// router.post('/verifyotp', verifyOtp)
// router.post('/login', userLogin)
// router.delete('/admin/user/:id', authMiddleWare, adminMiddleware, deleteUser)

// router.post('/add', authMiddleware, creatCart)
// router.get('/', authMiddleware, getCart)
// router.put('/update', authMiddleware, updateCart)
// router.delete('/clear', authMiddleware, clearCart)
// router.get('/total', authMiddleware, cartTotal)

// router.post('/', createCategory)
// router.put('/:id', updateCategory)
// router.delete('/:id', deleteCategory)
// router.get('/', getAllCategories)

// router.post('/', authMiddleware, placeOrder)
// router.get('/', authMiddleware, getOrders)
// router.get('/:id', authMiddleware, getSpecificOrder)
// router.put('/:id/status/admin', authMiddleware, adminMiddleware, updateOrderStatus)

// router.get('/', getProducts)
// router.get('/:id', getSpecificProduct)
// router.post('/', createProduct)
// router.put('/:id', updateProduct)
// router.delete('/:id', deleteProduct)





const cartData = {
  msg: "Cart updated",
  cart: {
    _id: "6978e694c9d73552e459a5e6",
    user: "696ca9665c1744fc948b8ca2",
    items: [
      {
        product: "6978a46127815366404067fe",
        size: "30",
        quantity: 1,
        _id: "6978e694c9d73552e459a5e7"
      },
      {
        product: "6978a60f2781536640406804",
        size: "28",
        quantity: 1,
        _id: "6978e6c1c9d73552e459a5ec"
      }
    ],
    createdAt: "2026-01-27T16:23:48.270Z",
    updatedAt: "2026-01-27T16:24:33.705Z",
    __v: 1
  }
};

cartData.cart.items.map(item => {
  return {
    productId: item.product
  }
})