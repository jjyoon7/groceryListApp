const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
 
const User = require('../models/user.model')

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            //422 unprocessable entity
            if (user.length >= 1) {
                return res.status(422).json({
                    message: 'this email address already exist'
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
                        user
                            .save()
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

router.post('/login', ( req, res, next ) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            //find the user with email address
            if(user.length < 1){
                //reason why not using 404 and sending 'no user found' is 
                //bcs hackers can use this to find which email exist and not
                return res.status(401).json({
                    message: 'Authorization failed'
                })
            }
            //compare if the paswword which user typed in is matching with user.password in database
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Authorization failed'
                    })
                }
                if(result) {
                    const token = jwt.sign(
                     {
                        email: user[0].email,
                        userId: user[0]._id
                     }, 
                     process.env.JWT_KEY, 
                     {
                         expiresIn:'1h'
                     }
                    )
                    return res.status(200).json({
                        message: 'Authorization success',
                        token
                    })
                }
                //when user tries to log in w no-existing email and pw it will fail
                return res.status(401).json({
                    message: 'Authorization failed'
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => result.status(200).json({ message: 'User deleted'}))
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router