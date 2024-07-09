const axios = require('axios')

function createApiService(config) {
  console.log('Axios config', config)

  return axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    auth: config.auth,
  })
}

module.exports = { createApiService }
