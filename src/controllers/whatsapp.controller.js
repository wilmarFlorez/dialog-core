const fs = require('fs')
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'))
const proccessMessages = require('../shared/processMessages')

const GetTextUser = (messages) => {
  let text = ''
  const typeMessage = messages['type']

  if (typeMessage === 'text') {
    text = messages['text']['body']
  } else if (typeMessage === 'interactive') {
    const interactiveObject = messages['interactive']
    const typeInteractive = interactiveObject['type']

    if (typeInteractive === 'button_reply') {
      text = interactiveObject['button_reply']['title']
    } else if (typeInteractive === 'list_reply') {
      text = interactiveObject['list_reply']['title']
    } else {
      myConsole.log('Sin mensaje')
    }
  } else {
    myConsole.log('Sin mensaje')
  }
  return text
}

const verifyToken = (req, res) => {
  try {
    const accessToken = 'FDSHDJMNFH45G4HSDERTDVFHSDHJ4187'
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    if (challenge !== null && token !== null && token === accessToken) {
      res.send(challenge)
    } else {
      res.sendStatus(400).send()
    }
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    })
  }
}

const receiveMessage = async (req, res) => {
  try {
    const entry = req.body['entry'][0]
    const changes = entry['changes'][0]
    const value = changes['value']

    const messageObject = value['messages']
    myConsole.log(messageObject)
    if (messageObject !== undefined) {
      const messages = messageObject[0]
      const text = GetTextUser(messages)
      const number = messages['from']

      if (text !== '') {
        await proccessMessages.Process(text, number)
      }
    }
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
