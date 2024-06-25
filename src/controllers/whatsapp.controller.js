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

function getInteractiveMessage(messages) {
  const interactiveObject = messages['interactive']
  const typeInteractive = interactiveObject['type']
  console.log('Interactive object ==>', interactiveObject)

  if (typeInteractive === 'button_reply') {
    return interactiveObject['button_reply']['title']
  } else if (typeInteractive === 'list_reply') {
    return interactiveObject['list_reply']['title']
  } else {
    console.log("There isn't an interactive message")
  }
}

function getTextUser(messages) {
  const text = ''
  const typeMessage = messages['type']

  if (typeMessage === 'text') {
    text = messages['text']['body']
  } else if (typeMessage === 'interactive') {
    text = getInteractiveMessage(messages)
  } else {
    console.log("There isn't a message")
  }

  return text
}

const receiveMessage = (req, res) => {
  try {
    const entry = req.body['entry'][0]
    const changes = entry['changes'][0]
    const value = changes['value']
    const messageObject = value['messages']
    const messages = messageObject[0]
    const text = getTextUser(messages)

    res.send('EVENT_RECEIVED')
  } catch (error) {
    myConsole.log(error)
    res.send('EVENT_RECEIVED')
  }
}

module.exports = {
  verifyToken,
  receiveMessage,
}
