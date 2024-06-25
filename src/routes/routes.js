const express = require('express')
const router = express.Router()

const {
  verifyToken,
  receiveMessage,
} = require('../controllers/whatsapp.controller.js')

router.get('/', verifyToken).post('/', receiveMessage)

module.exports = router
