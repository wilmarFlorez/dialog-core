const express = require('express')
const apiRoute = require('./routes/routes.js')

const app = express()
const PORT = process.env.PORT || 3000

// middlewares
app.use(express.json())

app.use('/whatsapp', apiRoute)

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`)
})
