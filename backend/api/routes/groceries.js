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

router.get('/:groceryId', ( req, res ) => {
    Grocery.findById(req.params.groceryId)
        .then(grocery => res.json(grocery))
        .catch(err => res.status(400).json('Error: ') + err)
})

router.delete('/:groceryId', ( req, res ) => {
    Grocery.findByIdAndDelete(req.params.groceryId)
        .then(() => res.json('Grocery deleted.'))
        .catch(err => res.status(400).json('Error: ') + err)
})

router.patch('/:groceryId', ( req, res ) => {
    const id = req.params.groceryId
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    Grocery.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'updated grocery successfully'
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

    // Grocery.findById(req.params.groceryId)
    //     .then(grocery => {
    //         grocery.name = req.body.name
    //         grocery.quantity = req.body.quantity
    //         grocery.buyer = req.body.buyer
            
    //         grocery.save()
    //             .then(() => res.json('Grocery updated.'))
    //             .catch(err => res.status(400).json('Error: ') + err)
    //     })
    //     .catch(err => res.status(400).json('Error: ') + err)
})

module.exports = router