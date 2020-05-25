const express = require('express')
// const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()

require('dotenv').config()

const userRoutes = require('./routes/user')
const groceryRoutes = require('./routes/grocery')
const uri = process.env.ATLAS_URI

// app.use(cors())
// app.use(express.json())

app.use(morgan('dev'))
app.use('/user', userRoutes)
app.use('/grocery', groceryRoutes)

//if the routes does not match or exists, throw error
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status(404)
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.mesage
        }
    })
})

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