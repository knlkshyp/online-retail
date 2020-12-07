const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const productSchema = new Schema({
    company: {
        type: String
    },
    segment: {
        type: String
    },
    name: {
        type: String
    },
    cost: {
        type: String
    },
    desc: {
        type: String
    }

});

const ProductInfo = module.exports = mongoose.model('ProductInfo', productSchema);