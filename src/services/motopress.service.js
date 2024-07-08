const { createApiService } = require('./apiService')
const config = require('../config/config')

const motopressService = createApiService(config.motopress)

module.exports = motopressService
