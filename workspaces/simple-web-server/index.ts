import express from 'express'

const app = express()

app.use(express.static('../dist'))

// Server setup
app.listen(3000, () => {
  console.log('Server is Running')
})
