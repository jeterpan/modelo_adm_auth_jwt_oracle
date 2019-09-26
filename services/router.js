const express = require('express')
const router = new express.Router()

const publicThings = require('./controllers/public-things.js')
const privateThings = require('./controllers/private-things.js')
const logins = require('./controllers/logins.js')
    
router.route('/public_things')
    .get(publicThings.get)

router.route('/private_things')
    .get(privateThings.get)

router.route('/logins')
    .get(logins.get)
   
module.exports = router