const whatsappModel = require('../shared/whatsapp.model')
const whatsappService = require('../services/whatsapp.service')
const chagptService = require('../services/chatgpt.service')

async function Process(textUser, number) {
  textUser = textUser.toLowerCase()
  const models = []
  //#sin chagtgpt
  /*  if(textUser.includes("hola")){
        //Saludar
        const model = whatsappModel.messageText("Hola, un gusto saludarte ", number)
        models.push(model)
        const modelList = whatsappModel.messageList(number)
        models.push(modelList)

    }
    else if(textUser.includes("gracias")){
        //Agradecimiento
        const model = whatsappModel.messageText("No hay problema ", number)
        models.push(model)
    }
    else if(textUser.includes("adios") || textUser.includes("bye") || textUser.includes("me voy")){
        //despedirse
        const model = whatsappModel.messageText(" Adios ", number)
        models.push(model)
    }
    else if(textUser.includes("comprar")){
        //Comprar
        const model = whatsappModel.mesaggeBuy(number)
        models.push(model)
    }
    else if(textUser.includes("vender")){
        
        const model = whatsappModel.messageText("Registrate en el siguiente formulario para evaluarte:  ", number)
        models.push(model)
    }
    else if(textUser.includes("agencia")){
        
        const model = whatsappModel.messageLocation(number)
        models.push(model)
    }
    else if(textUser.includes("contacto")){
        
        const model = whatsappModel.messageText("*Centro de contacto: * \n 310 123 4567  \n ",number)
        models.push(model)
    }
    else{
        const model = whatsappModel.messageText("No entiendo",number)
        models.push(model)
    } */

  //#con chatgpt

  const result = await chagptService.getMessaggeChatGPT(textUser)
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
  Process,
}
