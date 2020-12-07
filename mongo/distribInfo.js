const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const distribSchema = new Schema({
    distribCode: {
        type: String
    }
});

const DistribInfo = module.exports = mongoose.model('DistribInfo', distribSchema);