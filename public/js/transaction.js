// ordering details
const item_name = document.getElementById('item_name')
const selected_pricing = document.getElementById('select_pricing')
const by_sacks = document.getElementById('by_sacks')
const by_kilos = document.getElementById('by_kilos')
const amount = document.getElementById('amount')
// item details
const item_sacks = document.getElementById('item_sacks')
const item_kilos = document.getElementById('item_kilos')
const item_grams = document.getElementById('item_grams')
const item_type = document.getElementById('item_type')
const item_price = document.getElementById('item_price')
// customer details
const customer = document.getElementById('customer')
const prev_remittance = document.getElementById('prev_remittance')
const prev_balance = document.getElementById('prev_balance')
const is_cleared = document.getElementById('is_cleared')
const credit_limit = document.getElementById('credit_limit')
// transaction details
const item_subtotal = document.getElementById('item_subtotal')
const grand_total = document.getElementById('grand_total')
const cavans = document.getElementById('cavans')
const change = document.getElementById('change')
const status = document.getElementById('status')
const transact_status = document.getElementById('transact_status')
// payment details
const add_ons = document.getElementById('add_ons')
const less = document.getElementById('less')
const cash_remitted = document.getElementById('cash_remitted')
const check_value = document.getElementById('check_value')
const check_number = document.getElementById('check_number')
const notes = document.getElementById('notes')
const check_date = document.getElementById('check_date')
const payment_date = document.getElementById('payment_date')
// const transact = document.getElementById('transact')

const del_button = document.getElementsByClassName('del-btn')

const GRAMS = 1000
const KILOS = 0.001

// data of the table
const data = []
let itemSubtotal = 0
let grandTotal = 0
let totalCavans = 0

// table of items
const tbody = document.getElementById('tbody')

/**
 * Start Fetch Listener
 */
// Fetching the data from the database
customer.addEventListener("change", async function(event) {
    console.log(event.target.value);
    try {
        const response = await fetch(`/customer/${event.target.value}`)
        const data = await response.json()

        prev_balance.value = data.previous_balance
        prev_remittance.value = data.previous_remittance
        is_cleared.value = data.is_cleared
        credit_limit.value = data.credit_limit

        if (data.credit_limit > 0) {
            transact_status.value = "BALANCE"
        } else {
            transact_status.value = "CREDIT"
        }

    } catch (error) {
        console.log(error);
        return;
    }
})

item_name.addEventListener("change", async function(event) {
    console.log(event.target.value);
    try {
        const response = await fetch(`/inventory/${event.target.value}`)
        const data = await response.json()

        item_type.value = data.item_type
        item_sacks.value = data.item_sacks
        item_kilos.value = data.item_kilos
        item_grams.value = kg_to_grams(data.item_kilos)
        item_price.value = data.item_price
        
        by_kilos.value = data.item_kilos
        by_sacks.value = 1
    } catch (error) {
        console.log(error);
        return;
    }
})
/**
 * End Fetch Listener
 */

/**
 * Selected Pricing
 */
selected_pricing.addEventListener("change", function(event) {
    /**
     * if market
     *  disable by kilos
     * else 
     *  open by kilos and by sacks
     *  */
    const { value } = event.target
    if (value === "delivery") {
        by_kilos.value = ""
        by_kilos.disabled = true
        by_sacks.disabled = false
        return
    } else if (value === "retail") {
        by_sacks.value = ""
        by_sacks.disabled = true
        by_kilos.disabled = false
    } else {
        by_kilos.disabled = false
        by_sacks.disabled = false
    }
})
/**
 * End Selected Pricing
 */

// amount multiple this items by 5 sacks and kilos
amount.addEventListener('change', function(event) {
    const { value } = event.target
    by_sacks.value = by_sacks.value * value
    by_kilos.value = by_kilos.value * value
})

amount.addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        // const by_sacks_value = by_sacks.value * amount.value
        // const by_kilos_value = by_kilos.value * amount.value

        const by_sacks_str = by_sacks.value > 1 ? `${by_sacks.value} sacks` : `${by_sacks.value} sack` 
        const amount_total = item_price.value * amount.value

        // creating elements for the tbody
        const tr = document.createElement('tr')
        const item_name_col = document.createElement('td')
        const quantity_col = document.createElement('td')
        const pricing_col = document.createElement('td')
        const price_col = document.createElement('td')
        const amount_col = document.createElement('td')
        const options_col = document.createElement('td')

        const delete_button = document.createElement('button')
        delete_button.className = "btn btn-danger del-btn"
        delete_button.innerHTML = "DEL"
        delete_button.onclick = deleteItems
        options_col.appendChild(delete_button)

        if (by_sacks.disabled === false) {
            // append to table class
            item_name_col.innerHTML = item_name.value
            quantity_col.innerHTML = by_sacks_str
            pricing_col.innerHTML = selected_pricing.value
            price_col.innerHTML = item_price.value
            amount_col.innerHTML = amount_total
            data.push({
                item_name: item_name.value,
                quantity: by_sacks_str,
                pricing: selected_pricing.value,
                price: item_price.value,
                amount: amount_total
            })
            totalCavans += parseInt(by_sacks.value)
            // appending this to the parent component (tr)
        } else {
            item_name_col.innerHTML = item_name.value
            quantity_col.innerHTML = by_kilos.value + " Kg"
            pricing_col.innerHTML = selected_pricing.value
            price_col.innerHTML = item_price.value
            amount_col.innerHTML = amount_total

            data.push({
                item_name: item_name.value,
                quantity: by_kilos.value + " Kg",
                pricing: selected_pricing.value,
                price: item_price.value,
                amount: amount_total
            })

            totalCavans += toCavans(parseInt(by_kilos.value))
        }

        tr.appendChild(item_name_col)
        tr.appendChild(quantity_col)
        tr.appendChild(pricing_col)
        tr.appendChild(price_col)
        tr.appendChild(amount_col)
        tr.appendChild(options_col)
        tr.id = data.length - 1
        tbody.appendChild(tr)

        itemSubtotal += parseInt(item_price.value * amount.value)
        item_subtotal.value = itemSubtotal

        grandTotal += parseFloat(item_price.value * amount.value)
        grand_total.value = grandTotal
        cavans.value = parseInt(totalCavans)

        resetItemsFields()
    }
})

/**
 * add ons
 */
add_ons.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const value = e.target.value
        const parsedValue = parseInt(value)
        grandTotal += parsedValue
        grand_total.value = grandTotal
        console.log(grandTotal);

        if (grandTotal < 0)  {
            grandTotal = 0
            grand_total.value = grandTotal
            return
        }
    }
})
/**
 * end add ons
 */

/**
 * additional less
 */
less.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        const value = e.target.value

        const parsedValue = parseInt(value)
        grandTotal -= parsedValue
        grand_total.value = grandTotal

        if (grandTotal < 0)  {
            grandTotal = 0
            grand_total.value = grandTotal
            return
        }
    }
})

/**
 * end additional less
 */

/** 
 * grand total change
*/
grand_total.addEventListener("dblclick", function(e) {
    grand_total.readOnly = false
})

grand_total.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        grandTotal = e.target.value
        console.log(grandTotal);
        grand_total.readOnly = true
    }
})

grand_total.addEventListener('mouseout', function(e) {
    grand_total.readOnly = true
})
/**
 * end grand total
 */

// adding event listeners to delete button
function deleteItems(e) {
    e.target.parentElement.parentElement.remove()
    data.splice(e.target.parentElement.parentElement.id, 1)
    const quantityText = e.target.parentElement.parentElement.getElementsByTagName('td')[1].innerText
    const priceText = e.target.parentElement.parentElement.getElementsByTagName('td')[3].innerText
    const result = quantityText.split(" ")[0]
    if (quantityText.indexOf("Kg")) {
        // Kg
        const kgResult = toCavans(result)
        subtractCavans(kgResult)
    } else if (quantityText.indexOf("sacks")) {
        // sacks
        subtractCavans(result)
    } else if (quantityText.indexOf("sack")) {
        // sack
        subtractCavans(result)
    }
}

// generate uuid
function generateUUID() { 
    var d = new Date().getTime()
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16
        if(d > 0) {
            r = (d + r) % 16 | 0
            d = Math.floor(d / 16)
        } else {
            r = (d2 + r) % 16 | 0
            d2 = Math.floor(d2/16)
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    });
}

function kg_to_grams(kg) {
    return kg * GRAMS
}

function grams_to_kg(grams) {
    return grams * KILOS 
}

function resetItemsFields() {
    item_type.value = ""
    item_sacks.value = ""
    item_kilos.value = ""
    item_grams.value = ""
    amount.value = ""
    by_sacks.value = ""
    by_kilos.value = ""
    item_price.value = ""
    item_name.value = "SELECT"
    selected_pricing.value = "SELECT"
}

function resetFields() {
    resetItemsFields()
    window.location.reload()
}

function toCavans(kg) {
    return parseInt(kg) / 50
}

function subtractCavans(str) {
    totalCavans -= parseInt(str)
    cavans.value = totalCavans
}

// Initializing the Date
(async () => {
    const date = new Date()
    date.toLocaleString("en-US", {
        timeZone: "Asia/Manila"
    })

    const month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    const year = date.getFullYear()
    const today = year + "-" + month + "-" + day

    payment_date.value = today            
})();