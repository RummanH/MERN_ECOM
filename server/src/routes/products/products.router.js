const { Router } = require('express')
const { httpGetDummy } = require('./products.controller')

const router = Router()

//NOT RESTful
router.route('/dummy').get(httpGetDummy)

module.exports = router
