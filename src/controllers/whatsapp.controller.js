import fs from 'fs';
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'));
import { processMessages } from '../shared/processMessages.js';

const extractTextFromMessage = (message) => {
  let text = '';
  const typeMessage = message['type'] || 'text';

  if (typeMessage === 'text') {
    text = message['text']['body'];
  } else if (typeMessage === 'interactive') {
    const interactiveObject = message['interactive'];
    const typeInteractive = interactiveObject['type'];

    if (typeInteractive === 'button_reply') {
      text = interactiveObject['button_reply']['title'];
    } else if (typeInteractive === 'list_reply') {
      text = interactiveObject['list_reply']['title'];
    } else {
      console.log('Sin mensaje');
    }
  } else {
    console.log('Sin mensaje');
  }
  return text;
};

const verifyToken = (req, res) => {
  try {
    const accessToken = 'FDSHDJMNFH45G4HSDERTDVFHSDHJ4187';
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (challenge && token && token === accessToken) {
      res.send(challenge);
    } else {
      res.sendStatus(400).send('Invalid token');
    }
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
};

const receiveMessage = async (req, res) => {
  try {
    const entry = req.body['entry'][0];
    const changes = entry['changes'][0];
    const value = changes['value'];

    const messages = value['messages'];

    console.log('message', messages);
    if (messages !== undefined) {
      const message = messages[0];
      const text = extractTextFromMessage(message);
      const number = message.from;

      console.log('message', message, '\nnumber', number, '\ntext', text);

      if (text) {
        // proccess the text only if it is not empty
        console.l;
        await processMessages(text, number);
      } else {
        console.log(
          'No se ha logrado extraer el texto del mensaje (cuerpo del mensaje o body text)'
        );
      }
    }
    res.send('EVENT_RECEIVED');
  } catch (error) {
    console.log('Error receiving message:', error);
    res.status(500).send('Internal server error!');
  }
};

export { verifyToken, receiveMessage };
