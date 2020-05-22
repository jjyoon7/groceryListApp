const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

//sign up, create new user if user input email does not exist in database
router.post('/signup', (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if(user.email === req.body.email){
                return res.status(422).json({
                    message: 'this email address already exists.'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'user created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
})

//login post request, find the user with email input
router.post('/login', ( req, res, next ) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if(user.email !== req.body.email) {
                //404 no user found is too specific information
                //where hackers can try different emails to check which email exist
                //in the database or not. so staying vague with 401
                return res.status(401).json({
                    message: 'Authorization failed'
                })
            }
            //compare if the pw user typed in is matching
            //with the email from the database
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Authorization failed'
                    })
                }
                //when compare sucess, create a token and return it with the sucess msg
                if(result) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    )
                    return res.status(200).json({
                        message: 'Authorization sucess',
                        token
                    })
                }

            })
        })
        //when user tries to log in w non-existing email and pw
        //it will throw an error
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})