const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Grocery = require('../models/grocery.model')

router.route('/').get(( req, res ) => {
    Grocery.find()
        .then(groceries => res.json(groceries))
        .catch(err => res.status(400).json('Error: ') + err)
})

router.route('/add').post(( req, res ) => {
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

router.route('/:id').get(( req, res ) => {
    Grocery.findById(req.params.id)
        .then(grocery => res.json(grocery))
        .catch(err => res.status(400).json('Error: ') + err)
})

router.route('/:id').delete(( req, res ) => {
    Grocery.findByIdAndDelete(req.params.id)
        .then(() => res.json('Grocery deleted.'))
        .catch(err => res.status(400).json('Error: ') + err)
})

router.route('/update/:id').post(( req, res ) => {
    Grocery.findById(req.params.id)
        .then(grocery => {
            grocery.name = req.body.name
            grocery.quantity = req.body.quantity
            grocery.buyer = req.body.buyer
            
            grocery.save()
                .then(() => res.json('Grocery updated.'))
                .catch(err => res.status(400).json('Error: ') + err)
        })
        .catch(err => res.status(400).json('Error: ') + err)
})

module.exports = router