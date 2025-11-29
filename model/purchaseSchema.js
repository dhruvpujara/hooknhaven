const mongoose = require('mongoose');

const

    purchaseSchema = new mongoose.Schema({
        productName: String,
        productCollection: String,
        buyerName: String,
        contactNumber: String,
        quantity: Number,
        address: String,
        customize: String,
        completed: { type: Boolean, default: false },
    });

module.exports = mongoose.model('Purchase', purchaseSchema);

