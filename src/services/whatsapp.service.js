const whatsappModels = require('../models/whatsapp')
const { getBookingsAvailability } = require('../api/motopress/bookings')
const { getAccommodationById } = require('../api/motopress/accommodations')
const optionsIds = require('../constants/optionsIds')
const { steps, MAX_LENGTH_BOOKINGS_AVAILABLE } = require('../constants/boot')
const { convertDateFormat } = require('../utils/date')
const { validateMaxLength } = require('../utils/string')

const https = require('https')

// state
let userState = {
  startBookingsAvailableList: 0,
  bookingsAvailable: [],
  currentBookingsAvailable: [],
}

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

const getAmenities = (amenities) => {
  let amenitiesText = ''

  amenities.forEach((amenity, index) => {
    amenitiesText = `${amenitiesText}\n${index + 1}. ${amenity.name}`
  })

  return amenitiesText
}

async function handleRequestAvailability(messageObject, number) {
  const availabilityData = await getBookingsAvailability(
    userState.checkIn,
    userState.checkOut,
    userState.numberOfAdults,
    userState.numberOfChildren
  )

  const newBookingsAvailable = await Promise.all(
    availabilityData
      .slice(
        userState.startBookingsAvailableList,
        userState.startBookingsAvailableList + MAX_LENGTH_BOOKINGS_AVAILABLE
      )
      .map(async (booking) => {
        try {
          const accommodation = await getAccommodationById(
            booking.accommodation_type
          )

          return {
            ...booking,
            accommodation: {
              ...accommodation,
            },
          }
        } catch (error) {
          console.error(
            `Error fetching accommodation for booking ${booking.accommodation_type}`
          )

          return {
            ...booking,
            accommodation: null,
          }
        }
      })
  )

  // Update state
  const newUserState = {
    ...userState,
    prevStep: steps.BOOKINGS_AVAILABILITY,
    numberOfChildren: parseInt(messageObject.text),
    bookingsAvailable: availabilityData,
    currentBookingsAvailable: newBookingsAvailable,
  }

  userState = newUserState
  // End update state

  let textList =
    'Claro que si con mucho gusto, te comparto nuestra disponibilidad\n  Por favor escribe el número del alojamiento de tu interes:'
  newBookingsAvailable.forEach((availabilityItem, index) => {
    textList = `${textList}\n\n${index + 1}. *Alojamiento:* ${validateMaxLength(
      availabilityItem.title,
      65
    )}\n  *Costo:* ${validateMaxLength(
      `$${availabilityItem.base_price}`,
      24
    )}\n  *Imagen:* ${availabilityItem.accommodation.images[0].src}`
  })

  textList = `${textList}\n\n${
    MAX_LENGTH_BOOKINGS_AVAILABLE + 1
  }. Ver más opciones\n\n ${
    MAX_LENGTH_BOOKINGS_AVAILABLE + 2
  }. Volver al menú anterior`

  let model = whatsappModels.message(textList, number)

  return model
}

async function loadMoreBookingsAvailability(messageObject, number) {
  console.log('Option Selected ====>', parseInt(messageObject.text))

  if (parseInt(messageObject.text) === 5) {
    const newStartBookingsAvailableList =
      userState.startBookingsAvailableList + MAX_LENGTH_BOOKINGS_AVAILABLE

    const newBookingsAvailable = await Promise.all(
      userState.bookingsAvailable
        .slice(
          newStartBookingsAvailableList,
          newStartBookingsAvailableList + MAX_LENGTH_BOOKINGS_AVAILABLE
        )
        .map(async (booking) => {
          try {
            const accommodation = await getAccommodationById(
              booking.accommodation_type
            )

            return {
              ...booking,
              accommodation: {
                ...accommodation,
              },
            }
          } catch (error) {
            console.error(
              `Error fetching accommodation for booking ${booking.accommodation_type}`
            )
            return {
              ...booking,
              accommodation: null,
            }
          }
        })
    )

    // Update state
    const newUserState = {
      ...userState,
      prevStep: steps.BOOKINGS_AVAILABILITY,
      startBookingsAvailableList: newStartBookingsAvailableList,
      currentBookingsAvailable: newBookingsAvailable,
    }

    userState = newUserState
    // End update state

    console.log('LOAD MORE NEW BOOKINGS', newBookingsAvailable)

    let textList =
      'Claro que si con mucho gusto, te comparto nuestra disponibilidad\n  Por favor escribe el número del alojamiento de tu interes'
    newBookingsAvailable.forEach((availabilityItem, index) => {
      textList = `${textList}\n\n${
        index + 1
      }. *Alojamiento:* ${validateMaxLength(
        availabilityItem.title,
        65
      )}\n  *Costo:* ${validateMaxLength(
        `$${availabilityItem.base_price}`,
        24
      )}\n  *Imagen:* ${availabilityItem.accommodation.images[0].src}`
    })

    textList = `${textList}\n\n${
      MAX_LENGTH_BOOKINGS_AVAILABLE + 1
    }. Ver más opciones\n\n ${
      MAX_LENGTH_BOOKINGS_AVAILABLE + 2
    }. Volver al menú anterior`

    let model = whatsappModels.message(textList, number)

    return model
  }
  if (
    parseInt(messageObject.text) <= userState.currentBookingsAvailable.length &&
    parseInt(messageObject.text) > 0
  ) {
    const selectedItem =
      userState.currentBookingsAvailable[parseInt(messageObject.text - 1)]
    
    const accommodation = await getAccommodationById(
      selectedItem.accommodation_type
    )

    console.log('ACCOMMODATION ========>', accommodation)

    const model = whatsappModels.message(
      `Seleccionaste:${selectedItem.title}`,
      number
    )
    return model
  } else {
    const model = whatsappModels.message(
      'Lo siento no comprendí tu respuesta,por favor ingresa el número correspondiente a la opción que deseas elegir',
      number
    )
    return model
  }
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

    console.log('List model after', model)
    models.push(model)
  } else if (userState.prevStep === steps.BOOKINGS_AVAILABILITY) {
    const model = await loadMoreBookingsAvailability(messageObject, number)
    models.push(model)
  } else if (normalizeMessage.includes('hola')) {
    let model = whatsappModels.message(
      '¡Hola! Bienvenido, Soy tu asistente virtual Sofia. ¿En qué puedo ayudarte hoy?',
      number
    )

    const rows = [
      {
        id: optionsIds.BOOK_ACCOMODATION,
        title: 'Toda la disponibilidad',
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

  /* console.log('userState =========>', userState) */
}

module.exports = {
  sendMessage,
  processMessage,
}
