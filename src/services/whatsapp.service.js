const https = require('https')
const dotenv = require('dotenv')
dotenv.config()

function SendMessageWhatsapp(data) {
  const options = {
    host: 'graph.facebook.com',
    path: '/v19.0/382988971554015/messages',
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.FACEBOOK_TOKEN_AUTHORIZATION,
    },
  }

  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d)
    })
  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.write(data)
  req.end()
}

module.exports = {
  SendMessageWhatsapp,
}
