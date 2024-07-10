const whatsappModels = require('../models/whatsapp')
const { getBookings } = require('../api/motopress/bookings')
const optionsIds = require('../constants/optionsIds')
const { steps } = require('../constants/boot')

const https = require('https')

// state
const userState = {}

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

function getInteractiveMessage(messages) {
  const interactiveObject = messages['interactive']
  const typeInteractive = interactiveObject['type']
  console.log('Interactive object ==>', interactiveObject)

  if (typeInteractive === 'button_reply') {
    return interactiveObject['button_reply']['title']
  } else if (typeInteractive === 'list_reply') {
    console.log('Object ==>', interactiveObject.list_reply)

    /*  if (interactiveObject.list_reply.id === optionsIds.BOOK_ACCOMODATION) {
    } */
    return {
      type: typeInteractive,
      id: interactiveObject.list_reply.id,
      title: interactiveObject.list_reply.title,
    }
  } else {
    return { type: null, text: null, id: null, title: null }
  }
}

function getTextUser(messages) {
  let message = { type: null, text: null, id: null, title: null }

  const typeMessage = messages['type']

  if (typeMessage === 'text') {
    const text = messages['text']['body']
    message = { type: typeMessage, text: text }
  } else if (typeMessage === 'interactive') {
    message = getInteractiveMessage(messages)
  } else {
    console.log("There isn't a message")
  }

  return message
}

async function processMessage(messages, number) {
  const messageObject = getTextUser(messages)

  console.log('userState =========>', userState)

  let models = []
  const normalizeMessage =
    messageObject.text && messageObject.text.toLowerCase()

  if (messageObject.type === 'list_reply') {
    let model = null
    userState.step = steps.CHECK_IN
    if (messageObject.id === optionsIds.BOOK_ACCOMODATION) {
      model = whatsappModels.message(
        'Ingresa el día de llegada con la siguiente estructura: *dia/mes/año*\n Ejemplo: *1/01/2024*',
        number
      )
    }
    models.push(model)
  } else if (userState.step === steps.CHECK_IN) {
    let model = null
    userState.step = steps.CHECK_OUT
    model = whatsappModels.message(
      'Ingresa el día de Salida con la siguiente estructura: *dia/mes/año*\n Ejemplo: *5/01/2024*',
      number
    )
    models.push(model)
  } else if (userState.step === steps.CHECK_OUT) {
    let model = null
    userState.step = steps.NUMBER_OF_ADULTS
    model = whatsappModels.message('Ingresa el número de adultos', number)
    models.push(model)
  } else if (userState.step === steps.NUMBER_OF_ADULTS) {
    let model = null
    userState.step = steps.NUMBER_OF_CHILDREN
    model = whatsappModels.message('Ingresa el número de niños', number)
    models.push(model)
  } else if (normalizeMessage.includes('hola')) {
    /* const bookings = await getBookings() */

    let model = whatsappModels.message(
      '¡Hola! Bienvenido, Soy tu asistente virtual Sofia. ¿En qué puedo ayudarte hoy?',
      number
    )

    const rows = [
      {
        id: optionsIds.BOOK_ACCOMODATION,
        title: 'Reservar un alojamiento',
      },
      {
        id: optionsIds.TOURIST_PLANS,
        title: 'Planes turisticos',
      },
      {
        id: optionsIds.CHECK_AVAILABILITY,
        title: 'Consultar disponibilidad',
      },
      {
        id: optionsIds.TALK_TO_AN_AGENT,
        title: 'Hablar con un agente',
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

function processInteractiveMessage() {}

module.exports = {
  sendMessage,
  processMessage,
}
