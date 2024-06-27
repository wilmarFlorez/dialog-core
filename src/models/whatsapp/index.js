function messageModel(text, number) {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'text',
    text: {
      preview_url: false,
      body: text,
    },
  })

  return data
}

function imageModel(imageUrl, number) {
  // Image example
  // https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/image_whatsapp.png
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'image',
    image: {
      link: imageUrl,
    },
  })

  return data
}

function audioModel(audioUrl, number) {
  // Audio example
  // https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/audio_whatsapp.mp3
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'audio',
    audio: {
      link: audioUrl,
    },
  })

  return data
}

function videoModel(videoUrl, number) {
  // Video example
  // https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/video_whatsapp.mp4
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'video',
    video: {
      link: videoUrl,
    },
  })

  return data
}

function documentModel(documentUrl, number) {
  // Document example
  // https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/document_whatsapp.pdf
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'document',
    document: {
      link: documentUrl,
    },
  })

  return data
}

function interactiveButtonsModel(number) {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: '¿Confirmas tu registro?',
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: '1',
              title: 'Si',
            },
          },
          {
            type: 'reply',
            reply: {
              id: '2',
              title: 'No',
            },
          },
        ],
      },
    },
  })

  return data
}

function interactiveListModel(number) {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'Alojamientos disponibles',
      },
      body: {
        text: 'Selecciona una de las opciones',
      },
      footer: {
        text: 'Estamos atentos a cualquier inquietud.',
      },
      action: {
        button: 'Ver opciones',
        sections: [
          {
            title: 'Hoteles',
            rows: [
              {
                id: '1',
                title: 'Hotel Calima',
                description: 'Habitación doble',
              },
              {
                id: '2',
                title: 'Hotel Brisas del calima',
                description: 'Habitación sencilla',
              },
            ],
          },
          {
            title: 'Camping',
            rows: [
              {
                id: '3',
                title: 'Mistic Paradaise',
                description: 'Carpa para 5 personas',
              },
              {
                id: '4',
                title: 'Lago Camping',
                description: 'Carpa para 2 personas',
              },
            ],
          },
        ],
      },
    },
  })

  return data
}

function locationModel(number) {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'location',
    location: {
      latitude: '3.886269383410249',
      longitude: '-76.52627538836315',
      name: 'Mistic paradise',
      address: 'Km 10 Vereda Llanitos',
    },
  })

  return data
}

module.exports = {
  messageModel,
  imageModel,
  audioModel,
  videoModel,
  documentModel,
  interactiveButtonsModel,
  interactiveListModel,
  locationModel,
}
