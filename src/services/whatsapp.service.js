const https = require('https')
const dotenv = require('dotenv')
dotenv.config()

function sendMessage(text, number) {
  console.log('Sending message...', text, number)

  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'text',
    text: {
      preview_url: false,
      body: text,
    },
  })

  const options = {
    host: 'graph.facebook.com',
    path: '/v19.0/382988971554015/messages',
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FACEBOOK_AUTHORIZATION_TOKEN}`,
    },
  }

  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d)
    })
  })

  req.on('error', (error) => {
    console.error('Error', error)
  })

  req.write(data)
  req.end()
}

module.exports = {
  sendMessage,
}
