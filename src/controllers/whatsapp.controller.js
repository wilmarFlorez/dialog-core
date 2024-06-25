const fs = require('fs')
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'))

const verifyToken = (req, res) => {
  try {
    // This token is a generated random token
    let accessToken = 'SAFK23434JF8L38VLVM8O0'
    let token = req.query['hub.verify_token']
    let challenge = req.query['hub.challenge']

    if (challenge !== null && token !== null && token == accessToken) {
      res.send(challenge)
    } else {
      res.status(400).send()
    }
  } catch (error) {
    res.status(400).send()
  }
}

const receiveMessage = (req, res) => {
  try {
    let entry = req.body['entry'][0]
    let changes = entry['changes'][0]
    let value = changes['value']
    let messageObject = value['messages']

    console.log(':::::::::::::::::::::::::::::::')
    console.log('Message', messageObject)
    console.log(':::::::::::::::::::::::::::::::')

    myConsole.log(messageObject)

    res.send('EVENT_RECEIVED')
  } catch (error) {
    console.error('Error', error)

    myConsole.log(error)
    res.send('EVENT_RECEIVED')
  }
}

module.exports = {
  verifyToken,
  receiveMessage,
}
