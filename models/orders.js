const mongoose = require("mongoose");
const ProductSchema = require("./dbitem");


// const ProductSchema = new mongoose.Schema({
//     name: String,
//     price: Number,
//     qty: Number
// })

const OrderSchema = new mongoose.Schema({
    product: [
        {
            ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: ProductSchema
            },
            qty: {
                type: Number
            }
        }
    ],
    receiver_name: { type: String },
    address: { type: String },
    tracking_no: { type: String },
    logistic_company: { type: String },
    shipping_cost: { type: Number },
    created_at: { type: Date, default: Date.now() },
    dispatched_at: { type: Date },
    status: { type: String },
    city: { type: String },
    zip: { type: Number }
});

Order = mongoose.model('Order', OrderSchema);
module.exports = Order;