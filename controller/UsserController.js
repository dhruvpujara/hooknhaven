const mongoose = require('mongoose');
const Product = require('../model/productSchema');
const Purchase = require('../model/purchaseSchema');
const User = require('../model/userSchema');
const bcrypt = require('bcrypt');

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
            if (collectionName === "users") continue;
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

    productcollection = req.session.collection;
    productName = req.session.productName;

    const product = await Product.db.collection(productcollection).findOne({ name: productName });

    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/login');
    }
    const userDetails = await User.findById(userId);

    res.render('buypage', { product, productcollection, userDetails });
};



module.exports.getorderconfirmed = (req, res) => {
    res.render('OrderConfirmed');
}


module.exports.addPurchase = async (req, res) => {
    try {
        if (!req.session.isLoggedIn) {
            return res.redirect('/login');
        }

        const userId = req.session.userId;
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const buyerName = user.username;
        const contactNumber = user.contactNumber;
        const address = user.address;

        const { productName, productCollection, customize, quantity } = req.body;

        const newPurchase = new Purchase({
            productName,
            productCollection,
            buyerName,
            contactNumber,
            address,
            customize,
            quantity,

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

module.exports.getregister = (req, res) => {
    res.render('register');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { name, contact, address, email, password } = req.body;
        console.log('Registering user with data:', req.body);

        const newUser = new User({
            email: email,
            username: name,
            contactNumber: contact,
            address,
            password: password, // Default password for simplicity
        });
        await newUser.save();

        req.session.isLoggedIn = true;
        req.session.userId = newUser._id;
        console.log('User registered successfully:', newUser);

        // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        // res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days

        res.redirect('/');
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

module.exports.getlogin = (req, res) => {
    res.render('login');
}

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email, });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = bcrypt.compare(user.password, password);

        if (!hashedPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        console.log('User logged in successfully:', user);

        res.redirect('/');
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to login user' });
    }
};