const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  motopress: {
    baseURL: process.env.MOTOPRESS_API_URL,
    auth: {
      username: process.env.MOTOPRESS_CLIENT_KEY,
      password: process.env.MOTORESS_CLIEN_SECRET,
    },
    timeout: 5000,
  },
}
