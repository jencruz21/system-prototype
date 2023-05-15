const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * customer details
 * payment details
 * transaction details
 *  - We need to generate a uuid for this so we can map the id for the items
 */

const CustomerDetailsSchema = new Schema({
    customer_name: {
        type: String,
        required: true
    },
    prev_remittance: {
        type: String,
        required: true
    },
    prev_balance: {
        type: String,
        required: true
    },
    is_cleared: {
        type: String,
        required: true
    },
    credit_limit: {
        type: String,
        required: true
    },
})

const PaymentDetailsSchema = new Schema({
    payment_date: {
        type: String,
        required: true
    },
    transaction_type: {
        type: String,
        required: true
    },
    add_ons: {
        type: Number,
        required: true
    },
    less: {
        type: Number,
        required: true
    },
    check_value: {
        type: Number,
        required: true
    },
    check_number: {
        type: Number,
        required: true,
        default: 200_000
    },
    check_date: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    }
})

const TransactionSchema = new Schema({
    item_subtotal: {
        type: Number,
        required: true
    },
    grand_total: {
        type: Number,
        required: true
    },
    cavans: {
        type: Number,
        required: true
    },
    change: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    amount_due: {
        type: Number,
        required: true
    },
    transaction_id: {
        type: String,
        required: true,
        unique: true
    },
    customer_details: CustomerDetailsSchema,
    payment_details: PaymentDetailsSchema
})

const TransactionModel = mongoose.model('Transaction', TransactionSchema)

module.exports = {
    TransactionModel
}