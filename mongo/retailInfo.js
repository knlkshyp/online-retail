const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const retailInfoSchema = new Schema({
    empCode: {
        type: String
    },
    outletCode: {
        type: String
    },
    outletName: {
        type: String
    },
    ownerName: {
        type: String
    },
    contactNum: {
        type: String
    },
    outletAddr: {
        type: String
    },
    pin: {
        type: String
    },
    date: {
        type: String
    }
});

const RetailInfo = module.exports = mongoose.model('RetailInfo', retailInfoSchema);