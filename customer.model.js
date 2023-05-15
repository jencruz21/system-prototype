const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerDetailsSchema = new Schema({
    customer_name: {
        type: String,
        required: true
    },
    previous_remittance: {
        type: Number,
        required: true,
        min: 0
    },
    previous_balance: {
        type: Number,
        required: true,
        min: 0
    },
    is_cleared: {
        type: String,
        enum: ["yes", "no"],
        required: true
    },
    credit_limit: {
        type: Number,
        required: true,
        min: 0
    }
})

const CustomerDetails = mongoose.model('CustomerDetails', CustomerDetailsSchema)

module.exports = CustomerDetails