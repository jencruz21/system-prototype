const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TransactionItemsSchema = new Schema({
    item_name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    pricing: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    amount: {
        type: Number,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    }
})

const TransactionItemsModel = mongoose.model("TransactionItems", TransactionItemsSchema)
module.exports = TransactionItemsModel