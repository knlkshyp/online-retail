const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const orderInfoSchema = new Schema({
    empCode: {
        type: String
    },
    distribCode: {
        type: String
    },
    outletCode: {
        type: String
    },
    productItem: {
        type: Array
    },
    quantity: {
        type: Array
    },
    date: {
        type: String
    }
});

const OrderInfo = module.exports = mongoose.model('OrderInfo', orderInfoSchema);