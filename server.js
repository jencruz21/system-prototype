const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')

const CustomerModel = require('./customer.model')
const InventoryModel = require('./inventory.item.model')
const TransactionItems = require('./transaction.items.model')
const TransactionModel = require('./transaction.model')

app.set('view engine', 'ejs')
app.set('views', './public/views')

app.use(express.urlencoded({
    extended: false
}))
app.use('/js', express.static(path.resolve(__dirname, 'public/js')))

app.get('/', async (req, res) => {
    try {
        const items = await InventoryModel.find()
        const customers = await CustomerModel.find()

        return res.status(200).render('index', {
            items,
            customers
        })
    } catch (error) {
        return res.status(400).json({
            message: "Bad Request"
        })
    }
})

/**
 * APIS FOR THE FETCHING OF ITEMS, CUSTOMERS, TRANSACTIONS and CART ITEMS
 */

app.get("/customer/:name", async (req, res) => {
    try {
        const result = await CustomerModel.findOne({ customer_name: req.params.name })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({
            message: "Bad Request"
        })
    }
})

app.get("/inventory/:name", async (req, res) => {
    try {
        const result = await InventoryModel.findOne({ item_name: req.params.name })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({
            message: "Bad Request"
        })
    }
})

/**
 * Transaction
 */
app.post("/transaction", async (req, res) => {
    try {
        const {
            item_subtotal,
            grand_total,
            cavans,
            change,
            status,
            amount_due,
            transaction_id,
            customer_details,
            payment_details
        } = req.body

        const {
            customer_name,
            prev_remittance,
            prev_balance,
            is_cleared,
            credit_limit
        } = customer_details
        
        const {
            payment_date,
            transaction_type,
            add_ons,
            less,
            check_value,
            check_number,
            check_date,
            notes
        } = payment_details

        const hasNotes = notes === "" ? "" : notes 

        const model = new TransactionModel({
            item_subtotal,
            grand_total,
            cavans,
            change,
            status,
            amount_due, 
            transaction_id,
            customer_details:{
                customer_name,
                prev_remittance,
                prev_balance,
                is_cleared,
                credit_limit
            },
            payment_details: {
                payment_date,
                transaction_type,
                add_ons,
                less,
                check_value,
                check_number,
                check_date,
                notes: hasNotes
            }
        })

        const result = await model.save()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
})
/**
 * End Transaction
 */

/**
 * Transaction Items
 */
app.post("/transaction/items", async (req, res) => {
    try {
        const {
            item_name, 
            quantity,
            pricing,
            price,
            amount,
            transaction_id
        } = req.body

        const model = new TransactionItems({
            item_name,
            quantity,
            pricing,
            price,
            amount,
            transaction_id
        })
        const result = await model.save()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
})
/**
 * End Transaction Items
 */

/**
 * END API FETCHING
 */

mongoose.connect('mongodb+srv://admin:admin@cluster0.vdrsyen.mongodb.net/jannamerDB?retryWrites=true&w=majority')

app.listen(3000, () => {
    
    console.log('http://localhost:3000');
})