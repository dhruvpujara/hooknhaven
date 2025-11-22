const mongoose = require('mongoose');

const

    purchaseSchema = new mongoose.Schema({
        productName: String,
        productCollection: String,
        buyerName: String,
        contactNumber: String,
        address: String,
        customize: String,
    });

module.exports = mongoose.model('Purchase', purchaseSchema);

