const whatsappService = require('../services/whatsapp.service')
const optionsIds = require('../constants/optionsIds')

const verifyToken = (req, res) => {
  try {
    // This token is a generated random token
    let accessToken = 'SAFK23434JF8L38VLVM8O0'
    let token = req.query['hub.verify_token']
    let challenge = req.query['hub.challenge']

    if (challenge !== null && token !== null && token == accessToken) {
      res.status(200).send(challenge)
    } else {
      res.status(400).send()
    }
  } catch (error) {
    res.status(400).send()
  }
}

const receiveMessage = async (req, res) => {
  try {
    const entry = req.body['entry'][0]
    const changes = entry['changes'][0]
    const value = changes['value']
    const messageObject = value['messages']

    if (messageObject) {
      const messages = messageObject[0]

      const number = messages['from']

      await whatsappService.processMessage(messages, number)
    }

    res.send('EVENT_RECEIVED')
  } catch (error) {
    console.log(error)
    res.send('EVENT_RECEIVED')
  }
}

module.exports = {
  verifyToken,
  receiveMessage,
}
