const whatsappModels = require('../models/whatsapp')

const https = require('https')
const dotenv = require('dotenv')
dotenv.config()

function sendMessage(messageObject) {
  const options = {
    host: 'graph.facebook.com',
    path: '/v19.0/382988971554015/messages',
    method: 'POST',
    body: messageObject,
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

  req.write(messageObject)
  req.end()
}

function processMessage(message, number) {
  const normalizeMessage = message.toLowerCase()
  let models = []

  if (normalizeMessage.includes('hola')) {
    let model = whatsappModels.message(
      '¡Hola! Bienvenido, Soy tu asistente virtual Sofia. ¿En qué puedo ayudarte hoy?',
      number
    )

    const rows = [
      {
        id: '1',
        title: 'Reservar un alojamiento',
        description: 'Descripción....',
      },
      {
        id: '2',
        title: 'Conocer nuestros planes turísticos',
        description: 'Descripción....',
      },
      {
        id: '3',
        title: 'Consultar disponibilidad y precios',
        description: 'Descripción....',
      },
      {
        id: '4',
        title: 'Hablar con un agente',
        description: 'Descripción....',
      },
    ]

    let listModel = whatsappModels.interactiveList(number, rows)

    models.push(model)
    models.push(listModel)
  } else if (normalizeMessage.includes('salir')) {
    let model = whatsappModels.message(
      'Me alegra haber podido ayudarte',
      number
    )
    models.push(model)
  } else {
    let model = whatsappModels.message(
      'Lo siento, No comprendí tu respuesta',
      number
    )
    models.push(model)
  }
  models.forEach((model) => {
    sendMessage(model)
  })
}

module.exports = {
  sendMessage,
  processMessage,
}
