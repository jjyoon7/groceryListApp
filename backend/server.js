const http = require('http')
const PORT = 5000 || process.env.PORT
const app = require('./app')
const server = http.createServer(app)

server.listen(PORT, () => console.log(`server is running on ${PORT}`))



