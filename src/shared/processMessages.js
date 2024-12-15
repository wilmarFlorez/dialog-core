import { messageText } from '../shared/whatsapp.model.js';
import { sendMessageWhatsapp } from '../services/whatsapp.service.js';
import { getMessaggeChatGPT } from '../services/chatgpt.service.js';

const processMessages = async (textUser, number) => {
  textUser = textUser.toLowerCase();
  const models = [];
  const result = await getMessaggeChatGPT(textUser);
  console.log('Result =>', result);
  if (result) {
    const model = messageText(result, number);
    models.push(model);
  } else {
    const model = messageText(
      'Lo siento algo salio mal intentalo mas tarde',
      number
    );
    models.push(model);
  }
  models.forEach((model) => {
    sendMessageWhatsapp(model);
  });
};

export { processMessages };
