const whatsappModel = require('../shared/whatsapp.model')
const whatsappService = require('../services/whatsapp.service')
const chagptService = require('../services/chatgpt.service')

async function process(textUser, number) {
  textUser = textUser.toLowerCase()
  const models = []
  const result = await chagptService.getMessaggeChatGPT(textUser)
  console.log('Result =>', result)
  if (result) {
    const model = whatsappModel.messageText(result, number)
    models.push(model)
  } else {
    const model = whatsappModel.messageText(
      'Lo siento algo salio mal intentalo mas tarde',
      number
    )
    models.push(model)
  }
  models.forEach((model) => {
    whatsappService.SendMessageWhatsapp(model)
  })
}

module.exports = {
  process,
}
