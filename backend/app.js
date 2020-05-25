const express = require('express')
// const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

require('dotenv').config()

const userRoutes = require('./routes/user')
const groceryRoutes = require('./routes/grocery')
const uri = process.env.ATLAS_URI

// app.use(cors())
// app.use(express.json())
app.use('/user', userRoutes)
app.use('/grocery', groceryRoutes)

mongoose.connect(uri,  { 
                        useNewUrlParser: true,
                        useCreateIndex: true,
                        useUnifiedTopology: true
                        })
        
const connection = mongoose.connection
connection.once('open', () => {
    console.log('mongoDB database connection established successfully.')
})

module.exports = app