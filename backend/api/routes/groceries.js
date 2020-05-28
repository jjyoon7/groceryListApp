const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Grocery = require('../models/grocery.model')

router.get('/', async(req, res, next) => {
    try {
        const results = await Grocery.find().select('name quantity buyer')
        const response = {
            count: results.length,
            groceries: results.map(result => {
                return {
                    name: result.name,
                    quantity: result.quantity,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: req.get('host') + '/groceries/' + result._id
                    }
                }
            })
        }
        res.status(200).json(response)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.post('/', async(req, res, next) => {
    const name = req.budy.name
    const quantity = req.body.quantity
    const buyer = req.body.buyer
    
    const grocery = new Grocery({
        name,
        quantity,
        buyer
    })

    try {
        const result = await grocery.save()
        const response = {
            name: result.name,
            quantity: result.quantity,
            _id: result._id,
            request: {
                type: 'POST',
                url: req.get('host') + '/groceries/' + result._id
            }
        }
        res.status(201).json(response)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.get('/:groceryId', async( req, res, next ) => {
    const id = req.params.groceryId

    try {
        const result = await Grocery.findById(id)
        const response = {
            name: result.name,
            quantity: result.quantity,
            _id: result._id,
            request: {
                type: 'GET',
                url: req.get('host') + '/groceries/' + result._id
            }
        }
        res.status(200).json(response)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.patch('/:groceryId', async( req, res, next ) => {
    const id = req.params.groceryId
    const props = req.body

    try {
        const result = await Grocery.updateOne({_id: id}, props)
        const response = {
            message: 'Grocery updated',
            request: {
                type: 'GET',
                url:  + result._id
            }
        }
        res.status(200).json(response)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.delete('/:groceryId', async( req, res, next ) => {
    const id = req.params.groceryId
    try {
        const result = await Grocery.deleteOne({_id: id})
        res.status(200).json({
            message: 'Grocery deleted'
        })
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

module.exports = router