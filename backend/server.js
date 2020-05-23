const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const PORT = 5000 || process.env.PORT

require('dotenv').config()

const userRoutes = require('./routes/user')
const uri = process.env.ATLAS_URI

app.use(cors())
app.use(express.json())
app.use('/user', userRoutes)

mongoose.connect(uri,  { 
                        useNewUrlParser: true,
                        useCreateIndex: true,
                        useUnifiedTopology: true
                        })
        
const connection = mongoose.connection
connection.once('open', () => {
    console.log('mongoDB database connection established successfully.')
})

app.listen(PORT, () => console.log(`server is running on ${PORT}`))



