const mongoose = require('mongoose');
const Purchase = require('../model/purchaseSchema');

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
});

// Helper function to get or create a model for a collection
const getModelForCollection = (collectionName) => {
    // If a model for this collection already exists, return it
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName];
    }

    // Otherwise, create a new model bound to this collection name
    return mongoose.model(collectionName, productSchema);
};


// functions 


module.exports.getaddProduct = (req, res) => {
    res.render('addProduct');
}

module.exports.getupdateProduct = (req, res) => {
    res.render('updateProduct');
}

// Function to dynamically create a collection
module.exports.createCrochetCollection = async (req, res) => {
    try {
        const { title, firstProductName, firstProductImage, biodata, firstProductPrice } = req.body;

        if (!title || !firstProductName || !firstProductImage || !biodata || !firstProductPrice) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get or create the model for this collection
        const CollectionModel = getModelForCollection(title);

        // Insert the first product
        const newProduct = new CollectionModel({
            name: firstProductName,
            image: firstProductImage,
            price: firstProductPrice,
            description: biodata,
        });

        await newProduct.save();

        res.redirect('/admin/add-column');


    } catch (err) {
        console.error('Error creating collection:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports.postupdateProduct = async (req, res) => {
    try {

        const { type } = req.body;

        if (type === 'add') {

            const { columnName, newProduct, productImage, ProductPrice, biodata } = req.body;

            if (!columnName || !newProduct || !productImage || !ProductPrice || !biodata) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Get or create the model for this collection using our helper function
            const ProductModel = getModelForCollection(columnName);

            const newItem = new ProductModel({
                name: newProduct,
                image: productImage,
                price: ProductPrice,
                description: biodata,
            });

            await newItem.save();
            res.redirect('/');
        } else if (type === 'delete') {

            const { columnName, newProduct } = req.body;

            if (!columnName || !newProduct) {
                return res.status(400).json({ message: 'Column name and product name are required' });
            }
            const ProductModel = getModelForCollection(columnName);

            const deletedProduct = await ProductModel.findOneAndDelete({ name: newProduct });
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.redirect('/');
        }

    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    };
}

module.exports.getorderPanel = async (req, res) => {
    const orders = await Purchase.find()
    res.render('ordersPanel', { orders: orders });
}

module.exports.orderCompleted = async (req, res) => {
    const { orderId } = req.body;
    const deletedOrder = await Purchase.findByIdAndDelete(orderId);
    console.log(deletedOrder)
    res.redirect('/orderPanel'); // Add redirect after deletion
}

module.exports.getAdminHome = (req, res) => {
    res.render('adminHome')
}





