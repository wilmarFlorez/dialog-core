const verifyToken = (req, res) => {
  try {
    // This token is a generated random token
    let accessToken = 'SAFK23434JF8L38VLVM8O0'
    let token = req.query['hub.verify_token']
    let challenge = req.query['hub.challenge']

    if (challenge !== null && token !== null && token == accessToken) {
      res.send(challenge)
    } else {
      res.status(400).send()
    }
  } catch (error) {
    res.status(400).send()
  }
}

const receiveMessage = (req, res) => {
  res.send('hola received')
}

module.exports = {
  verifyToken,
  receiveMessage,
}
