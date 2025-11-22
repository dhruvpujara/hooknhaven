const mongoose = require('mongoose');
const Product = require('../model/productSchema');
const Purchase = require('../model/purchaseSchema');

const UniversalSchema = new mongoose.Schema({
    title: String,
    name: String,
    image: String,
    description: String,
    price: Number,
});


// This function returns a model for a specific collection name
const getModelForCollection = (collectionName) => {
    // If a model for this collection already exists, return it
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName];
    }

    // Otherwise, create a new model bound to this collection name
    return mongoose.model(collectionName, UniversalSchema, collectionName);
};


module.exports.getindex = (req, res) => {
    res.render('index');
}

module.exports.getproducts = async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();

        const allCollections = [];

        for (const coll of collections) {
            const collectionName = coll.name;
            if (collectionName === "purchases") continue; // Exclude purchases collection

            // Get a model for this collection
            const Model = getModelForCollection(collectionName);

            // Fetch all items from that collection
            const items = await Model.find();

            if (items.length > 0) {
                allCollections.push({
                    collection: collectionName,
                    collectionName: collectionName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    items,
                });
            }
        }

        res.render("products", { allCollections });
    } catch (err) {
        console.error("Error displaying sections:", err);
        res.status(500).send("Server Error");
    }
};

module.exports.getproductdetails = async (req, res) => {
    try {
        const { item, collection } = req.params;

        // Get the model for the specific collection
        const Model = getModelForCollection(collection);

        const product = await Model.findById(item);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.session.collection = collection;
        req.session.productName = product.name;
        res.render('productDetails', { product });

    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports.buyProduct = async (req, res) => {
    console.log(req.session.collection, req.session.productName);
    productcollection = req.session.collection;
    productName = req.session.productName;
    res.render('buypage', { productcollection, productName });
};



module.exports.getorderconfirmed = (req, res) => {
    res.render('OrderConfirmed');
}


module.exports.addPurchase = async (req, res) => {
    try {
        customize: String,
            { productName, productCollection, buyerName, contactNumber, address, } = req.body

        const newPurchase = new Purchase({
            productName,
            productCollection,
            buyerName,
            contactNumber,
            address,
        });

        await newPurchase.save();
        console.log('Purchase saved successfully:', newPurchase);
        res.redirect('/OrderConfirmed');
    }
    catch (error) {
        console.error('Error saving purchase:', error);
        res.status(500).json({ error: 'Failed to record purchase' });
    }
};