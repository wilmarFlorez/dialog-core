function message(text, number) {
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

function image(imageUrl, number) {
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

function audio(audioUrl, number) {
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

function video(videoUrl, number) {
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

function document(documentUrl, number) {
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

function interactiveButtons(number) {
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

function interactiveList(number, rows) {
  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'Nuestros servicios',
      },
      body: {
        text: 'Selecciona una de las opciones',
      },
      footer: {
        text: '',
      },
      action: {
        button: 'Ver opciones',
        sections: [
          {
            title: 'Alojamientos',
            rows: rows,
          },
        ],
      },
    },
  })

  return data
}

function location(number) {
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

function createDayButtons(number) {
  const daysInMonth = new Date('2024', '07', 0).getDate()
  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ id: i < 10 ? `0${i}` : `${i}`, title: i.toString() })
  }

  const data = JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: number,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: 'Día de llegada:' },
      action: {
        button: 'Seleccionar',
        sections: [{ title: 'Dias', rows: days }],
      },
    },
  })

  return data
}

module.exports = {
  message,
  image,
  audio,
  video,
  document,
  interactiveButtons,
  interactiveList,
  location,
  createDayButtons,
}
