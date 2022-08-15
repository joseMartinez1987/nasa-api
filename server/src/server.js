const http = require('http')
const app = require('./app')

const {mongoConnect} = require('./services/mongo')

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
  await mongoConnect()
  await loadPlanetData()
  
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}
startServer()




