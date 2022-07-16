const http = require('http')
const mongoose = require('mongoose')
const app = require('./app')

const { loadPlanetData } = require('./models/planets.models')

const PORT = process.env.PORT || 8000

const MONGO_URL = `mongodb+srv://nasa:NR2jiQeHwVCZQgzW@cluster0.wof8q.mongodb.net/nasa-project?retryWrites=true&w=majority`


const server = http.createServer(app)


mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready')
})

mongoose.connection.on('error',(err) => {
  console.error(err)
})

async function startServer() {
  await mongoose.connect(MONGO_URL)
  const res = await loadPlanetData()
  console.log(res)
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}
startServer()




