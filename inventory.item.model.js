const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InventoryItemDetailsSchema = new Schema({ 
    item_name: {
        type: String,
        required: true,
        unique: true
    },
    item_sacks: {
        type: Number,
        required: true
    },
    item_price: {
        type: Number,
        required: true
    },
    item_type: {
        type: String,
        required: true
    }, 
    item_kilos: {
        type: Number,
        required: true
    }
})

const InventoryItemDetails = mongoose.model('InventoryItemDetails', InventoryItemDetailsSchema)

module.exports = InventoryItemDetails