const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Grocery = require('../models/grocery.model')

router.get('/', (req, res, next) => {
    Grocery.find()
        .then(groceries => res.json(groceries))
        .catch(err => res.status(400).json('Error: ') + err)
})

router.post('/', (req, res, next) => {
    const name = req.budy.name
    const quantity = req.body.quantity
    const buyer = req.body.buyer
    
    const newGrocery = new Grocery({
        name,
        quantity,
        buyer
    })

    newGrocery.save()
        .then(() => res.json('Grocery added.'))
        .catch(err => res.status(400).json('Error: ') + err)
})

router.get('/:groceryId', async( req, res ) => {
    const id = req.params.groceryId

    try {
        const result = await Grocery.findById(id).exec()
        console.log(result)
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.delete('/:groceryId', ( req, res ) => {
    Grocery.findByIdAndDelete(req.params.groceryId)
        .then(() => res.json('Grocery deleted.'))
        .catch(err => res.status(400).json('Error: ') + err)
})

router.patch('/:groceryId', async( req, res, next ) => {
    const id = req.params.groceryId
    const props = req.body

    try {
        const result = await Grocery.updateOne({_id: id}, props).exec()
        console.log(result)
        res.status(200).json(result)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
})

module.exports = router