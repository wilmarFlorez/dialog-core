const whatsappModels = require('../models/whatsapp')
const { getBookingsAvailability } = require('../api/motopress/bookings')
const optionsIds = require('../constants/optionsIds')
const { steps } = require('../constants/boot')
const { convertDateFormat } = require('../utils/date')

const https = require('https')

// state
let userState = {}

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

function handleCheckInStep(messageObject, number) {
  const newUserState = {
    ...userState,
    prevStep: steps.CHECK_IN,
  }

  userState = newUserState

  if (messageObject.id === optionsIds.BOOK_ACCOMODATION) {
    const model = whatsappModels.message(
      'Ingresa el día de llegada con la siguiente estructura: *dia/mes/año*\n Ejemplo: *1/01/2024*',
      number
    )
    return model
  }
}

function handleCheckOutStep(messageObject, number) {
  const newUserState = {
    ...userState,
    prevStep: steps.CHECK_OUT,
    checkIn: convertDateFormat(messageObject.text),
  }

  userState = newUserState

  const model = whatsappModels.message(
    'Ingresa el día de Salida con la siguiente estructura: *dia/mes/año*\n Ejemplo: *5/01/2024*',
    number
  )
  return model
}

function handleRequestNumberOfAdultsStep(messageObject, number) {
  const newUserState = {
    ...userState,
    prevStep: steps.NUMBER_OF_ADULTS,
    checkOut: convertDateFormat(messageObject.text),
  }

  userState = newUserState

  const model = whatsappModels.message('Ingresa el número de adultos', number)
  return model
}

function handleRequestNumberOfChildrenStep(messageObject, number) {
  const newUserState = {
    ...userState,
    prevStep: steps.NUMBER_OF_CHILDREN,
    numberOfAdults: parseInt(messageObject.text),
  }

  userState = newUserState

  const model = whatsappModels.message('Ingresa el número de niños', number)
  return model
}

async function handleRequestAvailability(messageObject, number) {
  const newUserState = {
    ...userState,
    prevStep: steps.BOOKINGS_AVAILABILITY,
    numberOfChildren: parseInt(messageObject.text),
  }

  userState = newUserState

  const availabilityData = await getBookingsAvailability(
    userState.checkIn,
    userState.checkOut,
    userState.numberOfAdults,
    userState.numberOfChildren
  )

  console.log('availabilityData =>', availabilityData)
  console.log('availabilityData sliced =>', availabilityData.slice(0, 4))

  const newAvailabilityData = availabilityData.slice(0, 4)

  const rows = newAvailabilityData.map((availabilityItem, index) => {
    return {
      id: index,
      title: availabilityItem.title,
      description: `$${availabilityItem.base_price}`,
    }
  })

  let listModel = whatsappModels.interactiveList(number, rows)

  return listModel
}

async function processMessage(messages, number) {
  const messageObject = getTextUser(messages)

  let models = []
  const normalizeMessage =
    messageObject.text && messageObject.text.toLowerCase()

  if (messageObject.type === 'list_reply') {
    const model = handleCheckInStep(messageObject, number)
    models.push(model)
  } else if (userState.prevStep === steps.CHECK_IN) {
    const model = handleCheckOutStep(messageObject, number)
    models.push(model)
  } else if (userState.prevStep === steps.CHECK_OUT) {
    const model = handleRequestNumberOfAdultsStep(messageObject, number)
    models.push(model)
  } else if (userState.prevStep === steps.NUMBER_OF_ADULTS) {
    const model = handleRequestNumberOfChildrenStep(messageObject, number)
    models.push(model)
  } else if (userState.prevStep === steps.NUMBER_OF_CHILDREN) {
    const model = await handleRequestAvailability(messageObject, number)
    models.push(model)
  } else if (normalizeMessage.includes('hola')) {
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

  console.log('userState =========>', userState)
}

module.exports = {
  sendMessage,
  processMessage,
}
