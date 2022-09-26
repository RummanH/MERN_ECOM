const express = require('express')
const productRouter = require('./products/products.router')

const router = express.Router()

router.use('/products', productRouter)

module.exports = router
