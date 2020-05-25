const express = require('express')
// const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

require('dotenv').config()

const userRoutes = require('./routes/user')
const groceryRoutes = require('./routes/grocery')
const uri = process.env.ATLAS_URI

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    //* means give access to API to all webpages
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    
    if(req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        return res.status(200).json({})
    }
})

app.use('/users', userRoutes)
app.use('/groceries', groceryRoutes)

//if the routes does not match or exists, throw error
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
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