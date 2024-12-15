const messageText = (textResponse, number) => {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'text',
    text: {
      preview_url: true,
      body: textResponse,
    },
  });
  return data;
};

const messageList = (number) => {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    to: number,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: {
        text: 'Selecciona una de las opciones para poder responderte',
      },
      action: {
        button: 'Ver opciones',
        sections: [
          {
            title: 'Compra y vende productos',
            rows: [
              {
                id: 'main-comprar',
                title: 'Comprar',
                description: 'Compras los mejores productos  para tu hogar',
              },
              {
                id: 'main-vender',
                title: 'Vender',
                description: 'Vende tus productos',
              },
            ],
          },
          {
            title: 'Centro de atencion',
            rows: [
              {
                id: 'main-agencia',
                title: 'Agencia',
                description: 'Vender algo',
              },
              {
                id: 'main-contacto',
                title: 'Centro de contacto',
                description: 'Te atendera uno de nuestros agentes',
              },
            ],
          },
        ],
      },
    },
  });
  return data;
};

const mesaggeBuy = (number) => {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    to: number,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: '¿Selecciona uno de los productos?',
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'option-laptop',
              title: 'laptop',
            },
          },
          {
            type: 'reply',
            reply: {
              id: 'option-computadora',
              title: 'computadora',
            },
          },
        ],
      },
    },
  });
  return data;
};

const messageLocation = (number) => {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    to: number,
    type: 'location',
    location: {
      latitude: '3.932158',
      longitude: '-76.484348',
      name: 'Parque calima',
      address: 'Carrera 7 #10-32, Darién, Calima, Valle del Cauca',
    },
  });
  return data;
};

export { messageText, messageList, mesaggeBuy, messageLocation };
