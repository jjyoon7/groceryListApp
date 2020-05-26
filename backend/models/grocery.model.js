const mongoose = require('mongoose')

const grocerySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    buyer: {
        type: String,
    }
})

module.exports = mongoose.model('Grocery', grocerySchema)