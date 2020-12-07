const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const outCodeSchema = new Schema({
    outletCode: {
        type: String
    }
});

const OutletCode = module.exports = mongoose.model('OutletCode', outCodeSchema);